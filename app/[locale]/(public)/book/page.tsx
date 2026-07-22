import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getActiveServices, getAvailableSlots, getSalonPolicies } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import BookingWizard from "@/components/booking/BookingWizard";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { service?: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);
  const [services, slots, policies] = await Promise.all([
    getActiveServices(),
    getAvailableSlots(),
    getSalonPolicies(),
  ]);

  return (
    <Section>
      <SectionHeading eyebrow={dict.nav.book} title={dict.home.bookCta} />
      <BookingWizard
        locale={locale}
        dict={dict}
        services={services}
        slots={slots}
        policies={policies}
        preselectedServiceId={searchParams.service}
      />
    </Section>
  );
}
