import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAppointmentToken } from "@/lib/appointment-token";

const schema = z.object({
  accessToken: z.string(),
  newSlotId: z.string().uuid(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { accessToken, newSlotId } = parsed.data;

  if (!verifyAppointmentToken(accessToken, params.id)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // The original appointment stays exactly as-is (per spec: "the
  // original appointment should remain active until the new time is
  // approved"). We record the request in admin_notes + status so the
  // dashboard can surface it, and store the proposed slot on the row so
  // the admin can accept it with one click.
  const { data: appointment, error } = await supabase
    .from("appointments")
    .update({
      status: "reschedule_requested",
      proposed_slot_id: newSlotId,
    })
    .eq("id", params.id)
    .select()
    .maybeSingle();

  if (error || !appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await supabase.from("notifications").insert({
    appointment_id: params.id,
    type: "reschedule_requested",
    channel: "dashboard",
    language: appointment.preferred_language,
    payload: { proposed_slot_id: newSlotId },
  });

  return NextResponse.json({ ok: true, status: "reschedule_requested" });
}
