import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import type { Locale } from "@/lib/i18n/config";

export default function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: any;
}) {
  const nav = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/gallery`, label: dict.nav.gallery },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/manage-appointment`, label: dict.nav.manage },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas/90 backdrop-blur border-b border-lavender-soft">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          {/* Replace with the real Sweet Mee Nails logo asset at /public/images/logo.svg */}
          <span className="font-display text-2xl font-semibold text-royal">
            Sweet Mee <span className="text-blossom-dark">Nails</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-royal/80 transition hover:text-royal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle locale={locale} />
          <Link
            href={`/${locale}/book`}
            className="hidden rounded-full bg-royal px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-royal-dark sm:inline-block"
          >
            {dict.nav.book}
          </Link>
        </div>
      </div>
      {/* Mobile nav */}
      <nav className="flex items-center gap-4 overflow-x-auto px-4 pb-3 lg:hidden">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-sm font-medium text-royal/80"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
