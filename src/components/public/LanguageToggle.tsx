"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

export default function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    const segments = pathname.split("/");
    segments[1] = next; // replace the locale segment
    router.push(segments.join("/") || `/${next}`);
  }

  return (
    <div
      role="group"
      aria-label="Language / Langue"
      className="flex items-center rounded-full border border-lavender bg-white p-1 text-xs font-semibold shadow-sm"
    >
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-pressed={locale === l}
          className={`rounded-full px-3 py-1.5 transition ${
            locale === l
              ? "bg-royal text-white"
              : "text-royal/70 hover:text-royal"
          }`}
        >
          {l === "en" ? "EN" : "FR"}
        </button>
      ))}
    </div>
  );
}
