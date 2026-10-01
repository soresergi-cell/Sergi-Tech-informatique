"use client";

import { ProductImage } from "@/components/ui/ProductImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, discountPercent, stockLabel } from "@/lib/format";
import { categoryLabel } from "@/data/categories";
import { productOrderMessage, waLink } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

/**
 * Carte produit (galerie – EF-01) : photo, nom, prix (barre + promo),
 * disponibilité, ajout panier et commande WhatsApp en 1 clic (EF-07).
 */
export function ProductCard({
  product,
  index = 0,
  reveal = true,
}: {
  product: Product;
  index?: number;
  /**
   * À désactiver dans un carrousel horizontal : les cartes décalées hors écran
   * ne sont jamais détectées par l'`IntersectionObserver` de `whileInView` et
   * resteraient invisibles.
   */
  reveal?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const discount = discountPercent(product.price, product.originalPrice);
  const stock = stockLabel(product.stock);
  const outOfStock = product.stock <= 0;

  /** Apparition au défilement ou rendu statique, selon le contexte. */
  const Wrapper = (reveal ? motion.article : "article") as React.ElementType;
  const motionProps = reveal
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.4, delay: Math.min(index * 0.06, 0.3) },
      }
    : undefined;

  return (
    <Wrapper
      {...motionProps}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <Link
        href={`/produit/${product.slug}`}
        className="relative block aspect-square overflow-hidden border-b bg-white"
        aria-label={`Voir la fiche : ${product.name}`}
      >
        <ProductImage
          src={product.images?.[0]}
          alt={`${product.name} – ${categoryLabel(product.category)} SERGI-TECH`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
        />
        {/* Invitation à ouvrir la fiche */}
        <span className="pointer-events-none absolute inset-x-2 bottom-2 flex translate-y-2 items-center justify-center rounded-lg bg-brand-navy/90 py-1.5 text-[11px] font-semibold text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Voir la fiche
        </span>
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {discount && <Badge variant="promo">-{discount} %</Badge>}
          {product.createdAt >= "2026-09-01" && <Badge variant="cyan">Nouveau</Badge>}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Badge variant="outline" className="text-sm">
              Rupture de stock
            </Badge>
          </div>
        )}
      </Link>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <p className="mb-1 flex items-center justify-between gap-1 text-[11px] font-medium text-slate-500">
          <span className="truncate">{product.brand}</span>
          {/* Référence réelle du produit */}
          <span className="shrink-0 font-mono text-[10px] tracking-wide text-slate-400">
            {product.reference}
          </span>
        </p>

        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-brand-navy sm:text-sm">
          <Link href={`/produit/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>

        {/* Prix */}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
          <span className="price-current text-sm font-extrabold sm:text-base md:text-lg">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="price-old text-xs">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Disponibilité */}
        <p
          className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium ${
            stock.tone === "in"
              ? "text-emerald-600"
              : stock.tone === "low"
                ? "text-amber-600"
                : "text-slate-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              stock.tone === "in"
                ? "bg-emerald-500"
                : stock.tone === "low"
                  ? "bg-amber-500"
                  : "bg-slate-300"
            }`}
            aria-hidden
          />
          {stock.label}
        </p>

        {/* Actions : empilées sur mobile, côte à côte sur desktop */}
        <div className="mt-auto flex flex-col gap-1.5 pt-3 sm:flex-row sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8.5 w-full text-xs sm:flex-1 sm:px-3"
            disabled={outOfStock}
            onClick={() => addItem(product)}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>Panier</span>
          </Button>
          <Button asChild size="sm" variant="whatsapp" className="h-8.5 w-full text-xs sm:flex-1 sm:px-3">
            <a
              href={waLink(productOrderMessage(product, 1))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Commander ${product.name} sur WhatsApp`}
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Commander</span>
            </a>
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}
