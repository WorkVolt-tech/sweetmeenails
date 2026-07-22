import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/format";
import { generateOtp, hashOtp } from "@/lib/otp";
import { sendEmail, verificationCodeEmail } from "@/lib/email/send";

const schema = z.object({
  referenceNumber: z.string().min(4).max(20),
  phone: z.string().min(7).max(20),
});

// SECURITY: this endpoint must always return the same generic response
// whether or not a matching appointment exists, so reference numbers
// can't be brute-forced or their existence confirmed by phone-guessing.
const GENERIC_RESPONSE = {
  message: "If those details match an appointment, we've sent a verification code.",
};

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { referenceNumber, phone } = parsed.data;
  const normalizedPhone = normalizePhone(phone);
  const supabase = createAdminClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, preferred_language, clients!inner(email, phone_normalized)")
    .eq("reference_number", referenceNumber.trim().toUpperCase())
    .eq("clients.phone_normalized", normalizedPhone)
    .maybeSingle();

  if (appointment) {
    const client = (appointment as any).clients;
    if (client?.email) {
      const code = generateOtp();
      await supabase.from("appointment_verifications").insert({
        appointment_id: appointment.id,
        code_hash: hashOtp(code),
        channel: "email",
        expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
      });
      await sendEmail({
        to: client.email,
        locale: appointment.preferred_language,
        ...verificationCodeEmail(code),
      });
    }
    // If there's no email on file, SMS isn't wired up yet in this build —
    // the client-facing copy should direct them to call the salon in
    // that case. We still return the generic response to avoid leaking
    // whether the appointment exists.
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
