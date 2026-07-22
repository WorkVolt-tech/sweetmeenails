import { redirect } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  const { data: administrator } = await supabase
    .from("administrators")
    .select("full_name, role")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen bg-lavender-soft/30">
      <AdminSidebar locale={locale} adminName={administrator?.full_name ?? user!.email ?? ""} />
      <div className="flex-1 px-4 py-6 md:px-8 md:py-10">{children}</div>
    </div>
  );
}
