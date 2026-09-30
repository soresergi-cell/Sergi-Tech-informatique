import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./icons";

/**
 * En-tête de section homogène (sur-titre, titre, accroche, lien d'action).
 * Garde la même hiérarchie typographique sur toute la page d'accueil.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  tone = "light",
  className,
  id,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  tone?: "light" | "dark";
  className?: string;
  /** Identifiant à référencer par `aria-labelledby` de la section. */
  id?: string;
}) {
  const dark = tone === "dark";

  return (
    <Reveal className={cn("mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <span
            className={cn(
              "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]",
              dark ? "text-brand-cyan" : "text-primary"
            )}
          >
            <span className={cn("h-px w-6", dark ? "bg-brand-cyan/60" : "bg-primary/40")} aria-hidden />
            {eyebrow}
          </span>
        )}
        <h2
          id={id}
          className={cn(
            "mt-2 text-balance text-2xl font-extrabold tracking-tight sm:text-3xl",
            dark ? "text-white" : "text-brand-navy"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed sm:text-base",
              dark ? "text-slate-300" : "text-muted-foreground"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            "group hidden shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors sm:inline-flex",
            dark
              ? "border-white/20 text-white hover:border-brand-cyan hover:text-brand-cyan"
              : "border-slate-200 bg-white text-brand-navy hover:border-primary/50 hover:text-primary"
          )}
        >
          {action.label}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      )}
    </Reveal>
  );
}
