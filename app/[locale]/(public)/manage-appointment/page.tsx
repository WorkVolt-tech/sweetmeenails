import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { Section, SectionHeading } from "@/components/ui/Section";
import ManageAppointmentFlow from "@/components/booking/ManageAppointmentFlow";

export default async function ManageAppointmentPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <Section>
      <SectionHeading title={dict.manage.title} />
      <ManageAppointmentFlow locale={locale} dict={dict} />
    </Section>
  );
}
