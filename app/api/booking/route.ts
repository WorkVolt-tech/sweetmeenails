import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/format";
import { sendEmail, appointmentSubmittedEmail } from "@/lib/email/send";

const schema = z.object({
  slotId: z.string().uuid(),
  serviceId: z.string().uuid(),
  addonIds: z.array(z.string().uuid()).default([]),
  name: z.string().min(1).max(200),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal("")),
  preferredLanguage: z.enum(["en", "fr"]),
  notes: z.string().max(2000).optional(),
  inspirationImageUrl: z.string().url().optional(),
  agreedToPolicies: z.literal(true),
});

// Same lightweight per-IP throttle as /api/contact — prevents a script
// from hammering the booking endpoint / probing slot availability.
const hits = new Map<string, number[]>();
function isRateLimited(ip: string, max = 8, windowMs = 60_000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("create_appointment", {
    p_slot_id: body.slotId,
    p_service_id: body.serviceId,
    p_addon_ids: body.addonIds,
    p_client_name: body.name,
    p_client_phone: normalizePhone(body.phone),
    p_client_email: body.email || null,
    p_preferred_language: body.preferredLanguage,
    p_client_notes: body.notes ?? null,
    p_inspiration_image_url: body.inspirationImageUrl ?? null,
    p_agreed_to_policies: body.agreedToPolicies,
  });

  if (error) {
    const code = error.message.includes("SLOT_FULL") || error.message.includes("SLOT_UNAVAILABLE")
      ? 409
      : 400;
    return NextResponse.json({ error: error.message }, { status: code });
  }

  const appointment = data;

  if (body.email) {
    const template = appointmentSubmittedEmail(appointment.reference_number);
    await sendEmail({ to: body.email, locale: body.preferredLanguage, ...template });
  }

  // TODO: push a dashboard notification row + realtime event so the
  // admin gets an immediate alert, per "administrator must receive an
  // alert for every new request".
  await supabase.from("notifications").insert({
    appointment_id: appointment.id,
    type: "appointment_submitted",
    channel: "dashboard",
    language: body.preferredLanguage,
    payload: { reference_number: appointment.reference_number },
  });

  return NextResponse.json({
    referenceNumber: appointment.reference_number,
    status: appointment.status,
  });
}
