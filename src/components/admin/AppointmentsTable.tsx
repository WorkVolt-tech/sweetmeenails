"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";
import { formatPrice } from "@/lib/format";

const STATUSES = [
  "pending",
  "accepted",
  "rejected",
  "confirmed",
  "cancelled_by_client",
  "cancelled_by_salon",
  "completed",
  "no_show",
  "reschedule_requested",
] as const;

const STATUS_LABEL: Record<string, { en: string; fr: string }> = {
  pending: { en: "Pending", fr: "En attente" },
  accepted: { en: "Accepted", fr: "Acceptée" },
  rejected: { en: "Rejected", fr: "Refusée" },
  confirmed: { en: "Confirmed", fr: "Confirmé" },
  cancelled_by_client: { en: "Cancelled by client", fr: "Annulé par la cliente" },
  cancelled_by_salon: { en: "Cancelled by salon", fr: "Annulé par le salon" },
  completed: { en: "Completed", fr: "Terminé" },
  no_show: { en: "No-show", fr: "Absence" },
  reschedule_requested: { en: "Reschedule requested", fr: "Changement demandé" },
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled_by_client: "bg-gray-200 text-gray-700",
  cancelled_by_salon: "bg-gray-200 text-gray-700",
  completed: "bg-emerald-100 text-emerald-800",
  no_show: "bg-red-100 text-red-800",
  reschedule_requested: "bg-purple-100 text-purple-800",
};

export default function AppointmentsTable({ locale }: { locale: Locale }) {
  const supabase = createClient();
  const [rows, setRows] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    let query = supabase
      .from("appointments")
      .select("*, clients(full_name, phone_normalized, email), services(name_en, name_fr)")
      .order("appointment_date", { ascending: false })
      .order("start_time", { ascending: false })
      .limit(100);
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    const { data } = await query;
    setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function setStatus(id: string, status: string) {
    await supabase.from("appointments").update({ status }).eq("id", id);
    load();
  }

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      r.reference_number?.toLowerCase().includes(term) ||
      r.clients?.full_name?.toLowerCase().includes(term) ||
      r.clients?.phone_normalized?.includes(term) ||
      r.clients?.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={locale === "en" ? "Search name, phone, email, reference…" : "Nom, téléphone, courriel, référence…"}
          className="w-64 rounded-lg border border-lavender bg-white px-3 py-2 text-sm focus:border-royal focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-lavender bg-white px-3 py-2 text-sm focus:border-royal focus:outline-none"
        >
          <option value="all">{locale === "en" ? "All statuses" : "Tous les statuts"}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s][locale]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl2 bg-white shadow-card ring-1 ring-lavender-soft">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-lavender-soft text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">{locale === "en" ? "Reference" : "Référence"}</th>
              <th className="px-4 py-3">{locale === "en" ? "Client" : "Cliente"}</th>
              <th className="px-4 py-3">{locale === "en" ? "Service" : "Service"}</th>
              <th className="px-4 py-3">{locale === "en" ? "Date / time" : "Date / heure"}</th>
              <th className="px-4 py-3">{locale === "en" ? "Price" : "Prix"}</th>
              <th className="px-4 py-3">{locale === "en" ? "Status" : "Statut"}</th>
              <th className="px-4 py-3">{locale === "en" ? "Actions" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-lavender-soft/60 last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{r.reference_number}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{r.clients?.full_name}</div>
                  <div className="text-xs text-ink/50">{r.clients?.phone_normalized}</div>
                </td>
                <td className="px-4 py-3">{locale === "en" ? r.services?.name_en : r.services?.name_fr}</td>
                <td className="px-4 py-3">
                  {r.appointment_date} · {r.start_time?.slice(0, 5)}
                </td>
                <td className="px-4 py-3">{r.price_estimate_cents != null ? formatPrice(r.price_estimate_cents) : "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[r.status]}`}>
                    {STATUS_LABEL[r.status]?.[locale] ?? r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {r.status === "pending" && (
                      <>
                        <ActionButton onClick={() => setStatus(r.id, "accepted")} label={locale === "en" ? "Accept" : "Accepter"} />
                        <ActionButton onClick={() => setStatus(r.id, "rejected")} label={locale === "en" ? "Reject" : "Refuser"} danger />
                      </>
                    )}
                    {(r.status === "accepted" || r.status === "reschedule_requested") && (
                      <ActionButton onClick={() => setStatus(r.id, "confirmed")} label={locale === "en" ? "Confirm" : "Confirmer"} />
                    )}
                    {["accepted", "confirmed"].includes(r.status) && (
                      <>
                        <ActionButton onClick={() => setStatus(r.id, "completed")} label={locale === "en" ? "Completed" : "Terminé"} />
                        <ActionButton onClick={() => setStatus(r.id, "no_show")} label={locale === "en" ? "No-show" : "Absence"} danger />
                        <ActionButton onClick={() => setStatus(r.id, "cancelled_by_salon")} label={locale === "en" ? "Cancel" : "Annuler"} danger />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/40">
                  {locale === "en" ? "No appointments found." : "Aucun rendez-vous trouvé."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({ onClick, label, danger }: { onClick: () => void; label: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        danger ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-lavender-soft text-royal hover:bg-lavender"
      }`}
    >
      {label}
    </button>
  );
}
