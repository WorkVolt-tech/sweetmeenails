"use client";

import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";

const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-400",
  accepted: "bg-blue-400",
  confirmed: "bg-green-500",
  rejected: "bg-red-400",
  cancelled_by_client: "bg-gray-400",
  cancelled_by_salon: "bg-gray-400",
  completed: "bg-emerald-500",
  no_show: "bg-red-500",
  reschedule_requested: "bg-purple-400",
};

export default function CalendarView({ locale }: { locale: Locale }) {
  const supabase = createClient();
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const monthStart = monthCursor.toISOString().slice(0, 10);
  const monthEndDate = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);
  const monthEnd = monthEndDate.toISOString().slice(0, 10);

  useEffect(() => {
    supabase
      .from("appointments")
      .select("id, reference_number, appointment_date, start_time, status, clients(full_name)")
      .gte("appointment_date", monthStart)
      .lte("appointment_date", monthEnd)
      .then(({ data }) => setAppointments(data ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthStart, monthEnd]);

  const byDate = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const a of appointments) {
      const list = map.get(a.appointment_date) ?? [];
      list.push(a);
      map.set(a.appointment_date, list);
    }
    return map;
  }, [appointments]);

  const firstWeekday = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1).getDay();
  const daysInMonth = monthEndDate.getDate();
  const cells: (string | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      `${monthStart.slice(0, 8)}${String(i + 1).padStart(2, "0")}`
    ),
  ];

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-xl2 bg-white p-4 shadow-card ring-1 ring-lavender-soft">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
            className="rounded-full px-3 py-1 text-sm hover:bg-lavender-soft"
          >
            ←
          </button>
          <span className="font-display text-lg font-semibold text-royal">
            {monthCursor.toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", { month: "long", year: "numeric" })}
          </span>
          <button
            onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
            className="rounded-full px-3 py-1 text-sm hover:bg-lavender-soft"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink/40">
          {(locale === "fr" ? ["D", "L", "M", "M", "J", "V", "S"] : ["S", "M", "T", "W", "T", "F", "S"]).map((d, i) => (
            <div key={i} className="py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />;
            const dayAppointments = byDate.get(date) ?? [];
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={clsx(
                  "flex h-16 flex-col items-center justify-start rounded-lg p-1 text-xs",
                  selectedDate === date ? "bg-royal text-white" : "hover:bg-lavender-soft"
                )}
              >
                <span>{Number(date.slice(-2))}</span>
                <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                  {dayAppointments.slice(0, 4).map((a) => (
                    <span key={a.id} className={clsx("h-1.5 w-1.5 rounded-full", STATUS_DOT[a.status] ?? "bg-gray-300")} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl2 bg-white p-4 shadow-card ring-1 ring-lavender-soft">
        <h3 className="font-display text-lg font-semibold text-royal">{selectedDate}</h3>
        <ul className="mt-3 space-y-2">
          {(byDate.get(selectedDate) ?? []).map((a) => (
            <li key={a.id} className="flex items-center gap-2 rounded-lg bg-lavender-soft/50 px-3 py-2 text-sm">
              <span className={clsx("h-2 w-2 rounded-full", STATUS_DOT[a.status] ?? "bg-gray-300")} />
              <span className="font-mono text-xs text-ink/50">{a.start_time?.slice(0, 5)}</span>
              <span className="flex-1">{a.clients?.full_name}</span>
            </li>
          ))}
          {(byDate.get(selectedDate) ?? []).length === 0 && (
            <li className="text-sm text-ink/40">{locale === "en" ? "Nothing scheduled." : "Rien de prévu."}</li>
          )}
        </ul>
      </div>
    </div>
  );
}
