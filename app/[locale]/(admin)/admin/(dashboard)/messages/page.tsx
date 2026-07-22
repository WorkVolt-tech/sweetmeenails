import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import MessagesManager from "@/components/admin/MessagesManager";

export default function AdminMessagesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-royal">
        {locale === "en" ? "Messages" : "Messages"}
      </h1>
      <MessagesManager locale={locale} />
    </div>
  );
}
