"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";

export default function ContentManager({ locale }: { locale: Locale }) {
  const supabase = createClient();
  const [settings, setSettings] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("website_settings").select("*").then(({ data }) => setSettings(data ?? []));
    supabase.from("salon_policies").select("*").order("display_order").then(({ data }) => setPolicies(data ?? []));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveSetting(key: string, patch: Record<string, any>) {
    await supabase.from("website_settings").update(patch).eq("key", key);
    setSavedAt(new Date().toLocaleTimeString());
  }

  async function savePolicy(id: string, patch: Record<string, any>) {
    await supabase.from("salon_policies").update(patch).eq("id", id);
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div className="mt-6 space-y-8">
      {savedAt && <p className="text-xs text-green-700">{locale === "en" ? "Saved" : "Enregistré"} · {savedAt}</p>}

      <section className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
        <h3 className="font-display text-lg font-semibold text-royal">
          {locale === "en" ? "Site settings" : "Paramètres du site"}
        </h3>
        <div className="mt-4 space-y-4">
          {settings.map((s) => (
            <div key={s.key} className="grid gap-2 sm:grid-cols-[140px_1fr_1fr] sm:items-center">
              <span className="text-xs font-semibold uppercase text-ink/50">{s.key}</span>
              <input
                defaultValue={s.value_en ?? ""}
                onBlur={(e) => saveSetting(s.key, { value_en: e.target.value })}
                placeholder="English"
                className="rounded-lg border border-lavender px-3 py-2 text-sm"
              />
              <input
                defaultValue={s.value_fr ?? ""}
                onBlur={(e) => saveSetting(s.key, { value_fr: e.target.value })}
                placeholder="Français"
                className="rounded-lg border border-lavender px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
        <h3 className="font-display text-lg font-semibold text-royal">
          {locale === "en" ? "Salon policies" : "Politiques du salon"}
        </h3>
        <div className="mt-4 space-y-6">
          {policies.map((p) => (
            <div key={p.id} className="border-b border-lavender-soft pb-4 last:border-0">
              <p className="mb-2 text-xs font-semibold uppercase text-ink/50">{p.policy_key}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <textarea
                  defaultValue={p.body_en}
                  onBlur={(e) => savePolicy(p.id, { body_en: e.target.value })}
                  rows={3}
                  className="rounded-lg border border-lavender px-3 py-2 text-sm"
                />
                <textarea
                  defaultValue={p.body_fr}
                  onBlur={(e) => savePolicy(p.id, { body_fr: e.target.value })}
                  rows={3}
                  className="rounded-lg border border-lavender px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
