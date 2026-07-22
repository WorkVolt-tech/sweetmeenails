import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getGalleryImages } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";

export default async function GalleryPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);
  const gallery = await getGalleryImages(60);

  return (
    <Section>
      <SectionHeading eyebrow={dict.nav.gallery} title={dict.home.recentWork} />
      <div className="columns-2 gap-4 sm:columns-3 md:columns-4 [&>*]:mb-4">
        {gallery.map((img: any) => (
          <figure key={img.id} className="break-inside-avoid overflow-hidden rounded-xl2 bg-lavender-soft shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.image_url}
              alt={locale === "en" ? img.style_name_en ?? "" : img.style_name_fr ?? ""}
              className="w-full object-cover"
            />
            {(img.style_name_en || img.category) && (
              <figcaption className="p-3 text-sm">
                <p className="font-semibold text-royal">
                  {locale === "en" ? img.style_name_en : img.style_name_fr}
                </p>
                {img.category && <p className="text-xs text-ink/50">{img.category}</p>}
                {img.instagram_url && (
                  <a href={img.instagram_url} className="text-xs text-blossom-dark underline">
                    Instagram
                  </a>
                )}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </Section>
  );
}
