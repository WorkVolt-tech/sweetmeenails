import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAppointmentToken } from "@/lib/appointment-token";

const schema = z.object({
  accessToken: z.string(),
  reason: z.string().max(1000).optional(),
});

// Admin-configurable cutoff (hours before appointment start) under which
// online cancellation is blocked. Wire this to `website_settings` once
// the admin Settings page can edit it; a sane default lives here.
const DEFAULT_CANCELLATION_CUTOFF_HOURS = 24;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { accessToken, reason } = parsed.data;

  if (!verifyAppointmentToken(accessToken, params.id)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, appointment_date, start_time, status")
    .eq("id", params.id)
    .maybeSingle();

  if (!appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (["cancelled_by_client", "cancelled_by_salon", "completed", "no_show"].includes(appointment.status)) {
    return NextResponse.json({ error: "Appointment already closed" }, { status: 409 });
  }

  const appointmentStart = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
  const hoursUntil = (appointmentStart.getTime() - Date.now()) / 3_600_000;
  if (hoursUntil < DEFAULT_CANCELLATION_CUTOFF_HOURS) {
    return NextResponse.json(
      { error: "CUTOFF_PASSED", message: "Online cancellation is no longer available for this appointment. Please contact the salon directly." },
      { status: 409 }
    );
  }

  await supabase
    .from("appointments")
    .update({
      status: "cancelled_by_client",
      cancellation_reason: reason ?? null,
      cancelled_at: new Date().toISOString(),
      cancelled_by: "client",
    })
    .eq("id", params.id);

  await supabase.from("notifications").insert({
    appointment_id: params.id,
    type: "appointment_cancelled",
    channel: "dashboard",
    language: "en",
    payload: { cancelled_by: "client" },
  });

  return NextResponse.json({ ok: true });
}
