"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";

export default function SettingsManager({ locale }: { locale: Locale }) {
  const supabase = createClient();
  const [reminders, setReminders] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("reminder_settings").select("*").order("hours_before", { ascending: false }).then(({ data }) => setReminders(data ?? []));
    supabase.from("administrators").select("*").then(({ data }) => setAdmins(data ?? []));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleReminder(id: string, isActive: boolean) {
    await supabase.from("reminder_settings").update({ is_active: !isActive }).eq("id", id);
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, is_active: !isActive } : r)));
  }

  return (
    <div className="mt-6 space-y-8">
      <section className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
        <h3 className="font-display text-lg font-semibold text-royal">
          {locale === "en" ? "Appointment reminders" : "Rappels de rendez-vous"}
        </h3>
        <p className="mt-1 text-sm text-ink/60">
          {locale === "en"
            ? "Sent automatically by the /api/cron/reminders scheduled job."
            : "Envoyés automatiquement par la tâche planifiée /api/cron/reminders."}
        </p>
        <ul className="mt-4 space-y-2">
          {reminders.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-lg bg-lavender-soft/40 px-4 py-2 text-sm">
              <span>{r.hours_before}h {locale === "en" ? "before" : "avant"}</span>
              <button
                onClick={() => toggleReminder(r.id, r.is_active)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${r.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
              >
                {r.is_active ? (locale === "en" ? "On" : "Activé") : (locale === "en" ? "Off" : "Désactivé")}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
        <h3 className="font-display text-lg font-semibold text-royal">
          {locale === "en" ? "Administrators" : "Administrateurs"}
        </h3>
        <p className="mt-1 text-sm text-ink/60">
          {locale === "en"
            ? "Add new administrators from the Supabase dashboard (Authentication → Users), then insert a matching row in the administrators table."
            : "Ajoutez des administrateurs depuis le tableau de bord Supabase (Authentication → Users), puis ajoutez la ligne correspondante dans la table administrators."}
        </p>
        <ul className="mt-4 space-y-2">
          {admins.map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded-lg bg-lavender-soft/40 px-4 py-2 text-sm">
              <span>{a.full_name}</span>
              <span className="rounded-full bg-royal/10 px-2.5 py-1 text-xs font-semibold text-royal">{a.role}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
