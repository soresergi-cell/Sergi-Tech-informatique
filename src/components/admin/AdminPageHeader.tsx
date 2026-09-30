import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * En-tête de page de l'espace de gestion : titre + description + actions à droite.
 * Composant serveur (aucun JS côté client) — l'animation est purement CSS.
 */
export function AdminPageHeader({
  title,
  description,
  actions,
  icon: Icon,
  className,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 animate-fade-up sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-blue ring-1 ring-inset ring-brand-blue/10">
              <Icon className="h-[18px] w-[18px]" aria-hidden />
            </span>
          ) : null}
          <h1 className="truncate text-xl font-bold tracking-tight text-brand-navy sm:text-2xl">{title}</h1>
        </div>
        {description ? <div className="mt-1.5 text-sm text-slate-500">{description}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
