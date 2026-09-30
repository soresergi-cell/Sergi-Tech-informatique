"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { Separator } from "@/components/ui/input";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { FilterState } from "@/lib/catalog";

interface FiltersProps {
  state: FilterState;
  brands: string[];
  onChange: (next: FilterState) => void;
  onReset: () => void;
  className?: string;
}

/**
 * Panneau de filtres : catégorie, marque, prix, disponibilité, promo (US-02).
 * Les cases s'appliquent immédiatement ; les prix au blur / à la touche Entrée
 * (évite une requête par frappe sur connexion mobile lente).
 */
export function Filters({ state, brands, onChange, onReset, className }: FiltersProps) {
  const [min, setMin] = React.useState(state.minPrice);
  const [max, setMax] = React.useState(state.maxPrice);

  React.useEffect(() => {
    setMin(state.minPrice);
    setMax(state.maxPrice);
  }, [state.minPrice, state.maxPrice]);

  const toggleIn = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const applyPrice = () => onChange({ ...state, minPrice: min, maxPrice: max });

  return (
    <div className={cn("space-y-5", className)} aria-label="Filtres de produits">
      {/* Catégories */}
      <fieldset>
        <legend className="mb-2.5 text-sm font-bold text-brand-navy">Catégorie</legend>
        <div className="space-y-1.5">
          {CATEGORIES.map((c) => (
            <label
              key={c.slug}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={state.categories.includes(c.slug)}
                onChange={() =>
                  onChange({ ...state, categories: toggleIn(state.categories, c.slug) })
                }
                className="h-4 w-4 rounded border-slate-300 accent-[#1E3A8A]"
              />
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Separator />

      {/* Marques */}
      <fieldset>
        <legend className="mb-2.5 text-sm font-bold text-brand-navy">Marque</legend>
        <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label
              key={b}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={state.brands.includes(b)}
                onChange={() => onChange({ ...state, brands: toggleIn(state.brands, b) })}
                className="h-4 w-4 rounded border-slate-300 accent-[#1E3A8A]"
              />
              {b}
            </label>
          ))}
        </div>
      </fieldset>

      <Separator />

      {/* Prix (FCFA) */}
      <fieldset>
        <legend className="mb-2.5 text-sm font-bold text-brand-navy">Prix (FCFA)</legend>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            aria-label="Prix minimum"
            className="h-9"
          />
          <span className="text-slate-400" aria-hidden>–</span>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            aria-label="Prix maximum"
            className="h-9"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Validez avec Entrée ou en quittant le champ.
        </p>
      </fieldset>

      <Separator />

      {/* Disponibilité & promotions */}
      <fieldset>
        <legend className="mb-2.5 text-sm font-bold text-brand-navy">Disponibilité</legend>
        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50">
            <input
              type="checkbox"
              checked={state.inStockOnly}
              onChange={(e) => onChange({ ...state, inStockOnly: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 accent-[#1E3A8A]"
            />
            En stock uniquement
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50">
            <input
              type="checkbox"
              checked={state.promoOnly}
              onChange={(e) => onChange({ ...state, promoOnly: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 accent-[#F97316]"
            />
            En promotion seulement
          </label>
        </div>
      </fieldset>

      <Button variant="outline" size="sm" className="w-full" onClick={onReset}>
        Réinitialiser les filtres
      </Button>
      <Label className="block text-xs text-muted-foreground md:hidden">
        Les filtres s’appliquent instantanément.
      </Label>
    </div>
  );
}
