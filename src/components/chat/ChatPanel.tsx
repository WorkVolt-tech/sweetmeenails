"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n/config";
import { Card } from "@/components/ui/Card";

type Message = {
  id: string;
  sender_type: "client" | "admin" | "system";
  body: string | null;
  image_url: string | null;
  created_at: string;
};

const POLL_MS = 4000;

export default function ChatPanel({
  locale,
  appointmentId,
  accessToken,
}: {
  locale: Locale;
  appointmentId: string;
  accessToken: string;
}) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/appointments/${appointmentId}/conversation?accessToken=${encodeURIComponent(accessToken)}`)
      .then((res) => res.json())
      .then((data) => setConversationId(data.conversation?.id ?? null));
  }, [appointmentId, accessToken]);

  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;

    async function poll() {
      const res = await fetch(
        `/api/chat/${conversationId}/messages?accessToken=${encodeURIComponent(accessToken)}&appointmentId=${appointmentId}`
      );
      if (!res.ok || cancelled) return;
      const data = await res.json();
      setMessages(data.messages ?? []);
    }

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [conversationId, accessToken, appointmentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !conversationId) return;
    setSending(true);
    const body = draft;
    setDraft("");
    try {
      await fetch(`/api/chat/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, appointmentId, body }),
      });
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender_type: "client", body, image_url: null, created_at: new Date().toISOString() },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="flex h-[420px] flex-col p-0">
      <div className="border-b border-lavender-soft px-4 py-3">
        <p className="font-display font-semibold text-royal">
          {locale === "en" ? "Message the salon" : "Écrire au salon"}
        </p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={clsx(
              "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
              m.sender_type === "client"
                ? "ml-auto bg-royal text-white"
                : m.sender_type === "system"
                ? "mx-auto bg-lavender-soft text-center text-xs text-royal/70"
                : "bg-lavender-soft text-ink"
            )}
          >
            {m.body}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-lavender-soft p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={locale === "en" ? "Type a message…" : "Écrivez un message…"}
          className="flex-1 rounded-full border border-lavender bg-white px-4 py-2 text-sm focus:border-royal focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="rounded-full bg-royal px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {locale === "en" ? "Send" : "Envoyer"}
        </button>
      </form>
    </Card>
  );
}
