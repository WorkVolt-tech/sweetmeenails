"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";

export default function AdminLoginPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(locale === "en" ? "Invalid email or password." : "Courriel ou mot de passe invalide.");
      return;
    }
    router.push(`/${locale}/admin/dashboard`);
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl2 bg-white p-8 shadow-soft ring-1 ring-lavender-soft">
        <div className="mb-6 text-center">
          <span className="font-display text-2xl font-semibold text-royal">Sweet Mee Nails</span>
          <p className="mt-1 text-sm text-ink/50">
            {locale === "en" ? "Administrator sign in" : "Connexion administrateur"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-royal">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-lavender bg-white px-4 py-2.5 text-sm focus:border-royal focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-royal">
              {locale === "en" ? "Password" : "Mot de passe"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-lavender bg-white px-4 py-2.5 text-sm focus:border-royal focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-full bg-royal px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-royal-dark disabled:opacity-60"
          >
            {locale === "en" ? "Sign in" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
