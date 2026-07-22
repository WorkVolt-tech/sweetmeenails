import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";

// Call this on a schedule (every 15–30 min is plenty) from a GitHub
// Actions cron workflow or Supabase's `pg_cron` + `pg_net`, hitting:
//   POST /api/cron/reminders   with header  x-cron-secret: $CRON_SECRET
// It sends one reminder per appointment per configured window
// (reminder_settings.hours_before), and never double-sends because it
// checks the `notifications` table first.
export async function POST(req: NextRequest) {
  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  await supabase.rpc("release_expired_holds");

  const { data: windows } = await supabase
    .from("reminder_settings")
    .select("hours_before")
    .eq("is_active", true);

  let sent = 0;

  for (const window of windows ?? []) {
    const targetStart = new Date(Date.now() + window.hours_before * 3_600_000);
    const targetEnd = new Date(targetStart.getTime() + 30 * 60_000); // 30-min bucket per cron run

    const { data: appointments } = await supabase
      .from("appointments")
      .select("id, appointment_date, start_time, preferred_language, clients!inner(email)")
      .in("status", ["accepted", "confirmed"])
      .gte("appointment_date", targetStart.toISOString().slice(0, 10))
      .lte("appointment_date", targetEnd.toISOString().slice(0, 10));

    for (const appt of appointments ?? []) {
      const apptDateTime = new Date(`${appt.appointment_date}T${appt.start_time}`);
      if (apptDateTime < targetStart || apptDateTime > targetEnd) continue;

      const { data: alreadySent } = await supabase
        .from("notifications")
        .select("id")
        .eq("appointment_id", appt.id)
        .eq("type", "appointment_reminder")
        .eq("payload->>hours_before", String(window.hours_before))
        .maybeSingle();
      if (alreadySent) continue;

      const email = (appt as any).clients?.email;
      if (email) {
        await sendEmail({
          to: email,
          locale: appt.preferred_language,
          subject: {
            en: "Reminder: your Sweet Mee Nails appointment",
            fr: "Rappel : votre rendez-vous Sweet Mee Nails",
          },
          html: {
            en: `<p>This is a reminder of your appointment on ${appt.appointment_date} at ${appt.start_time}.</p>`,
            fr: `<p>Ceci est un rappel de votre rendez-vous le ${appt.appointment_date} à ${appt.start_time}.</p>`,
          },
        });
      }

      await supabase.from("notifications").insert({
        appointment_id: appt.id,
        type: "appointment_reminder",
        channel: "email",
        language: appt.preferred_language,
        payload: { hours_before: window.hours_before },
        sent_at: new Date().toISOString(),
      });
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent });
}
