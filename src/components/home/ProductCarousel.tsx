"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

/** Largeurs de carte, mobile d'abord : environ 1,3 carte visible puis jusqu'à 4. */
const CARD_WIDTH = "w-[72%] min-[480px]:w-[52%] sm:w-[42%] lg:w-[31%] xl:w-[23.6%]";

/**
 * Carrousel de produits (défilement magnétique natif).
 *
 * - glissement au doigt sur mobile, flèches et clavier sur desktop ;
 * - avance automatique douce, en pause au survol, au focus ou onglet caché ;
 * - aucun défilement automatique si `prefers-reduced-motion` est actif ;
 * - les cartes sont de vraies `ProductCard` : prix, promo et panier restent réels.
 */
export function ProductCarousel({
  products,
  label,
  autoplayMs = 0,
  header,
  itemClassName = CARD_WIDTH,
  className,
}: {
  products: Product[];
  /** Libellé du carrousel pour les lecteurs d'écran. */
  label: string;
  /** Intervalle d'avance en millisecondes (0 = pas d'avance automatique). */
  autoplayMs?: number;
  /** En-tête personnalisé (titre, compte à rebours, lien…). */
  header?: ReactNode;
  itemClassName?: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false, progress: 0 });
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  /** Position des bords et avancement du défilement. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setEdges({
      atStart: track.scrollLeft <= 4,
      atEnd: max <= 4 || track.scrollLeft >= max - 4,
      progress: max > 0 ? Math.min(track.scrollLeft / max, 1) : 1,
    });
  }, []);

  /** Largeur d'un pas de défilement : une carte + l'espace entre cartes. */
  const step = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + 12 : track.clientWidth * 0.8;
  }, []);

  const go = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollBy({ left: direction * step(), behavior: reduceMotion ? "auto" : "smooth" });
    },
    [reduceMotion, step]
  );

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, products.length]);

  useEffect(() => {
    if (!autoplayMs || reduceMotion || products.length < 4) return;

    const timer = window.setInterval(() => {
      if (paused || document.hidden) return;
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - 4) track.scrollTo({ left: 0, behavior: "smooth" });
      else track.scrollBy({ left: step(), behavior: "smooth" });
    }, autoplayMs);

    return () => window.clearInterval(timer);
  }, [autoplayMs, paused, products.length, reduceMotion, step]);

  if (products.length === 0) return null;

  // Trois produits ou moins : une grille est plus lisible qu'un carrousel.
  if (products.length < 4) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3", className)}>
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    );
  }

  return (
    <section
      aria-roledescription="carrousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
      className={cn("relative", className)}
    >
      {header}

      {/* Commandes : sur mobile, le balayage tactile suffit */}
      <div className="mb-3 hidden items-center justify-end gap-2 sm:flex">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={edges.atStart}
          aria-label="Produits précédents"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-sm transition-colors hover:border-primary/50 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={edges.atEnd}
          aria-label="Produits suivants"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-sm transition-colors hover:border-primary/50 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div ref={trackRef} onScroll={measure} className="snap-track">
        {products.map((product, index) => (
          <div key={product.id} className={itemClassName}>
            <ProductCard product={product} index={index} reveal={false} />
          </div>
        ))}
      </div>

      {/* Repère discret de position dans la liste */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-200" aria-hidden>
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-smooth"
          style={{ width: `${Math.max(edges.progress * 100, 12)}%` }}
        />
      </div>
    </section>
  );
}

