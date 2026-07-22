import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getActiveServices } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card, ButtonLink } from "@/components/ui/Card";
import { formatPrice } from "@/lib/format";

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);
  const services = await getActiveServices();

  // Group by category, preserving category display order already applied server-side.
  const grouped = services.reduce((acc: Record<string, any[]>, s: any) => {
    const key = locale === "en" ? s.service_categories?.name_en ?? "Other" : s.service_categories?.name_fr ?? "Autre";
    acc[key] = acc[key] ?? [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <Section>
      <SectionHeading
        eyebrow={locale === "en" ? "Menu" : "Menu"}
        title={dict.nav.services}
        subtitle={
          locale === "en"
            ? "Every service can be booked directly, or paired with add-ons at checkout."
            : "Chaque service peut être réservé directement ou combiné à des options supplémentaires."
        }
      />
      <div className="space-y-14">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="mb-6 font-display text-2xl font-semibold text-royal">{category}</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((service) => (
                <Card key={service.id}>
                  <h4 className="font-display text-xl font-semibold text-royal">
                    {locale === "en" ? service.name_en : service.name_fr}
                  </h4>
                  <p className="mt-2 text-sm text-ink/70">
                    {locale === "en" ? service.description_en : service.description_fr}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-gold-DEFAULT">
                      {service.price_is_starting_at ? (locale === "en" ? "From " : "À partir de ") : ""}
                      {formatPrice(service.price_cents)}
                    </span>
                    <span className="text-ink/50">{service.duration_minutes} min</span>
                  </div>
                  <ButtonLink href={`/${locale}/book?service=${service.id}`} className="mt-4 w-full" variant="secondary">
                    {dict.nav.book}
                  </ButtonLink>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
