"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Badge } from "@/components/ui/badge";
import { categoryLabel } from "@/data/categories";
import { SHOWCASE_ROTATE_MS } from "@/data/home";
import { discountPercent, formatPrice, stockLabel } from "@/lib/format";
import { promoState } from "@/lib/promo";
import { productOrderMessage, waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

/**
 * Carrousel « mise en avant » du héro.
 *
 * Remplace l'ancienne illustration statique : chaque diapositive est un produit
 * réel du catalogue, avec sa photo, son vrai prix, sa vraie remise et un lien
 * de commande WhatsApp prérempli. La sélection est fournie par le serveur
 * (promos en cours puis produits populaires) : rien n'est codé en dur.
 */
export function HeroShowcase({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const count = products.length;
  const active = count > 0 ? products[Math.min(index, count - 1)] : undefined;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), SHOWCASE_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, reduceMotion]);

  if (!active) return null;

  const discount = discountPercent(active.price, active.originalPrice);
  const promo = promoState(active);
  const stock = stockLabel(active.stock);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Halo décoratif derrière la carte */}
      <div className="bg-halo pointer-events-none absolute -inset-8 -z-10 blur-2xl" aria-hidden />

      <div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-lift sm:aspect-[16/11]"
        aria-roledescription="carrousel"
        aria-label="Produits en avant"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <ProductImage
              src={active.images?.[0]}
              alt={`${active.name} – ${categoryLabel(active.category)} SERGI-TECH`}
              sizes="(max-width: 1024px) 90vw, 480px"
              priority
              className="object-contain p-5 pb-28 sm:p-8 sm:pb-28"
            />
          </motion.div>
        </AnimatePresence>

        {/* Badges : remise réelle + fin de l'opération */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount && <Badge variant="promo">-{discount} %</Badge>}
          {promo.active && promo.endsInDays !== null && (
            <Badge variant="cyan">
              {promo.endsInDays === 0 ? "Dernier jour" : `J-${promo.endsInDays}`}
            </Badge>
          )}
          {stock.tone === "low" && <Badge variant="warning">{stock.label}</Badge>}
        </div>

        {/* Navigation */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Produit précédent"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md backdrop-blur transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Produit suivant"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md backdrop-blur transition-colors hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </>
        )}

        {/* Bandeau prix : chiffres réels du catalogue */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy via-brand-navy/95 to-transparent px-4 pb-4 pt-12 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-cyan">
            {active.brand} · {categoryLabel(active.category)}
          </p>
          <Link
            href={`/produit/${active.slug}`}
            className="mt-0.5 line-clamp-1 text-sm font-bold hover:text-brand-cyan sm:text-base"
          >
            {active.name}
          </Link>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="text-lg font-extrabold sm:text-xl">{formatPrice(active.price)}</span>
            {active.originalPrice && active.originalPrice > active.price && (
              <span className="text-xs font-medium text-slate-300 line-through">
                {formatPrice(active.originalPrice)}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/produit/${active.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-brand-navy transition-transform hover:scale-[1.02]"
            >
              Voir la fiche <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <a
              href={waLink(productOrderMessage(active, 1))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              Commander
            </a>
          </div>
        </div>
      </div>

      {/* Vignettes de sélection + compteur */}
      {count > 1 && (
        <div className="mt-3 flex items-center gap-2">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Mettre en avant : ${product.name}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition-all",
                i === index
                  ? "border-brand-cyan ring-2 ring-brand-cyan/35"
                  : "border-white/20 opacity-65 hover:opacity-100"
              )}
            >
              <ProductImage
                src={product.images?.[0]}
                alt=""
                sizes="48px"
                fallbackLabel=""
                className="object-contain p-1"
              />
            </button>
          ))}
          <span className="ml-auto text-[11px] font-semibold tabular-nums text-slate-300">
            {index + 1} / {count}
          </span>
        </div>
      )}
    </div>
  );
}

