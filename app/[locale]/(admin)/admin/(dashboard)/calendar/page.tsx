import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import CalendarView from "@/components/admin/CalendarView";

export default function AdminCalendarPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-royal">
        {locale === "en" ? "Calendar" : "Calendrier"}
      </h1>
      <CalendarView locale={locale} />
    </div>
  );
}
