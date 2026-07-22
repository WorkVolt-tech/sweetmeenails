import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import GalleryManager from "@/components/admin/GalleryManager";

export default function AdminGalleryPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-royal">
        {locale === "en" ? "Gallery" : "Galerie"}
      </h1>
      <GalleryManager locale={locale} />
    </div>
  );
}
