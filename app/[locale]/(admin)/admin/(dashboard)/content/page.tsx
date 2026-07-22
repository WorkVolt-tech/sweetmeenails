import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import ContentManager from "@/components/admin/ContentManager";

export default function AdminContentPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-royal">
        {locale === "en" ? "Website Content" : "Contenu du site"}
      </h1>
      <ContentManager locale={locale} />
    </div>
  );
}
