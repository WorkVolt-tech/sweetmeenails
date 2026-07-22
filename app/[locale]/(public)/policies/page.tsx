import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getSalonPolicies } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";

export default async function PoliciesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const policies = await getSalonPolicies();

  return (
    <Section>
      <SectionHeading title={locale === "en" ? "Salon Policies" : "Politiques du salon"} />
      <div className="mx-auto max-w-3xl space-y-4">
        {policies.map((p: any) => (
          <Card key={p.id}>
            <h3 className="font-display text-lg font-semibold text-royal">
              {locale === "en" ? p.title_en : p.title_fr}
            </h3>
            <p className="mt-1 text-sm text-ink/70">
              {locale === "en" ? p.body_en : p.body_fr}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
