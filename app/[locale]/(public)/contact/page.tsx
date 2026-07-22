import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getWebsiteSettings } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import ContactForm from "@/components/public/ContactForm";

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);
  const settings = await getWebsiteSettings();

  return (
    <Section>
      <SectionHeading eyebrow={dict.nav.contact} title={dict.nav.contact} />
      <div className="grid gap-10 md:grid-cols-2">
        <Card>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-royal">{locale === "en" ? "Phone" : "Téléphone"}</dt>
              <dd className="text-ink/70">{settings.phone?.[locale]}</dd>
            </div>
            <div>
              <dt className="font-semibold text-royal">Email</dt>
              <dd className="text-ink/70">{settings.email?.[locale]}</dd>
            </div>
            <div>
              <dt className="font-semibold text-royal">{locale === "en" ? "Address" : "Adresse"}</dt>
              <dd className="text-ink/70">{settings.address?.[locale]}</dd>
            </div>
            <div>
              <dt className="font-semibold text-royal">{dict.home.hours}</dt>
              <dd className="whitespace-pre-line text-ink/70">{settings.hours?.[locale]}</dd>
            </div>
          </dl>
          {/* Swap for a real embedded map (Google Maps / Mapbox) once the
              salon address + API key are configured. */}
          <div className="mt-6 aspect-video w-full rounded-xl2 bg-lavender-soft" />
        </Card>
        <ContactForm locale={locale} />
      </div>
    </Section>
  );
}
