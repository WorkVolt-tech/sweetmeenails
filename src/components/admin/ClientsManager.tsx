"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";

export default function ClientsManager({ locale }: { locale: Locale }) {
  const supabase = createClient();
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => setClients(data ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openClient(client: any) {
    setSelected(client);
    const { data } = await supabase
      .from("appointments")
      .select("id, reference_number, appointment_date, status, services(name_en, name_fr)")
      .eq("client_id", client.id)
      .order("appointment_date", { ascending: false });
    setHistory(data ?? []);
  }

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const t = search.toLowerCase();
    return c.full_name?.toLowerCase().includes(t) || c.phone_normalized?.includes(t) || c.email?.toLowerCase().includes(t);
  });

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
      <div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={locale === "en" ? "Search clients…" : "Rechercher des clientes…"}
          className="mb-4 w-full max-w-sm rounded-lg border border-lavender bg-white px-3 py-2 text-sm focus:border-royal focus:outline-none"
        />
        <div className="overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-lavender-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-lavender-soft text-left text-xs uppercase text-ink/50">
                <th className="px-4 py-3">{locale === "en" ? "Name" : "Nom"}</th>
                <th className="px-4 py-3">{locale === "en" ? "Phone" : "Téléphone"}</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">{locale === "en" ? "Language" : "Langue"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => openClient(c)}
                  className="cursor-pointer border-b border-lavender-soft/60 last:border-0 hover:bg-lavender-soft/40"
                >
                  <td className="px-4 py-3">{c.full_name}</td>
                  <td className="px-4 py-3">{c.phone_normalized}</td>
                  <td className="px-4 py-3">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 uppercase">{c.preferred_language}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
          <h3 className="font-display text-lg font-semibold text-royal">{selected.full_name}</h3>
          <p className="text-sm text-ink/60">{selected.phone_normalized} · {selected.email ?? "—"}</p>
          <h4 className="mt-4 text-xs font-semibold uppercase text-ink/40">
            {locale === "en" ? "Appointment history" : "Historique des rendez-vous"}
          </h4>
          <ul className="mt-2 space-y-2 text-sm">
            {history.map((h) => (
              <li key={h.id} className="flex justify-between rounded-lg bg-lavender-soft/40 px-3 py-2">
                <span>{locale === "en" ? h.services?.name_en : h.services?.name_fr}</span>
                <span className="text-ink/50">{h.appointment_date}</span>
              </li>
            ))}
            {history.length === 0 && <li className="text-ink/40">{locale === "en" ? "No history yet." : "Aucun historique."}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
