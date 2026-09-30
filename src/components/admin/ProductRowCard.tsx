"use client";

import Link from "next/link";
import type { Table } from "@tanstack/react-table";
import { ExternalLink, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/ProductImage";
import { categoryLabel } from "@/data/categories";
import { discountPercent, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { StockPill } from "./product-columns";
import { DeleteProductButton } from "./DeleteProductButton";
import type { Product } from "@/types/product";

/** Tris proposés sur mobile (les en-têtes du tableau y sont masqués). */
const SORTS = [
  { value: "createdAt:desc", label: "Plus récents" },
  { value: "createdAt:asc", label: "Plus anciens" },
  { value: "name:asc", label: "Nom (A → Z)" },
  { value: "price:desc", label: "Prix décroissant" },
  { value: "price:asc", label: "Prix croissant" },
  { value: "stock:asc", label: "Stock faible d’abord" },
];

/** Sélecteur de tri pour la vue cartes (même instance TanStack Table). */
export function ProductRowSortSelect<TData>({
  table,
  className,
}: {
  table: Table<TData>;
  className?: string;
}) {
  const [sort] = table.getState().sorting;
  const current = sort ? `${sort.id}:${sort.desc ? "desc" : "asc"}` : "";
  const known = SORTS.some((option) => option.value === current);

  return (
    <select
      value={known ? current : ""}
      onChange={(event) => {
        if (!event.target.value) return;
        const [id, direction] = event.target.value.split(":");
        table.setSorting([{ id, desc: direction === "desc" }]);
        table.setPageIndex(0);
      }}
      aria-label="Trier les produits"
      className={cn(
        "h-9 rounded-lg border border-input bg-white px-2.5 text-xs font-semibold text-brand-navy shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {!known ? <option value="">Trier par…</option> : null}
      {SORTS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/** Carte d'un produit (vue mobile/tablette du même tableau). */
export function ProductRowCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <article>
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <ProductImage
            src={product.images?.[0]}
            alt=""
            sizes="64px"
            fallbackLabel=""
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-brand-navy">{product.name}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {product.brand} · Réf. {product.reference}
          </p>
          <p className="mt-1 truncate text-xs text-slate-400">{categoryLabel(product.category)}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-sm font-bold tabular-nums text-brand-navy">{formatPrice(product.price)}</span>
          {discount ? (
            <span className="ml-2 inline-flex items-center gap-1 text-xs text-slate-400">
              <s className="tabular-nums line-through">{formatPrice(product.originalPrice!)}</s>
              <Badge variant="promo" className="px-1.5 py-0 text-[10px]">
                -{discount}%
              </Badge>
            </span>
          ) : null}
        </div>
        <StockPill stock={product.stock} />
      </div>

      <div className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/produits/${product.id}`}>
            <Pencil className="h-4 w-4" aria-hidden />
            Modifier
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/produit/${product.slug}`} target="_blank" rel="noopener">
            <ExternalLink className="h-4 w-4" aria-hidden />
            Voir
          </Link>
        </Button>
        <DeleteProductButton productId={product.id} productName={product.name} />
      </div>
    </article>
  );
}
