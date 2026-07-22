import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import AvailabilityManager from "@/components/admin/AvailabilityManager";

export default function AdminAvailabilityPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-royal">
        {locale === "en" ? "Availability" : "Disponibilités"}
      </h1>
      <AvailabilityManager locale={locale} />
    </div>
  );
}
