import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);
  const weekAhead = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);

  const [
    { count: todayCount },
    { count: pendingCount },
    { count: confirmedCount },
    { count: upcomingCount },
    { data: recentCancellations },
    { count: unreadCount },
  ] = await Promise.all([
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("appointment_date", today),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .gte("appointment_date", today)
      .lte("appointment_date", weekAhead)
      .in("status", ["accepted", "confirmed"]),
    supabase
      .from("appointments")
      .select("id, reference_number, cancelled_at")
      .in("status", ["cancelled_by_client", "cancelled_by_salon"])
      .order("cancelled_at", { ascending: false })
      .limit(5),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("sender_type", "client").eq("is_read_by_admin", false),
  ]);

  const stats = [
    { label: locale === "en" ? "Today's appointments" : "Rendez-vous d'aujourd'hui", value: todayCount ?? 0 },
    { label: locale === "en" ? "Pending requests" : "Demandes en attente", value: pendingCount ?? 0 },
    { label: locale === "en" ? "Confirmed" : "Confirmés", value: confirmedCount ?? 0 },
    { label: locale === "en" ? "Upcoming (7 days)" : "À venir (7 jours)", value: upcomingCount ?? 0 },
    { label: locale === "en" ? "Unread messages" : "Messages non lus", value: unreadCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-royal">
        {locale === "en" ? "Dashboard" : "Tableau de bord"}
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
            <p className="text-3xl font-semibold text-royal">{s.value}</p>
            <p className="mt-1 text-xs text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl2 bg-white p-5 shadow-card ring-1 ring-lavender-soft">
        <h2 className="font-display text-lg font-semibold text-royal">
          {locale === "en" ? "Recent cancellations" : "Annulations récentes"}
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-ink/70">
          {(recentCancellations ?? []).map((c: any) => (
            <li key={c.id}>{c.reference_number}</li>
          ))}
          {(recentCancellations ?? []).length === 0 && (
            <li className="text-ink/40">{locale === "en" ? "None yet." : "Aucune pour le moment."}</li>
          )}
        </ul>
      </div>
    </div>
  );
}
