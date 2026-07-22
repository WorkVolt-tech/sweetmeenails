import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export default function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: any;
}) {
  return (
    <footer className="mt-24 border-t border-lavender-soft bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <span className="font-display text-xl font-semibold text-royal">
            Sweet Mee Nails
          </span>
          <p className="mt-2 max-w-xs text-sm text-ink/70">
            {dict.home.heroSubtitle}
          </p>
        </div>

        <div className="text-sm text-ink/80">
          <p className="mb-2 font-semibold text-royal">{dict.nav.contact}</p>
          <p>(514) 555-0100</p>
          <p>hello@sweetmeenails.com</p>
          <p>123 Rue Principale, Montréal, QC</p>
        </div>

        <div className="text-sm text-ink/80">
          <p className="mb-2 font-semibold text-royal">{dict.home.hours}</p>
          <p>Tue–Sat: 10am–6pm</p>
          <p>Sun–Mon: Closed</p>
          <div className="mt-3 flex gap-3">
            <a href="https://instagram.com/sweetmeenails" className="text-royal/70 hover:text-royal">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-lavender-soft py-4 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} Sweet Mee Nails ·{" "}
        <Link href={`/${locale}/policies`} className="underline">
          {locale === "en" ? "Policies" : "Politiques"}
        </Link>
      </div>
    </footer>
  );
}
