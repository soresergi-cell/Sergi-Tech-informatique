import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

/** Correspondance ton → pastille d'icône + couleur de valeur. */
const TONES: Record<Tone, { chip: string; value: string; ring: string }> = {
  neutral: { chip: "bg-brand-blue/10 text-brand-blue", value: "text-brand-navy", ring: "ring-brand-blue/15" },
  accent: { chip: "bg-brand-cyan/10 text-sky-600", value: "text-brand-navy", ring: "ring-brand-cyan/15" },
  success: { chip: "bg-emerald-50 text-emerald-600", value: "text-brand-navy", ring: "ring-emerald-200" },
  warning: { chip: "bg-amber-50 text-amber-600", value: "text-amber-700", ring: "ring-amber-200" },
  danger: { chip: "bg-rose-50 text-rose-600", value: "text-rose-700", ring: "ring-rose-200" },
};

/**
 * Cartelle d'indicateur du tableau de bord (design system administration).
 * Rendue cliquable via `href` pour filtrer le tableau depuis l'indicateur.
 */
export function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
  href,
  delay = 0,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  href?: string;
  delay?: number;
  className?: string;
}) {
  const styles = TONES[tone];

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">{label}</p>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
            styles.chip,
            styles.ring
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className={cn("mt-3 text-2xl font-bold tabular-nums tracking-tight", styles.value)}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </>
  );

  const classes = cn(
    "surface-card block p-4 transition duration-200 animate-fade-up",
    href && "hover:-translate-y-0.5 hover:border-brand-blue/30 hover:shadow-lift",
    className
  );

  const style = { animationDelay: `${delay}ms` };

  if (href) {
    return (
      <Link href={href} style={style} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <div style={style} className={classes}>
      {content}
    </div>
  );
}
