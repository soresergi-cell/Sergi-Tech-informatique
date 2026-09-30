"use client";

import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Options de taille de page proposées par défaut. */
const DEFAULT_SIZES = [10, 20, 50, 100];

/** Plage de pages affichées dans la pagination (avec ellipses). */
function pageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages = new Set<number>([0, total - 1, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

/**
 * Pied de table réutilisable : plage de lignes, taille de page et navigation.
 * Fonctionne avec n'importe quelle instance TanStack Table.
 */
export function DataTablePagination<TData>({
  table,
  rowsLabel = "produits",
  pageSizeOptions = DEFAULT_SIZES,
  className,
}: {
  table: TanstackTable<TData>;
  rowsLabel?: string;
  pageSizeOptions?: number[];
  className?: string;
}) {
  const rows = table.getFilteredRowModel().rows;
  const total = rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();

  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = total === 0 ? 0 : Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        <p aria-live="polite">
          <span className="font-semibold tabular-nums text-brand-navy">
            {total === 0 ? "0" : `${from}–${to}`}
          </span>{" "}
          sur <span className="tabular-nums">{total}</span> {rowsLabel}
        </p>
        <label className="flex items-center gap-2">
          <span className="hidden sm:inline">Lignes</span>
          <select
            value={pageSize}
            disabled={total === 0}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            aria-label="Nombre de lignes par page"
            className="h-8 rounded-lg border border-input bg-white px-2 text-xs font-medium text-brand-navy shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={table.firstPage}
          disabled={!table.getCanPreviousPage()}
          aria-label="Première page"
        >
          <ChevronsLeft className="h-4 w-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={table.previousPage}
          disabled={!table.getCanPreviousPage()}
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>

        <div className="mx-1 hidden items-center gap-1 sm:flex">
          {pageWindow(pageIndex, pageCount).map((page, i) =>
            page === "…" ? (
              <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-400">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => table.setPageIndex(page)}
                aria-current={page === pageIndex ? "page" : undefined}
                className={cn(
                  "h-8 min-w-8 rounded-lg px-2 text-xs font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  page === pageIndex
                    ? "bg-brand-navy text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-brand-navy"
                )}
              >
                {page + 1}
              </button>
            )
          )}
        </div>

        <span className="px-1 text-xs tabular-nums text-slate-500 sm:hidden">
          {pageCount === 0 ? 0 : pageIndex + 1} / {pageCount}
        </span>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={table.nextPage}
          disabled={!table.getCanNextPage()}
          aria-label="Page suivante"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={table.lastPage}
          disabled={!table.getCanNextPage()}
          aria-label="Dernière page"
        >
          <ChevronsRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
