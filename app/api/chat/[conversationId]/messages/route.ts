import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAppointmentToken } from "@/lib/appointment-token";

const schema = z.object({
  accessToken: z.string(),
  appointmentId: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

// Clients poll this GET endpoint (e.g. every few seconds while the chat
// panel is open) rather than subscribing to Supabase Realtime directly,
// since they aren't authenticated Supabase users and RLS can't scope
// realtime access to a one-off OTP token. Admins instead get live
// updates via Realtime on their authenticated dashboard session.
export async function GET(req: NextRequest, { params }: { params: { conversationId: string } }) {
  const accessToken = req.nextUrl.searchParams.get("accessToken") ?? "";
  const appointmentId = req.nextUrl.searchParams.get("appointmentId") ?? "";

  if (!verifyAppointmentToken(accessToken, appointmentId)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", params.conversationId)
    .eq("appointment_id", appointmentId)
    .maybeSingle();

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true })
    .limit(200);

  await supabase
    .from("messages")
    .update({ is_read_by_client: true })
    .eq("conversation_id", conversation.id)
    .eq("sender_type", "admin");

  return NextResponse.json({ messages: messages ?? [] });
}

// Clients are not Supabase Auth users, so they can't rely on RLS to
// reach `messages` directly — every client-sent message goes through
// this route, which re-checks the OTP-issued token against the
// appointment before writing. Admins instead read/write `messages`
// straight from the dashboard using their authenticated Supabase
// session, governed by the RLS policies in 0003_rls.sql.
export async function POST(req: NextRequest, { params }: { params: { conversationId: string } }) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { accessToken, appointmentId, body } = parsed.data;

  if (!verifyAppointmentToken(accessToken, appointmentId)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, appointment_id, is_open")
    .eq("id", params.conversationId)
    .eq("appointment_id", appointmentId)
    .maybeSingle();

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!conversation.is_open) {
    return NextResponse.json({ error: "This conversation is closed. Please contact the salon directly." }, { status: 409 });
  }

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversation.id,
      sender_type: "client",
      body,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversation.id);

  await supabase.from("notifications").insert({
    appointment_id: appointmentId,
    type: "new_chat_message",
    channel: "dashboard",
    language: "en",
    payload: { conversation_id: conversation.id },
  });

  return NextResponse.json({ message });
}
