import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAppointmentToken } from "@/lib/appointment-token";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const accessToken = req.nextUrl.searchParams.get("accessToken") ?? "";
  if (!verifyAppointmentToken(accessToken, params.id)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, is_open")
    .eq("appointment_id", params.id)
    .maybeSingle();

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}
