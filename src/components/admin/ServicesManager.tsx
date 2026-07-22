"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";
import { formatPrice } from "@/lib/format";

export default function ServicesManager({ locale }: { locale: Locale }) {
  const supabase = createClient();
  const [services, setServices] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  async function load() {
    const { data } = await supabase.from("services").select("*").order("display_order");
    setServices(data ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startNew() {
    setEditing({
      name_en: "",
      name_fr: "",
      description_en: "",
      description_fr: "",
      duration_minutes: 30,
      price_cents: 0,
      price_is_starting_at: false,
      is_active: true,
    });
  }

  async function save() {
    if (!editing) return;
    if (editing.id) {
      const { id, service_categories, ...patch } = editing;
      await supabase.from("services").update(patch).eq("id", id);
    } else {
      await supabase.from("services").insert(editing);
    }
    setEditing(null);
    load();
  }

  async function toggleActive(s: any) {
    await supabase.from("services").update({ is_active: !s.is_active }).eq("id", s.id);
    load();
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
      <div>
        <button
          onClick={startNew}
          className="mb-4 rounded-full bg-royal px-5 py-2 text-sm font-semibold text-white shadow-soft hover:bg-royal-dark"
        >
          {locale === "en" ? "+ Add service" : "+ Ajouter un service"}
        </button>
        <div className="overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-lavender-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-lavender-soft text-left text-xs uppercase text-ink/50">
                <th className="px-4 py-3">{locale === "en" ? "Name" : "Nom"}</th>
                <th className="px-4 py-3">{locale === "en" ? "Price" : "Prix"}</th>
                <th className="px-4 py-3">{locale === "en" ? "Duration" : "Durée"}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-lavender-soft/60 last:border-0">
                  <td className="px-4 py-3">{locale === "en" ? s.name_en : s.name_fr}</td>
                  <td className="px-4 py-3">{formatPrice(s.price_cents)}</td>
                  <td className="px-4 py-3">{s.duration_minutes} min</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(s)} className="mr-2 text-xs text-royal hover:underline">
                      {locale === "en" ? "Edit" : "Modifier"}
                    </button>
                    <button
                      onClick={() => toggleActive(s)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${s.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
                    >
                      {s.is_active ? (locale === "en" ? "Active" : "Actif") : (locale === "en" ? "Hidden" : "Masqué")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
          <h3 className="font-display text-lg font-semibold text-royal">
            {editing.id ? (locale === "en" ? "Edit service" : "Modifier le service") : (locale === "en" ? "New service" : "Nouveau service")}
          </h3>
          <div className="mt-4 space-y-3">
            <Field label="Name (EN)" value={editing.name_en} onChange={(v) => setEditing({ ...editing, name_en: v })} />
            <Field label="Nom (FR)" value={editing.name_fr} onChange={(v) => setEditing({ ...editing, name_fr: v })} />
            <Field label="Description (EN)" value={editing.description_en ?? ""} onChange={(v) => setEditing({ ...editing, description_en: v })} textarea />
            <Field label="Description (FR)" value={editing.description_fr ?? ""} onChange={(v) => setEditing({ ...editing, description_fr: v })} textarea />
            <div className="grid grid-cols-2 gap-3">
              <Field label={locale === "en" ? "Duration (min)" : "Durée (min)"} type="number" value={String(editing.duration_minutes)} onChange={(v) => setEditing({ ...editing, duration_minutes: Number(v) })} />
              <Field label={locale === "en" ? "Price (cents)" : "Prix (cents)"} type="number" value={String(editing.price_cents)} onChange={(v) => setEditing({ ...editing, price_cents: Number(v) })} />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input type="checkbox" checked={editing.price_is_starting_at} onChange={(e) => setEditing({ ...editing, price_is_starting_at: e.target.checked })} />
              {locale === "en" ? "Price is a starting-at price" : "Le prix est un prix de départ"}
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="rounded-full bg-royal px-5 py-2 text-sm font-semibold text-white">
              {locale === "en" ? "Save" : "Enregistrer"}
            </button>
            <button onClick={() => setEditing(null)} className="rounded-full border border-royal/30 px-5 py-2 text-sm font-semibold text-royal">
              {locale === "en" ? "Cancel" : "Annuler"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-royal">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-lavender bg-white px-3 py-2 text-sm focus:border-royal focus:outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-lavender bg-white px-3 py-2 text-sm focus:border-royal focus:outline-none"
        />
      )}
    </div>
  );
}
