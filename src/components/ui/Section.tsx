import { clsx } from "clsx";

export function Section({
  children,
  className,
  tinted = false,
}: {
  children: React.ReactNode;
  className?: string;
  tinted?: boolean;
}) {
  return (
    <section className={clsx("py-16 md:py-24", tinted && "bg-lavender-soft/60", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={clsx("mb-10 max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-DEFAULT">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold text-royal md:text-4xl">
        {title}
      </h2>
      <div className="brush-divider mx-auto mt-4 w-24" />
      {subtitle && <p className="mt-4 text-ink/70">{subtitle}</p>}
    </div>
  );
}
