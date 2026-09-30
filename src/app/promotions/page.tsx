import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, Percent } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { PromoCountdown } from "@/components/home/PromoCountdown";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";
import { toFrDate } from "@/lib/format";
import { nextPromoDeadline } from "@/lib/promo";
import { listPromoProducts } from "@/lib/product-store";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Promotions – Offres en cours au prix barré | SERGI-TECH",
  description:
    "Toutes les promotions SERGI-TECH : prix barrés appliqués automatiquement, remise affichée en pourcentage et date de fin de l'opération. Commande WhatsApp ou retrait en boutique.",
  alternates: { canonical: "/promotions" },
};

/** Liste resserrée toutes les 15 min + rafraîchissement immédiat après une
 *  modification de fiche depuis l'administration. */
export const revalidate = 900;

/** Fenêtre globale des promotions affichées : du premier démarrage au dernier terme. */
function promoWindow(products: Product[]): { start: string | null; end: string | null } {
  const starts = products
    .map((product) => product.promo?.start)
    .filter((value): value is string => Boolean(value))
    .sort();
  const ends = products
    .map((product) => product.promo?.end)
    .filter((value): value is string => Boolean(value))
    .sort();

  return { start: starts[0] ?? null, end: ends[ends.length - 1] ?? null };
}

/** Page dédiée aux promotions : uniquement les offres applicables aujourd'hui. */
export default async function PromotionsPage() {
  const promos = await listPromoProducts();
  const period = promoWindow(promos);
  /** C'est la fin la plus proche qui s'affiche sur le minuteur. */
  const deadline = nextPromoDeadline(promos);

  return (
    <div className="container py-10 md:py-14">
      {/* En-tête : titre, fenêtre de l'opération et minuteur le plus urgent */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-orange to-amber-500 p-6 text-white shadow-lift sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Percent className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Promotions en cours
              <span className="ml-2 rounded-full bg-white/20 px-2.5 py-1 align-middle text-sm font-bold tabular-nums">
                {promos.length}
              </span>
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-white/90">
              Prix barrés appliqués automatiquement, remise affichée en pourcentage et quantités
              limitées. Retrait en boutique à Ouagadougou ou livraison sur devis.
            </p>
            {period.start && period.end && (
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/80">
                Opération du {toFrDate(period.start)} au {toFrDate(period.end)}
              </p>
            )}
          </div>
        </div>

        {deadline && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl bg-black/15 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm">
              <span className="font-bold">Offre la plus urgente</span>{" "}
              <span className="text-white/80">
                — fin dans {deadline.days} jour{deadline.days > 1 ? "s" : ""}, les prix barrés
                sautent ensuite automatiquement
              </span>
            </span>
            <PromoCountdown end={deadline.end} tone="light" daysLabel="jours" />
          </div>
        )}
      </div>

      {/* Grille */}
      {promos.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {promos.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="mx-auto max-w-lg rounded-2xl border bg-white p-8 text-center shadow-soft">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Percent className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="text-lg font-bold text-brand-navy">
              Aucune promotion active pour le moment
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Les remises du moment apparaîtront ici dès leur mise en ligne. En attendant, nos
              conseillers calculent un prix sur mesure pour votre matériel ou votre parc.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/boutique">
                  Parcourir le catalogue <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/devis">Demander un devis</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Renfort conseil */}
      <div className="mt-8 flex flex-col items-start gap-3 rounded-xl border border-dashed bg-slate-50 p-4 text-sm sm:flex-row sm:items-center">
        <Info className="h-5 w-4 shrink-0 text-primary" aria-hidden />
        <p className="text-muted-foreground">
          Une remise vous intéresse mais la référence est déjà partie ? Écrivez-nous sur{" "}
          <span className="font-semibold text-brand-navy">{SITE.phone}</span> : nous réapprovisionnons
          chaque semaine et gardons le tarif promo sur la commande suivante quand le stock revient.
        </p>
        <Button asChild variant="outline" size="sm" className="shrink-0 sm:ml-auto">
          <Link href="/contact">Poser une question</Link>
        </Button>
      </div>
    </div>
  );
}
