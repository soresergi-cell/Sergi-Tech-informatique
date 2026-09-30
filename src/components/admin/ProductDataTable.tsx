"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { PackageSearch, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { globalProductSearch, productColumns, productTags, type ProductTag } from "./product-columns";
import { ProductRowCard, ProductRowSortSelect } from "./ProductRowCard";
import type { Product } from "@/types/product";

/** Puces de filtrage cumulatif (stock et promotions). */
const FILTERS: { tag: ProductTag; label: string }[] = [
  { tag: "stock", label: "En stock" },
  { tag: "faible", label: "Stock faible" },
  { tag: "rupture", label: "Rupture" },
  { tag: "promo", label: "En promo" },
];

/**
 * Tableau des produits de l'espace de gestion (TanStack Table) :
 * - recherche instantanée (nom, marque, référence, catégorie) synchronisée dans l'URL,
 * - tri sur chaque colonne utile, en-tête collant, défilement vertical indépendant,
 * - puces de filtre cumulables + pagination avec taille de page,
 * - vue cartes sur mobile, alimentée par la même instance de tableau.
 */
export function ProductDataTable({
  products,
  initialQuery = "",
  initialFilters = [],
}: {
  products: Product[];
  initialQuery?: string;
  /** Puces activées au chargement (ex. `["rupture"]` depuis un indicateur cliquable). */
  initialFilters?: ProductTag[];
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState(initialQuery);
  const deferredQuery = React.useDeferredValue(query);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialFilters.length ? [{ id: "tags", value: initialFilters }] : []
  );
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const columns = React.useMemo(() => productColumns(), []);

  /** Compteurs affichés sur les puces de filtre. */
  const counts = React.useMemo(() => {
    const base: Record<ProductTag, number> = { stock: 0, faible: 0, rupture: 0, promo: 0 };
    products.forEach((product) => productTags(product).forEach((tag) => (base[tag] += 1)));
    return base;
  }, [products]);

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, columnFilters, pagination, globalFilter: deferredQuery },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onGlobalFilterChange: (updater) =>
      setQuery((previous) => {
        const next = typeof updater === "function" ? updater(previous) : updater;
        return typeof next === "string" ? next : "";
      }),
    globalFilterFn: globalProductSearch,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { columnVisibility: { tags: false } },
  });

  const selectedTags = (columnFilters.find((filter) => filter.id === "tags")?.value as ProductTag[]) ?? [];
  const tagsKey = selectedTags.join(",");

  /* Recherche et filtres restent partageables : l'URL suit l'état du tableau. */
  React.useEffect(() => {
    const q = deferredQuery.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (tagsKey) params.set("filtre", tagsKey);

    const current = new URLSearchParams(window.location.search);
    if ((current.get("q") ?? "") === q && (current.get("filtre") ?? "") === tagsKey) return;

    const search = params.toString();
    router.replace(search ? `/admin?${search}` : "/admin", { scroll: false });
  }, [deferredQuery, tagsKey, router]);

  const hasFilters = query.trim().length > 0 || selectedTags.length > 0;

  const toggleTag = (tag: ProductTag) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((item) => item !== tag)
      : [...selectedTags, tag];
    setColumnFilters(next.length ? [{ id: "tags", value: next }] : []);
    table.setPageIndex(0);
  };

  const resetFilters = () => {
    setQuery("");
    setColumnFilters([]);
    table.setPageIndex(0);
  };

  const rows = table.getRowModel().rows;

  return (
    <section className="surface-card animate-fade-up overflow-hidden" style={{ animationDelay: "120ms" }}>
      {/* ------------------------- Barre d'outils ------------------------- */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                table.setPageIndex(0);
              }}
              placeholder="Rechercher : nom, marque, référence…"
              aria-label="Rechercher un produit"
              className="h-10 pl-9 pr-9"
            />
            {query ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setQuery("")}
                aria-label="Effacer la recherche"
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tri sur mobile : les en-têtes du tableau y sont masqués */}
            <ProductRowSortSelect table={table} className="md:hidden" />
            {hasFilters ? (
              <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="h-9 text-slate-500">
                <RotateCcw className="h-4 w-4" aria-hidden />
                Réinitialiser
              </Button>
            ) : null}
          </div>
        </div>

        {/* Puces de filtre cumulables + compteurs */}
        <div className="scrollbar-slim -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {FILTERS.map(({ tag, label }) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={active}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-brand-navy bg-brand-navy text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {counts[tag]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --------------------- Tableau (en-tête collant) -------------------- */}
      <div className="hidden md:block">
        <Table
          scrollLabel="Liste des produits du catalogue"
          containerClassName="max-h-[min(64vh,760px)]"
        >
          <TableCaption className="sr-only">
            Produits du catalogue, avec tri par colonne, recherche et pagination.
          </TableCaption>

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-slate-50 hover:bg-slate-50">
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        sorted === false ? undefined : sorted === "asc" ? "ascending" : "descending"
                      }
                      className={cn(meta?.className, meta?.align === "right" && "text-right")}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <TableCell key={cell.id} className={cn(meta?.className, meta?.align === "right" && "text-right")}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-white">
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-56">
                  <div className="flex flex-col items-center justify-center px-6 text-center">
                    <PackageSearch className="mb-3 h-10 w-10 text-slate-300" aria-hidden />
                    <p className="font-semibold text-brand-navy">Aucun produit ne correspond</p>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      Modifiez la recherche ou retirez une puce de filtre pour élargir les résultats.
                    </p>
                    {hasFilters ? (
                      <Button type="button" variant="outline" size="sm" onClick={resetFilters} className="mt-4">
                        <RotateCcw className="h-4 w-4" aria-hidden />
                        Réinitialiser les filtres
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ------------------- Vue cartes (tablette / mobile) ------------------- */}
      {rows.length > 0 ? (
        <ul className="divide-y divide-slate-100 md:hidden">
          {rows.map((row) => (
            <li key={row.id} className="p-4">
              <ProductRowCard product={row.original} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-6 py-14 text-center md:hidden">
          <PackageSearch className="mx-auto mb-3 h-10 w-10 text-slate-300" aria-hidden />
          <p className="font-semibold text-brand-navy">Aucun produit ne correspond</p>
          <p className="mt-1 text-sm text-slate-500">Ajustez la recherche ou les filtres appliqués.</p>
        </div>
      )}

      <DataTablePagination table={table} rowsLabel={products.length > 1 ? "produits" : "produit"} />
    </section>
  );
}

