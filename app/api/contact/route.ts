import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email/send";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(4000),
  locale: z.enum(["en", "fr"]).default("en"),
});

// Basic in-memory rate limit per IP for this single instance. Swap for a
// durable store (Upstash Redis, Supabase table) once deployed behind
// multiple serverless instances.
const hits = new Map<string, number[]>();
function isRateLimited(ip: string, max = 5, windowMs = 60_000) {
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
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { name, email, message, locale } = parsed.data;

  await sendEmail({
    to: process.env.EMAIL_FROM ?? "hello@sweetmeenails.com",
    locale,
    subject: { en: `New contact form message from ${name}`, fr: `Nouveau message de ${name}` },
    html: {
      en: `<p><strong>${name}</strong> (${email}) wrote:</p><p>${message}</p>`,
      fr: `<p><strong>${name}</strong> (${email}) a écrit :</p><p>${message}</p>`,
    },
  });

  return NextResponse.json({ ok: true });
}
