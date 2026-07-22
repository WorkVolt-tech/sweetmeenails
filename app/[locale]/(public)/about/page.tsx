import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";

// Copy here is placeholder brand content — replace via the admin
// dashboard's Website Content editor (website_settings / a dedicated
// `about_page` key) once real bio/story text is available.
const copy = {
  en: {
    title: "About Sweet Mee Nails",
    story: "Sweet Mee Nails began as a one-chair studio built on a simple idea: nail care should feel unhurried, precise, and genuinely relaxing. Every appointment is paced to give hands and feet the attention they deserve.",
    training: "Training & Experience",
    trainingBody: "Certified in nail technology with ongoing education in gel, acrylic, and nail art application, plus infection-control best practices.",
    clean: "Cleanliness & Sanitation",
    cleanBody: "All tools are hospital-grade sterilized or single-use, workstations are sanitized between every client, and disposable liners are used for every pedicure.",
  },
  fr: {
    title: "À propos de Sweet Mee Nails",
    story: "Sweet Mee Nails est né d'une idée simple : le soin des ongles doit être précis, apaisant et sans précipitation. Chaque rendez-vous est rythmé pour offrir aux mains et aux pieds toute l'attention qu'ils méritent.",
    training: "Formation et expérience",
    trainingBody: "Certifiée en soins des ongles avec formation continue en gel, acrylique, nail art et bonnes pratiques de contrôle des infections.",
    clean: "Propreté et hygiène",
    cleanBody: "Tous les outils sont stérilisés selon les normes hospitalières ou à usage unique, les postes sont désinfectés entre chaque cliente, et des doublures jetables sont utilisées pour chaque pédicure.",
  },
};

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const t = copy[locale];

  return (
    <Section>
      <SectionHeading title={t.title} />
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <p className="text-ink/80">{t.story}</p>
        </Card>
        <Card>
          <h3 className="font-display text-xl font-semibold text-royal">{t.training}</h3>
          <p className="mt-2 text-ink/70">{t.trainingBody}</p>
        </Card>
        <Card>
          <h3 className="font-display text-xl font-semibold text-royal">{t.clean}</h3>
          <p className="mt-2 text-ink/70">{t.cleanBody}</p>
        </Card>
      </div>
    </Section>
  );
}
