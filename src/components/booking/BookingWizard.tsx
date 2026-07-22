"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n/config";
import { formatPrice } from "@/lib/format";
import { Card } from "@/components/ui/Card";

type Service = {
  id: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  duration_minutes: number;
  price_cents: number;
  price_is_starting_at: boolean;
};

type Slot = {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  spots_remaining: number;
};

type Policy = {
  id: string;
  title_en: string;
  title_fr: string;
  body_en: string;
  body_fr: string;
};

const STEPS = ["service", "datetime", "details", "review"] as const;
type Step = (typeof STEPS)[number];

export default function BookingWizard({
  locale,
  dict,
  services,
  slots,
  policies,
  preselectedServiceId,
}: {
  locale: Locale;
  dict: any;
  services: Service[];
  slots: Slot[];
  policies: Policy[];
  preselectedServiceId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("service");
  const [serviceId, setServiceId] = useState<string | undefined>(preselectedServiceId);
  const [slotId, setSlotId] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<Locale>(locale);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ referenceNumber: string } | null>(null);

  const selectedService = services.find((s) => s.id === serviceId);
  const selectedSlot = slots.find((s) => s.id === slotId);

  const slotsByDate = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of slots) {
      const list = map.get(slot.slot_date) ?? [];
      list.push(slot);
      map.set(slot.slot_date, list);
    }
    return map;
  }, [slots]);

  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  function goNext() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }
  function goBack() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      let inspirationImageUrl: string | undefined;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/booking/upload-inspiration", {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
          const { path } = await uploadRes.json();
          inspirationImageUrl = path;
        }
      }

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId,
          serviceId,
          addonIds: [],
          name,
          phone,
          email: email || undefined,
          preferredLanguage,
          notes: notes || undefined,
          inspirationImageUrl,
          agreedToPolicies: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setConfirmation({ referenceNumber: data.referenceNumber });
    } catch {
      setError(locale === "en" ? "Something went wrong. Please try again." : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h3 className="font-display text-2xl font-semibold text-royal">
          {locale === "en" ? "Request received" : "Demande reçue"}
        </h3>
        <p className="mt-3 text-ink/70">{dict.booking.pendingNotice}</p>
        <p className="mt-6 text-sm text-ink/50">{dict.booking.referenceLabel}</p>
        <p className="mt-1 font-mono text-2xl font-semibold tracking-wider text-gold-DEFAULT">
          {confirmation.referenceNumber}
        </p>
        <button
          onClick={() => router.push(`/${locale}/manage-appointment`)}
          className="mt-6 rounded-full bg-royal px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-royal-dark"
        >
          {dict.nav.manage}
        </button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step indicator */}
      <ol className="mb-10 flex justify-between text-xs font-semibold text-ink/40 sm:text-sm">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={clsx(
              "flex-1 border-b-2 pb-3 text-center capitalize",
              step === s ? "border-royal text-royal" : "border-lavender-soft"
            )}
          >
            {i + 1}. {dict.booking[`step${s === "datetime" ? "DateTime" : s.charAt(0).toUpperCase() + s.slice(1)}`]}
          </li>
        ))}
      </ol>

      {step === "service" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setServiceId(service.id);
                goNext();
              }}
              className={clsx(
                "rounded-xl2 border p-5 text-left shadow-card transition hover:shadow-soft",
                serviceId === service.id ? "border-royal bg-lavender-soft/50" : "border-lavender-soft bg-white"
              )}
            >
              <h4 className="font-display text-lg font-semibold text-royal">
                {locale === "en" ? service.name_en : service.name_fr}
              </h4>
              <p className="mt-1 text-sm text-ink/60">
                {service.duration_minutes} min · {formatPrice(service.price_cents)}
              </p>
            </button>
          ))}
        </div>
      )}

      {step === "datetime" && (
        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            {[...slotsByDate.keys()].map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-medium",
                  selectedDate === date ? "bg-royal text-white" : "bg-lavender-soft text-royal"
                )}
              >
                {new Date(date + "T00:00:00").toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </button>
            ))}
          </div>
          {selectedDate && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {(slotsByDate.get(selectedDate) ?? []).map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => {
                    setSlotId(slot.id);
                    goNext();
                  }}
                  className={clsx(
                    "rounded-lg border py-3 text-sm font-medium",
                    slotId === slot.id ? "border-royal bg-royal text-white" : "border-lavender-soft bg-white text-royal hover:bg-lavender-soft/50"
                  )}
                >
                  {slot.start_time.slice(0, 5)}
                </button>
              ))}
            </div>
          )}
          <div className="mt-8">
            <button onClick={goBack} className="text-sm text-royal underline">
              {locale === "en" ? "Back" : "Retour"}
            </button>
          </div>
        </div>
      )}

      {step === "details" && (
        <div className="space-y-4">
          <Field label={dict.booking.name}>
            <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          </Field>
          <Field label={dict.booking.phone}>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required type="tel" className={inputClass} />
          </Field>
          <Field label={dict.booking.email}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inputClass} />
          </Field>
          <Field label={dict.booking.preferredLanguage}>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as Locale)}
              className={inputClass}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </Field>
          <Field label={dict.booking.notes}>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass} />
          </Field>
          <Field label={dict.booking.inspirationPhoto}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </Field>
          <div className="flex gap-3 pt-2">
            <button onClick={goBack} className="rounded-full border border-royal/30 px-6 py-3 text-sm font-semibold text-royal">
              {locale === "en" ? "Back" : "Retour"}
            </button>
            <button
              onClick={goNext}
              disabled={!name || !phone}
              className="rounded-full bg-royal px-6 py-3 text-sm font-semibold text-white shadow-soft disabled:opacity-50"
            >
              {locale === "en" ? "Continue" : "Continuer"}
            </button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-6">
          <Card>
            <h4 className="font-display text-lg font-semibold text-royal">
              {locale === "en" ? "Your appointment" : "Votre rendez-vous"}
            </h4>
            <dl className="mt-3 space-y-1 text-sm text-ink/70">
              <div>{selectedService && (locale === "en" ? selectedService.name_en : selectedService.name_fr)}</div>
              <div>
                {selectedSlot &&
                  `${new Date(selectedSlot.slot_date + "T00:00:00").toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })} · ${selectedSlot.start_time.slice(0, 5)}`}
              </div>
              <div>{name} · {phone}</div>
            </dl>
          </Card>

          <div className="max-h-48 space-y-3 overflow-y-auto rounded-xl2 border border-lavender-soft bg-white p-4 text-sm text-ink/70">
            {policies.map((p) => (
              <div key={p.id}>
                <p className="font-semibold text-royal">{locale === "en" ? p.title_en : p.title_fr}</p>
                <p>{locale === "en" ? p.body_en : p.body_fr}</p>
              </div>
            ))}
          </div>

          <label className="flex items-start gap-3 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-lavender text-royal"
            />
            {dict.booking.agreePolicies}
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button onClick={goBack} className="rounded-full border border-royal/30 px-6 py-3 text-sm font-semibold text-royal">
              {locale === "en" ? "Back" : "Retour"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!agreed || submitting}
              className="flex-1 rounded-full bg-royal px-6 py-3 text-sm font-semibold text-white shadow-soft disabled:opacity-50"
            >
              {submitting ? "…" : dict.booking.submit}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-lavender bg-white px-4 py-2.5 text-sm focus:border-royal focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-royal">{label}</label>
      {children}
    </div>
  );
}
