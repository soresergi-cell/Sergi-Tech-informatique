"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

type TabKey = "populaires" | "nouveautes";

/**
 * Onglets « Populaires » / « Nouveautés ».
 * Les deux listes sont calculées côté serveur (score de popularité et date de
 * création des fiches) : changer un produit dans l'administration suffit à
 * faire bouger le classement, sans toucher au code.
 */
export function ProductTabs({ popular, arrivals }: { popular: Product[]; arrivals: Product[] }) {
  const [tab, setTab] = useState<TabKey>("populaires");

  const tabs: { key: TabKey; label: string; icon: typeof Sparkles; items: Product[] }[] = [
    { key: "populaires", label: "Les plus recherchés", icon: TrendingUp, items: popular },
    { key: "nouveautes", label: "Nouveautés", icon: Sparkles, items: arrivals },
  ];

  const active = tabs.find((entry) => entry.key === tab) ?? tabs[0];

  return (
    <div>
      {/* Sélecteur */}
      <div
        role="tablist"
        aria-label="Choix de la sélection de produits"
        className="mb-6 flex w-full gap-1 rounded-full border bg-white p-1 shadow-soft sm:inline-flex sm:w-auto"
      >
        {tabs.map((entry) => {
          const isActive = entry.key === tab;
          const Icon = entry.icon;
          return (
            <button
              key={entry.key}
              type="button"
              role="tab"
              id={`tab-${entry.key}`}
              aria-selected={isActive}
              aria-controls={`panneau-${entry.key}`}
              onClick={() => setTab(entry.key)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none",
                isActive ? "text-white" : "text-slate-600 hover:text-brand-navy"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="selection-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-brand-navy"
                  aria-hidden
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="h-4 w-4" aria-hidden />
                {entry.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {entry.items.length}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Panneau */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.key}
          role="tabpanel"
          id={`panneau-${active.key}`}
          aria-labelledby={`tab-${active.key}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {active.items.map((product, index) => (
            <ProductCard key={`${active.key}-${product.id}`} product={product} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {active.items.length === 0 && (
        <p className="rounded-xl border bg-white p-8 text-center text-sm text-muted-foreground">
          Aucun produit dans cette sélection pour le moment.
        </p>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        {tab === "populaires"
          ? "Classement calculé : mise en avant, promotion en cours, disponibilité et fraîcheur de la fiche."
          : "Les dernières fiches publiées dans l'espace de gestion, de la plus récente à la plus ancienne."}
      </p>
    </div>
  );
}
