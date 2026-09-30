"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, MessageCircle } from "lucide-react";
import { HeroShowcase } from "./HeroShowcase";
import { HOME_ICONS } from "./icons";
import { HERO_ROTATE_MS, TRUST_ITEMS, type HeroBanner } from "@/data/home";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

/** Chiffres déjà calculés côté serveur (catalogue réel). */
export interface HeroStat {
  value: string;
  label: string;
}

export interface HomeHeroProps {
  /** Bannières dont les gabarits `{remise}` / `{promos}` ont été remplacés. */
  banners: HeroBanner[];
  /** Deux sélections : promotions du jour et produits populaires. */
  showcases: Record<HeroBanner["showcase"], Product[]>;
  stats: HeroStat[];
  ribbon: { emoji: string; label: string }[];
}

/**
 * Héro de la page d'accueil.
 *
 * Le message tourne automatiquement entre les bannières de `src/data/home.ts`,
 * et la partie visuelle est un carrousel de produits réels (plus aucune
 * illustration statique). Les chiffres de la bande basse viennent du catalogue.
 */
export function HomeHero({ banners, showcases, stats, ribbon }: HomeHeroProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const count = banners.length;
  const banner = banners[Math.min(index, Math.max(count - 1, 0))];

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), HERO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, reduceMotion]);

  if (!banner) return null;

  return (
    <section className="relative overflow-hidden bg-brand-navy text-white">
      {/* Décor : dégradés radiaux + trame technique */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.25),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(30,58,138,0.6),transparent_60%)]"
      />
      <div aria-hidden className="bg-grid-lines absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="absolute -right-24 top-8 h-72 w-72 animate-float rounded-full bg-brand-orange/15 blur-3xl"
      />

      <div className="container relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:py-20">
        {/* Colonne gauche : message tournant */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-cyan sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" aria-hidden />
                {banner.eyebrow}
              </span>

              <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.85rem]">
                {banner.title}
                <span className="mt-1 block text-brand-cyan">{banner.highlight}</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {banner.subtitle}
              </p>

              {/* Actions principales */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-orange text-white shadow-glow hover:bg-brand-orange/90"
                >
                  <Link href={banner.primary.href}>{banner.primary.label}</Link>
                </Button>
                <Button asChild size="lg" variant="whatsapp">
                  <a
                    href={waLink(banner.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Commander sur WhatsApp
                  </a>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Sélecteur de bannière */}
          {count > 1 && (
            <div className="mt-7 flex items-center gap-3">
              {banners.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Afficher : ${item.primary.label}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 ease-smooth",
                    i === index ? "w-10 bg-brand-cyan" : "w-5 bg-white/25 hover:bg-white/50"
                  )}
                />
              ))}
              <span className="ml-1 text-[11px] font-semibold tabular-nums text-slate-400">
                {index + 1} / {count}
              </span>
            </div>
          )}

          {/* Réassurance, issue des avantages de la page */}
          <ul className="mt-8 grid grid-cols-1 gap-3 text-xs text-slate-300 sm:grid-cols-3 sm:text-sm">
            {TRUST_ITEMS.slice(0, 3).map((item) => {
              const Icon = HOME_ICONS[item.icon];
              return (
                <li key={item.title} className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" aria-hidden />
                  {item.title}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Colonne droite : produits réels en carrousel */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mx-auto w-full max-w-md lg:max-w-none"
        >
          <HeroShowcase
            key={banner.showcase}
            products={showcases[banner.showcase] ?? showcases.promos}
          />
        </motion.div>
      </div>

      {/* Bande de chiffres réels */}
      <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <dl className="container grid grid-cols-2 divide-x divide-white/10 py-5 text-center sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-2">
              <dd className="text-xl font-extrabold text-brand-cyan tabular-nums sm:text-2xl">
                {stat.value}
              </dd>
              <dt className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Bandeau défilant */}
      <div className="overflow-hidden bg-brand-orange py-2 text-xs font-bold uppercase tracking-widest text-white">
        <div className="flex w-max animate-marquee gap-10">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex gap-10" aria-hidden={copy === 1}>
              {ribbon.map((item) => (
                <span key={`${copy}-${item.label}`} className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  {item.label}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Accès rapide : boutique et contact, sous le héro */}
      <div className="border-t border-white/10 bg-brand-navy/95">
        <div className="container flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-xs text-slate-300 sm:text-sm">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-cyan" aria-hidden />
            {SITE.address.street} – {SITE.address.city}
          </span>
          <Link href="/contact" className="font-semibold text-white hover:text-brand-cyan">
            Voir l&apos;emplacement →
          </Link>
        </div>
      </div>
    </section>
  );
}

