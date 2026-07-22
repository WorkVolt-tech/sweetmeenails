import { clsx } from "clsx";
import Link from "next/link";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-xl2 bg-white p-6 shadow-card ring-1 ring-lavender-soft transition hover:shadow-soft",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const styles = {
    primary:
      "bg-royal text-white hover:bg-royal-dark shadow-soft",
    secondary:
      "bg-blossom text-royal-dark hover:bg-blossom-dark",
    ghost:
      "bg-transparent text-royal border border-royal/30 hover:bg-lavender-soft",
  };

  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition",
        styles[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
