import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "../globals.css";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Sweet Mee Nails",
  description: "Precise, elegant nail care in a calm, welcoming studio.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;

  return (
    <html lang={locale}>
      <body className={`${display.variable} ${body.variable} font-body bg-canvas text-ink`}>
        {children}
      </body>
    </html>
  );
}
