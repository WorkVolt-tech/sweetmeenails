"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import type { Locale } from "@/lib/i18n/config";

export default function ContactForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const copy =
    locale === "en"
      ? { name: "Name", email: "Email", message: "Message", send: "Send message", sent: "Thanks — we'll be in touch soon.", error: "Something went wrong. Please try again or call us directly." }
      : { name: "Nom", email: "Courriel", message: "Message", send: "Envoyer", sent: "Merci — nous vous répondrons bientôt.", error: "Une erreur est survenue. Réessayez ou appelez-nous directement." };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          locale,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-royal">{copy.name}</label>
          <input name="name" required className="w-full rounded-lg border border-lavender bg-white px-4 py-2.5 text-sm focus:border-royal focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-royal">{copy.email}</label>
          <input type="email" name="email" required className="w-full rounded-lg border border-lavender bg-white px-4 py-2.5 text-sm focus:border-royal focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-royal">{copy.message}</label>
          <textarea name="message" required rows={4} className="w-full rounded-lg border border-lavender bg-white px-4 py-2.5 text-sm focus:border-royal focus:outline-none" />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full bg-royal px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-royal-dark disabled:opacity-60"
        >
          {copy.send}
        </button>
        {status === "sent" && <p className="text-sm text-green-700">{copy.sent}</p>}
        {status === "error" && <p className="text-sm text-red-600">{copy.error}</p>}
      </form>
    </Card>
  );
}
