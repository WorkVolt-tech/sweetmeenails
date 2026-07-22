import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import ClientsManager from "@/components/admin/ClientsManager";

export default function AdminClientsPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-royal">
        {locale === "en" ? "Clients" : "Clientes"}
      </h1>
      <ClientsManager locale={locale} />
    </div>
  );
}
