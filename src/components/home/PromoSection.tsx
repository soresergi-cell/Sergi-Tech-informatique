import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { ProductCarousel } from "./ProductCarousel";
import { PromoCountdown } from "./PromoCountdown";
import { Reveal } from "@/components/ui/Reveal";
import { SECTION } from "@/data/home";
import { bestDiscount, nextPromoDeadline } from "@/lib/promo";
import type { Product } from "@/types/product";

/**
 * Section « Promotions en cours » (EF-06).
 *
 * La liste, la remise maximale et la date de fin sont calculées depuis le
 * catalogue : ajouter une promotion dans l'administration suffit à alimenter
 * la section, la retirer la fait disparaître automatiquement.
 */
export function PromoSection({ promos }: { promos: Product[] }) {
  if (promos.length === 0) return null;

  const copy = SECTION.promos;
  const remise = bestDiscount(promos);
  const deadline = nextPromoDeadline(promos);

  return (
    <section className="container py-12 md:py-16" aria-labelledby="section-promos">
      <Reveal>
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-orange to-amber-500 px-5 py-5 text-white shadow-lift sm:px-7 sm:py-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Flame className="h-6 w-6" aria-hidden />
            </span>

            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
                {copy.eyebrow}
              </span>
              <h2 id="section-promos" className="text-xl font-extrabold tracking-tight sm:text-2xl">
                {copy.title}
              </h2>
              <p className="mt-0.5 text-sm text-white/90">
                {promos.length} produit{promos.length > 1 ? "s" : ""} en promotion · remise
                jusqu&apos;à <strong className="font-extrabold tabular-nums">-{remise} %</strong>
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              {deadline && <PromoCountdown end={deadline.end} />}
              <Link
                href={copy.cta.href}
                className="group inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-brand-orange shadow-sm transition-transform hover:scale-[1.03]"
              >
                {copy.cta.label}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      <ProductCarousel products={promos} label="Produits en promotion" autoplayMs={6500} />
    </section>
  );
}
