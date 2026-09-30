"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * En-tête de colonne triable (réutilisable dans tous les tableaux d'administration).
 * L'ordre courant est exposé aux lecteurs d'écran via `aria-sort` porté par le `<th>`.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }

  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      title={`Trier par ${title.toLowerCase()}`}
      className={cn(
        "-ml-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em]",
        "transition-colors hover:bg-slate-200/70 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        sorted ? "text-brand-navy" : "text-slate-500",
        className
      )}
    >
      <span>{title}</span>
      {sorted === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5" aria-hidden />
      ) : sorted === "desc" ? (
        <ArrowDown className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 opacity-40 transition-opacity group-hover/head:opacity-90" aria-hidden />
      )}
    </button>
  );
}
