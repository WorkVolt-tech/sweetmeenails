import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getActiveServices, getGalleryImages, getTestimonials, getWebsiteSettings } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card, ButtonLink } from "@/components/ui/Card";
import { formatPrice } from "@/lib/format";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);
  const [services, gallery, testimonials, settings] = await Promise.all([
    getActiveServices(),
    getGalleryImages(6),
    getTestimonials(),
    getWebsiteSettings(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-lavender-soft to-canvas">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-DEFAULT">
              Montréal
            </p>
            <h1 className="font-display text-5xl font-semibold leading-tight text-royal md:text-6xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink/70">
              {settings.home_intro?.[locale] ?? dict.home.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={`/${locale}/book`}>{dict.home.bookCta}</ButtonLink>
              <ButtonLink href={`/${locale}/services`} variant="ghost">
                {dict.nav.services}
              </ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm rounded-xl2 bg-gradient-to-br from-blossom to-lavender shadow-soft">
            {/* Replace with a real hero photograph of the salon / nail work */}
            <div className="flex h-full items-center justify-center font-display text-2xl text-white/90">
              Sweet Mee Nails
            </div>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <Section>
        <SectionHeading eyebrow={dict.nav.services} title={dict.home.featuredServices} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service: any) => (
            <Card key={service.id}>
              <h3 className="font-display text-xl font-semibold text-royal">
                {locale === "en" ? service.name_en : service.name_fr}
              </h3>
              <p className="mt-2 text-sm text-ink/70">
                {locale === "en" ? service.description_en : service.description_fr}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gold-DEFAULT">
                  {service.price_is_starting_at ? `${locale === "en" ? "From" : "À partir de"} ` : ""}
                  {formatPrice(service.price_cents)}
                </span>
                <span className="text-xs text-ink/50">{service.duration_minutes} min</span>
              </div>
              <ButtonLink href={`/${locale}/book?service=${service.id}`} className="mt-4 w-full" variant="secondary">
                {dict.nav.book}
              </ButtonLink>
            </Card>
          ))}
        </div>
      </Section>

      {/* Gallery preview */}
      <Section tinted>
        <SectionHeading eyebrow={dict.nav.gallery} title={dict.home.recentWork} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {gallery.map((img: any) => (
            <div key={img.id} className="aspect-square overflow-hidden rounded-xl2 bg-lavender-soft shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt={locale === "en" ? img.style_name_en ?? "" : img.style_name_fr ?? ""}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href={`/${locale}/gallery`} variant="ghost">
            {dict.nav.gallery}
          </ButtonLink>
        </div>
      </Section>

      {/* Hours + testimonials */}
      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeading center={false} title={dict.home.hours} />
            <p className="whitespace-pre-line text-ink/70">
              {settings.hours?.[locale]}
            </p>
          </div>
          <div>
            <SectionHeading center={false} title={dict.home.testimonials} />
            <div className="space-y-4">
              {testimonials.slice(0, 3).map((t: any) => (
                <Card key={t.id}>
                  <p className="italic text-ink/80">
                    “{locale === "en" ? t.quote_en : t.quote_fr}”
                  </p>
                  <p className="mt-2 text-sm font-semibold text-royal">— {t.client_name}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
