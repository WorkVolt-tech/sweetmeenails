import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/format";
import { hashOtp } from "@/lib/otp";
import { issueAppointmentToken } from "@/lib/appointment-token";

const schema = z.object({
  referenceNumber: z.string().min(4).max(20),
  phone: z.string().min(7).max(20),
  code: z.string().length(6),
});

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { referenceNumber, phone, code } = parsed.data;
  const normalizedPhone = normalizePhone(phone);
  const supabase = createAdminClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select("*, clients!inner(*)")
    .eq("reference_number", referenceNumber.trim().toUpperCase())
    .eq("clients.phone_normalized", normalizedPhone)
    .maybeSingle();

  if (!appointment) {
    // Same generic failure as a wrong code, so existence still isn't leaked.
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  const { data: verification } = await supabase
    .from("appointment_verifications")
    .select("*")
    .eq("appointment_id", appointment.id)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!verification || verification.attempt_count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  if (verification.code_hash !== hashOtp(code)) {
    await supabase
      .from("appointment_verifications")
      .update({ attempt_count: verification.attempt_count + 1 })
      .eq("id", verification.id);
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  await supabase
    .from("appointment_verifications")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", verification.id);
  await supabase
    .from("appointments")
    .update({ verification_status: "verified" })
    .eq("id", appointment.id);

  // Short-lived signed token the client stores (e.g. in memory / a
  // cookie) and passes to cancel/reschedule/chat endpoints, so those
  // don't need to re-collect the phone number on every action within
  // the same session.
  const token = issueAppointmentToken(appointment.id);

  const { clients: client, ...appt } = appointment as any;

  return NextResponse.json({
    accessToken: token,
    appointment: {
      id: appt.id,
      referenceNumber: appt.reference_number,
      date: appt.appointment_date,
      startTime: appt.start_time,
      endTime: appt.end_time,
      status: appt.status,
      priceEstimateCents: appt.price_estimate_cents,
      clientVisibleNotes: appt.client_visible_notes,
      serviceId: appt.service_id,
    },
  });
}
