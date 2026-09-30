"use client";

import Link from "next/link";
import type { ColumnDef, FilterFn, RowData } from "@tanstack/react-table";
import { ExternalLink, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/ProductImage";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DeleteProductButton } from "./DeleteProductButton";
import { categoryLabel } from "@/data/categories";
import { discountPercent, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

/** Étiquettes d'état utilisables pour le filtrage cumulatif du tableau. */
export type ProductTag = "stock" | "faible" | "rupture" | "promo";

/** Étiquettes d'un produit (sert au filtrage et aux compteurs des puces). */
export function productTags(product: Product): ProductTag[] {
  const tags: ProductTag[] = [];
  if (product.stock <= 0) tags.push("rupture");
  else if (product.stock <= 5) tags.push("faible");
  else tags.push("stock");
  if (product.originalPrice && product.originalPrice > product.price) tags.push("promo");
  return tags;
}

/** Filtre « tous les tags sélectionnés doivent être présents » (cumul des puces). */
export const filterAllTags: FilterFn<Product> = (row, columnId, filterValue) => {
  const selected = filterValue as ProductTag[];
  if (!Array.isArray(selected) || selected.length === 0) return true;
  const tags = row.getValue(columnId) as ProductTag[];
  return selected.every((tag) => tags.includes(tag));
};

/** Recherche globale : nom, marque, référence, catégorie (termes multi-mots). */
export const globalProductSearch: FilterFn<Product> = (row, _columnId, filterValue) => {
  const q = String(filterValue ?? "").trim().toLowerCase();
  if (!q) return true;
  const haystack =
    `${row.original.name} ${row.original.brand} ${row.original.reference} ${categoryLabel(row.original.category)}`.toLowerCase();
  return q.split(/\s+/).every((term) => haystack.includes(term));
};

/** Date lisible de la colonne « Ajouté le ». */
const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

/** Pastille d'état du stock (cohérente avec le site public). */
export function StockPill({ stock }: { stock: number }) {
  const config =
    stock <= 0
      ? { label: "Rupture", classes: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500" }
      : stock <= 5
        ? {
            label: `${stock} restant${stock > 1 ? "s" : ""}`,
            classes: "bg-amber-50 text-amber-700 ring-amber-200",
            dot: "bg-amber-500",
          }
        : {
            label: `En stock · ${stock}`,
            classes: "bg-emerald-50 text-emerald-700 ring-emerald-200",
            dot: "bg-emerald-500",
          };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ring-1 ring-inset",
        config.classes
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} aria-hidden />
      {config.label}
    </span>
  );
}

/** Métadonnées de colonne : classes responsives appliquées au `<th>` et aux `<td>`. */
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    align?: "left" | "right" | "center";
  }
}

/**
 * Définitions des colonnes du tableau produits — architecture modulaire :
 * ajouter/retirer une entrée ici suffit à faire évoluer le tableau.
 */
export function productColumns(): ColumnDef<Product>[] {
  return [
    // Colonne virtuelle utilisée par les puces de filtrage (jamais affichée).
    {
      id: "tags",
      accessorFn: (product) => productTags(product),
      enableSorting: false,
      filterFn: filterAllTags,
      header: () => null,
      cell: () => null,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Produit" />,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <ProductImage
                src={product.images?.[0]}
                alt=""
                sizes="44px"
                fallbackLabel=""
                className="object-contain p-1"
              />
            </div>
            <div className="min-w-0">
              <Link
                href={`/admin/produits/${product.id}`}
                className="block max-w-[16rem] truncate text-sm font-semibold text-brand-navy transition-colors hover:text-brand-blue focus-visible:underline focus-visible:outline-none"
              >
                {product.name}
              </Link>
              <p className="truncate text-xs text-slate-500">
                {product.brand} · Réf. {product.reference}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Catégorie" />,
      sortingFn: (a, b) =>
        categoryLabel(a.original.category).localeCompare(categoryLabel(b.original.category), "fr"),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-medium">
          {categoryLabel(row.original.category)}
        </Badge>
      ),
      meta: { className: "hidden md:table-cell" },
    },
    {
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Prix" className="justify-end" />,
      cell: ({ row }) => {
        const { price, originalPrice } = row.original;
        const discount = discountPercent(price, originalPrice);
        return (
          <div className="text-right">
            <span className="block text-sm font-bold tabular-nums text-brand-navy">{formatPrice(price)}</span>
            {discount ? (
              <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
                <s className="tabular-nums line-through">{formatPrice(originalPrice!)}</s>
                <Badge variant="promo" className="px-1.5 py-0 text-[10px]">
                  -{discount}%
                </Badge>
              </span>
            ) : null}
          </div>
        );
      },
      meta: { align: "right", className: "text-right" },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
      cell: ({ row }) => <StockPill stock={row.original.stock} />,
      meta: { className: "hidden sm:table-cell" },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ajouté le" />,
      cell: ({ row }) => (
        <time dateTime={row.original.createdAt} className="whitespace-nowrap text-xs text-slate-500">
          {dateFormatter.format(new Date(row.original.createdAt))}
        </time>
      ),
      meta: { className: "hidden xl:table-cell" },
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center justify-end gap-1 opacity-90 transition-opacity group-hover:opacity-100">
            <Button asChild variant="ghost" size="icon" className="h-9 w-9" title={`Voir « ${product.name} »`}>
              <Link
                href={`/produit/${product.slug}`}
                target="_blank"
                rel="noopener"
                aria-label={`Voir ${product.name} sur le site`}
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon" className="h-9 w-9" title={`Modifier ${product.name}`}>
              <Link href={`/admin/produits/${product.id}`} aria-label={`Modifier ${product.name}`}>
                <Pencil className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <DeleteProductButton productId={product.id} productName={product.name} compact />
          </div>
        );
      },
      meta: { align: "right", className: "text-right" },
    },


  ];
}

