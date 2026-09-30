import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

/**
 * Logo SERGI-TECH – monogramme « S » circuité + nom.
 * Variante "light" pour fonds sombres (header/footer).
 */
export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} – Accueil`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan shadow-md transition-transform group-hover:scale-105">
        {/* Monogramme stylisé */}
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" aria-hidden>
          <path
            fill="currentColor"
            d="M16.5 5.5A5.5 5.5 0 0 0 7 8h3.2a2.3 2.3 0 0 1 4.5.7c0 1.5-1.4 2.3-3.2 2.3H10a4.4 4.4 0 0 0 0 8.8h6.5a2.6 2.6 0 0 0 2.6-2.6v-.9h-3.3v1a.7.7 0 0 1-.7.7H10a1.9 1.9 0 0 1 0-3.8h4.6c2.7 0 4.9-1.8 4.9-4.6 0-3.4-2.6-5.1-5-5.1Z"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-lg font-extrabold tracking-tight",
            light ? "text-white" : "text-brand-navy"
          )}
        >
          SERGI<span className="text-brand-cyan">-TECH</span>
        </span>
        <span
          className={cn(
            "hidden text-[10px] font-medium tracking-wide sm:block",
            light ? "text-slate-400" : "text-muted-foreground"
          )}
        >
          Informatique &bull; Burkina Faso
        </span>
      </span>
    </Link>
  );
}
