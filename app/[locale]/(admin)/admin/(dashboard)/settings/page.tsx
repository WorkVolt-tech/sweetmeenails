import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import SettingsManager from "@/components/admin/SettingsManager";

export default function AdminSettingsPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-royal">
        {locale === "en" ? "Settings" : "Paramètres"}
      </h1>
      <SettingsManager locale={locale} />
    </div>
  );
}
