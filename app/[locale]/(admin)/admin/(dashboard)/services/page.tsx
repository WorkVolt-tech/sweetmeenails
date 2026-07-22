import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import ServicesManager from "@/components/admin/ServicesManager";

export default function AdminServicesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-royal">
        {locale === "en" ? "Services" : "Services"}
      </h1>
      <ServicesManager locale={locale} />
    </div>
  );
}
