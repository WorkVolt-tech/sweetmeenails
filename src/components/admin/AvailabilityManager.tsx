"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";

export default function AvailabilityManager({ locale }: { locale: Locale }) {
  const supabase = createClient();
  const [slots, setSlots] = useState<any[]>([]);
  const [blocked, setBlocked] = useState<any[]>([]);

  const [slotDate, setSlotDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [maxAppointments, setMaxAppointments] = useState(1);
  const [note, setNote] = useState("");

  const [blockDate, setBlockDate] = useState("");
  const [blockWholeDay, setBlockWholeDay] = useState(true);
  const [blockReason, setBlockReason] = useState("");

  async function load() {
    const today = new Date().toISOString().slice(0, 10);
    const [{ data: s }, { data: b }] = await Promise.all([
      supabase.from("availability_slots").select("*").gte("slot_date", today).order("slot_date").order("start_time").limit(60),
      supabase.from("blocked_dates").select("*").gte("blocked_date", today).order("blocked_date").limit(30),
    ]);
    setSlots(s ?? []);
    setBlocked(b ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!slotDate) return;
    await supabase.from("availability_slots").insert({
      slot_date: slotDate,
      start_time: startTime,
      end_time: endTime,
      max_appointments: maxAppointments,
      internal_note: note || null,
    });
    setNote("");
    load();
  }

  async function toggleSlot(id: string, isActive: boolean) {
    await supabase.from("availability_slots").update({ is_active: !isActive }).eq("id", id);
    load();
  }

  async function createBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!blockDate) return;
    await supabase.from("blocked_dates").insert({
      blocked_date: blockDate,
      start_time: blockWholeDay ? null : startTime,
      end_time: blockWholeDay ? null : endTime,
      reason: blockReason || null,
    });
    setBlockReason("");
    load();
  }

  async function removeBlock(id: string) {
    await supabase.from("blocked_dates").delete().eq("id", id);
    load();
  }

  const t = locale === "en"
    ? {
        newSlot: "Add available slot", date: "Date", start: "Start time", end: "End time", max: "Max appointments",
        note: "Internal note (optional)", add: "Add slot", upcoming: "Upcoming slots", active: "Active", inactive: "Blocked",
        blockTitle: "Block a date", wholeDay: "Entire day", reason: "Reason (optional)", addBlock: "Block date",
        blockedDates: "Blocked dates", remove: "Remove",
      }
    : {
        newSlot: "Ajouter un créneau", date: "Date", start: "Heure de début", end: "Heure de fin", max: "Nombre maximal de rendez-vous",
        note: "Note interne (facultatif)", add: "Ajouter le créneau", upcoming: "Créneaux à venir", active: "Actif", inactive: "Bloqué",
        blockTitle: "Bloquer une date", wholeDay: "Journée entière", reason: "Raison (facultatif)", addBlock: "Bloquer la date",
        blockedDates: "Dates bloquées", remove: "Retirer",
      };

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2">
      <div className="space-y-8">
        <form onSubmit={createSlot} className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
          <h3 className="font-display text-lg font-semibold text-royal">{t.newSlot}</h3>
          <div className="mt-4 space-y-3">
            <LabeledInput label={t.date} type="date" value={slotDate} onChange={setSlotDate} />
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput label={t.start} type="time" value={startTime} onChange={setStartTime} />
              <LabeledInput label={t.end} type="time" value={endTime} onChange={setEndTime} />
            </div>
            <LabeledInput label={t.max} type="number" value={String(maxAppointments)} onChange={(v) => setMaxAppointments(Number(v))} />
            <LabeledInput label={t.note} value={note} onChange={setNote} />
          </div>
          <button className="mt-4 w-full rounded-full bg-royal px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-royal-dark">
            {t.add}
          </button>
        </form>

        <form onSubmit={createBlock} className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
          <h3 className="font-display text-lg font-semibold text-royal">{t.blockTitle}</h3>
          <div className="mt-4 space-y-3">
            <LabeledInput label={t.date} type="date" value={blockDate} onChange={setBlockDate} />
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input type="checkbox" checked={blockWholeDay} onChange={(e) => setBlockWholeDay(e.target.checked)} />
              {t.wholeDay}
            </label>
            <LabeledInput label={t.reason} value={blockReason} onChange={setBlockReason} />
          </div>
          <button className="mt-4 w-full rounded-full bg-blossom-dark px-6 py-2.5 text-sm font-semibold text-white shadow-soft">
            {t.addBlock}
          </button>
        </form>
      </div>

      <div className="space-y-8">
        <div className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
          <h3 className="font-display text-lg font-semibold text-royal">{t.upcoming}</h3>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto text-sm">
            {slots.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-lg bg-lavender-soft/40 px-3 py-2">
                <span>
                  {s.slot_date} · {s.start_time?.slice(0, 5)}–{s.end_time?.slice(0, 5)} ({s.max_appointments})
                </span>
                <button
                  onClick={() => toggleSlot(s.id, s.is_active)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${s.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
                >
                  {s.is_active ? t.active : t.inactive}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
          <h3 className="font-display text-lg font-semibold text-royal">{t.blockedDates}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {blocked.map((b) => (
              <li key={b.id} className="flex items-center justify-between rounded-lg bg-lavender-soft/40 px-3 py-2">
                <span>
                  {b.blocked_date} {b.start_time ? `${b.start_time.slice(0, 5)}–${b.end_time?.slice(0, 5)}` : t.wholeDay}
                  {b.reason ? ` · ${b.reason}` : ""}
                </span>
                <button onClick={() => removeBlock(b.id)} className="text-xs text-red-600 hover:underline">
                  {t.remove}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-royal">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-lavender bg-white px-3 py-2 text-sm focus:border-royal focus:outline-none"
      />
    </div>
  );
}
