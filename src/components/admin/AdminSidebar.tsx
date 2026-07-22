"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";

const NAV_EN = [
  { href: "dashboard", label: "Dashboard" },
  { href: "calendar", label: "Calendar" },
  { href: "appointments", label: "Appointments" },
  { href: "availability", label: "Availability" },
  { href: "messages", label: "Messages" },
  { href: "clients", label: "Clients" },
  { href: "services", label: "Services" },
  { href: "gallery", label: "Gallery" },
  { href: "content", label: "Website Content" },
  { href: "settings", label: "Settings" },
];

const NAV_FR = [
  { href: "dashboard", label: "Tableau de bord" },
  { href: "calendar", label: "Calendrier" },
  { href: "appointments", label: "Rendez-vous" },
  { href: "availability", label: "Disponibilités" },
  { href: "messages", label: "Messages" },
  { href: "clients", label: "Clientes" },
  { href: "services", label: "Services" },
  { href: "gallery", label: "Galerie" },
  { href: "content", label: "Contenu du site" },
  { href: "settings", label: "Paramètres" },
];

export default function AdminSidebar({ locale, adminName }: { locale: Locale; adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = locale === "fr" ? NAV_FR : NAV_EN;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-lavender-soft bg-white md:flex">
      <div className="px-6 py-6">
        <span className="font-display text-xl font-semibold text-royal">Sweet Mee Nails</span>
        <p className="mt-1 truncate text-xs text-ink/50">{adminName}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const href = `/${locale}/admin/${item.href}`;
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={item.href}
              href={href}
              className={clsx(
                "block rounded-lg px-3 py-2 text-sm font-medium transition",
                active ? "bg-royal text-white" : "text-ink/70 hover:bg-lavender-soft"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink/60 hover:bg-lavender-soft"
        >
          {locale === "fr" ? "Déconnexion" : "Log Out"}
        </button>
      </div>
    </aside>
  );
}
