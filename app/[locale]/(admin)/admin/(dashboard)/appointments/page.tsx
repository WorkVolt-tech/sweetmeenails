import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import AppointmentsTable from "@/components/admin/AppointmentsTable";

export default function AdminAppointmentsPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-royal">
        {locale === "en" ? "Appointments" : "Rendez-vous"}
      </h1>
      <AppointmentsTable locale={locale} />
    </div>
  );
}
