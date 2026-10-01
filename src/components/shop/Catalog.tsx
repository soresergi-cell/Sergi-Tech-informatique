"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, PackageSearch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label, Separator } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filters } from "./Filters";
import { ProductCard } from "@/components/product/ProductCard";
import {
  EMPTY_FILTERS,
  SORTS,
  writeFilters,
  type FilterState,
  type SortValue,
} from "@/lib/catalog";
import type { Product } from "@/types/product";

interface CatalogProps {
  /** Produits déjà filtrés et triés côté serveur (HTML rendu = SEO). */
  results: Product[];
  brands: string[];
  filters: FilterState;
  query: string;
  tri: SortValue;
}

/**
 * Interface du catalogue : filtres, tri et recherche.
 * Les résultats proviennent du serveur ; chaque interaction met à jour l'URL
 * (état partageable et indexable) puis Next.js re-rend la liste filtrée.
 */
export function Catalog({ results, brands, filters: initialFilters, query, tri }: CatalogProps) {
  const router = useRouter();
  const [filters, setFilters] = React.useState<FilterState>(initialFilters);
  const [search, setSearch] = React.useState(query);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  // Resynchronisation lorsque le serveur renvoie de nouvelles valeurs
  React.useEffect(() => setFilters(initialFilters), [initialFilters]);
  React.useEffect(() => setSearch(query), [query]);

  /** Navigation vers l'URL correspondant au nouvel état. */
  const navigate = React.useCallback(
    (next: FilterState, nextTri: SortValue = tri, nextQuery: string = query) => {
      const qs = writeFilters(next, nextQuery, nextTri);
      startTransition(() => {
        router.push(qs ? `/boutique?${qs}` : "/boutique", { scroll: false });
      });
    },
    [router, tri, query]
  );

  const updateFilters = (next: FilterState) => {
    setFilters(next);
    navigate(next);
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    navigate(EMPTY_FILTERS);
    setMobileOpen(false);
  };

  const changeSort = (value: SortValue) => navigate(filters, value);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(filters, tri, search.trim());
  };

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.promoOnly ? 1 : 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Colonne de filtres (desktop) */}
      <aside className="hidden lg:block">
        <div className="sticky top-44 rounded-xl border bg-white p-4">
          <Filters state={filters} brands={brands} onChange={updateFilters} onReset={resetFilters} />
        </div>
      </aside>

      <div>
        {/* Barre d'outils */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {/* Filtres (tiroir mobile) */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto p-0">
              <SheetHeader>
                <SheetTitle>Filtrer les produits</SheetTitle>
              </SheetHeader>
              <div className="px-5 py-4">
                <Filters
                  state={filters}
                  brands={brands}
                  onChange={(next) => {
                    updateFilters(next);
                    setMobileOpen(false);
                  }}
                  onReset={resetFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Recherche catalogue */}
          <form onSubmit={submitSearch} className="relative min-w-[180px] flex-1">
            <Input
              name="q"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher dans la boutique…"
              aria-label="Rechercher dans la boutique"
            />
          </form>

          {/* Tri (US-02) */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor="tri"
              className="hidden whitespace-nowrap text-xs text-muted-foreground sm:block"
            >
              Trier par
            </Label>
            <select
              id="tri"
              value={tri}
              onChange={(e) => changeSort(e.target.value as SortValue)}
              className="h-10 rounded-lg border border-input bg-white px-3 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Compteur de résultats */}
        <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground" role="status">
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />}
          <strong className="text-brand-navy">{results.length}</strong>{" "}
          produit{results.length > 1 ? "s" : ""}
          {query && (
            <>
              {" "}
              pour « <strong className="text-brand-navy">{query}</strong> »
            </>
          )}
        </p>

        <Separator className="mb-5" />

        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed bg-slate-50 px-6 py-14 text-center">
            <PackageSearch className="mb-3 h-10 w-10 text-slate-400" aria-hidden />
            <p className="font-semibold text-brand-navy">Aucun produit ne correspond</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Essayez d’élargir vos critères de recherche ou réinitialisez les filtres.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
