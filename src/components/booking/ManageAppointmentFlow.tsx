"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/format";
import ChatPanel from "@/components/chat/ChatPanel";

type Stage = "lookup" | "verify" | "details";

export default function ManageAppointmentFlow({ locale, dict }: { locale: Locale; dict: any }) {
  const [stage, setStage] = useState<Stage>("lookup");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/appointments/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNumber, phone }),
      });
      const data = await res.json();
      setMessage(data.message);
      setStage("verify");
    } catch {
      setError(locale === "en" ? "Something went wrong." : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/appointments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNumber, phone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(locale === "en" ? "Invalid or expired code." : "Code invalide ou expiré.");
        return;
      }
      setAccessToken(data.accessToken);
      setAppointment(data.appointment);
      setStage("details");
    } catch {
      setError(locale === "en" ? "Something went wrong." : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!appointment || !accessToken) return;
    setCancelling(true);
    setError(null);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? data.error ?? (locale === "en" ? "Unable to cancel." : "Annulation impossible."));
        return;
      }
      setAppointment({ ...appointment, status: "cancelled_by_client" });
    } finally {
      setCancelling(false);
    }
  }

  if (stage === "lookup") {
    return (
      <Card className="mx-auto max-w-md">
        <p className="mb-4 text-sm text-ink/70">{dict.manage.lookupPrompt}</p>
        <form onSubmit={handleLookup} className="space-y-4">
          <Field label={dict.manage.referenceNumber}>
            <input
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
              placeholder="SMN-XXXXXX"
              required
              className={inputClass}
            />
          </Field>
          <Field label={dict.manage.phone}>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required className={inputClass} />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className={submitClass}>
            {dict.manage.lookupSubmit}
          </button>
        </form>
      </Card>
    );
  }

  if (stage === "verify") {
    return (
      <Card className="mx-auto max-w-md">
        {message && <p className="mb-4 text-sm text-ink/70">{message}</p>}
        <form onSubmit={handleVerify} className="space-y-4">
          <Field label={dict.manage.verifyCode}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              maxLength={6}
              required
              className={inputClass}
            />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className={submitClass}>
            {dict.manage.verifySubmit}
          </button>
        </form>
      </Card>
    );
  }

  // stage === "details"
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-royal">
            {appointment.referenceNumber}
          </h3>
          <span className="rounded-full bg-lavender-soft px-3 py-1 text-xs font-semibold text-royal">
            {dict.status[appointment.status] ?? appointment.status}
          </span>
        </div>
        <dl className="mt-4 space-y-1 text-sm text-ink/70">
          <div>
            {new Date(appointment.date + "T00:00:00").toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            · {appointment.startTime?.slice(0, 5)}
          </div>
          {appointment.priceEstimateCents != null && <div>{formatPrice(appointment.priceEstimateCents)}</div>}
          {appointment.clientVisibleNotes && (
            <div className="mt-2 rounded-lg bg-lavender-soft/60 p-3">{appointment.clientVisibleNotes}</div>
          )}
        </dl>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          {!["cancelled_by_client", "cancelled_by_salon", "completed", "no_show"].includes(appointment.status) && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {dict.manage.cancelButton}
            </button>
          )}
          <button
            onClick={() => setShowChat((v) => !v)}
            className="rounded-full bg-royal px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-royal-dark"
          >
            {dict.manage.chatButton}
          </button>
        </div>
      </Card>

      {showChat && accessToken && (
        <ChatPanel locale={locale} appointmentId={appointment.id} accessToken={accessToken} />
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-lavender bg-white px-4 py-2.5 text-sm focus:border-royal focus:outline-none";
const submitClass =
  "w-full rounded-full bg-royal px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-royal-dark disabled:opacity-60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-royal">{label}</label>
      {children}
    </div>
  );
}
