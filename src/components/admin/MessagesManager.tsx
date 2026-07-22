"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";

export default function MessagesManager({ locale }: { locale: Locale }) {
  const supabase = createClient();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState("");

  async function loadConversations() {
    const { data } = await supabase
      .from("conversations")
      .select("*, appointments(reference_number, status), clients(full_name)")
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(50);
    setConversations(data ?? []);
  }

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeId) return;
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", activeId)
      .order("created_at")
      .then(({ data }) => setMessages(data ?? []));

    supabase.from("messages").update({ is_read_by_admin: true }).eq("conversation_id", activeId).eq("sender_type", "client").then();

    // Realtime: admins are authenticated Supabase users, so RLS-scoped
    // Realtime works directly here (unlike the client-facing chat panel,
    // which has to poll — see src/components/chat/ChatPanel.tsx).
    const channel = supabase
      .channel(`messages-${activeId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeId}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  async function send() {
    if (!draft.trim() || !activeId) return;
    const body = draft;
    setDraft("");
    await supabase.from("messages").insert({ conversation_id: activeId, sender_type: "admin", body });
    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", activeId);
  }

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className="max-h-[600px] overflow-y-auto rounded-xl2 bg-white shadow-card ring-1 ring-lavender-soft">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={clsx(
              "block w-full border-b border-lavender-soft/60 px-4 py-3 text-left text-sm last:border-0",
              activeId === c.id ? "bg-lavender-soft" : "hover:bg-lavender-soft/40"
            )}
          >
            <div className="font-medium text-ink">{c.clients?.full_name}</div>
            <div className="text-xs text-ink/50">{c.appointments?.reference_number}</div>
          </button>
        ))}
        {conversations.length === 0 && (
          <p className="p-4 text-sm text-ink/40">{locale === "en" ? "No conversations yet." : "Aucune conversation."}</p>
        )}
      </div>

      <div className="flex h-[600px] flex-col rounded-xl2 bg-white shadow-card ring-1 ring-lavender-soft">
        {!activeId ? (
          <p className="m-auto text-sm text-ink/40">
            {locale === "en" ? "Select a conversation" : "Sélectionnez une conversation"}
          </p>
        ) : (
          <>
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={clsx(
                    "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                    m.sender_type === "admin" ? "ml-auto bg-royal text-white" : "bg-lavender-soft text-ink"
                  )}
                >
                  {m.body}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-lavender-soft p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={locale === "en" ? "Type a reply…" : "Écrire une réponse…"}
                className="flex-1 rounded-full border border-lavender bg-white px-4 py-2 text-sm focus:border-royal focus:outline-none"
              />
              <button onClick={send} className="rounded-full bg-royal px-4 py-2 text-sm font-semibold text-white">
                {locale === "en" ? "Send" : "Envoyer"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
