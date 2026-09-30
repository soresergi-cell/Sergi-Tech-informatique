/**
 * Logique de promotion (EF-06).
 *
 * Un produit n'est « en promo » que si son prix barré est supérieur au prix
 * courant ET que la date du jour se trouve dans la fenêtre `promo.start` →
 * `promo.end`. Les dates sont des chaînes `YYYY-MM-DD`, comparables
 * lexicographiquement, ce qui évite tout calcul de fuseau horaire.
 */
import { discountPercent } from "@/lib/format";
import type { Product } from "@/types/product";

/** Date du jour au format `YYYY-MM-DD` (utilisable côté serveur et client). */
export function todayIso(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Nombre de jours entre deux dates ISO (`b - a`). */
export function daysBetween(a: string, b: string): number {
  const start = Date.parse(`${a}T00:00:00Z`);
  const end = Date.parse(`${b}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.round((end - start) / 86_400_000);
}

/** État de promotion d'un produit, dates comprises. */
export interface PromoState {
  /** Vrai remise applicable aujourd'hui. */
  active: boolean;
  /** Pourcentage de remise (null si aucune remise renseignée). */
  discount: number | null;
  /** Jours restants (null si promo sans date de fin). */
  endsInDays: number | null;
  /** Avancement de l'opération, entre 0 et 1 (null si sans fenêtre). */
  progress: number | null;
  /** Promo saisie mais dont la fenêtre n'a pas encore commencé. */
  upcoming: boolean;
}

/** Analyse la promotion d'un produit pour une date donnée. */
export function promoState(product: Product, today: string = todayIso()): PromoState {
  const discount = discountPercent(product.price, product.originalPrice);

  if (discount === null) {
    return { active: false, discount: null, endsInDays: null, progress: null, upcoming: false };
  }

  const { start, end } = product.promo ?? {};

  // Remise sans fenêtre de dates : elle s'applique en continu.
  if (!start && !end) {
    return { active: true, discount, endsInDays: null, progress: null, upcoming: false };
  }

  const started = !start || today >= start;
  const ended = !!end && today > end;

  const total = start && end ? Math.max(daysBetween(start, end), 1) : null;
  const elapsed =
    total !== null && start ? Math.min(Math.max(daysBetween(start, today), 0), total) : null;

  return {
    active: started && !ended,
    discount,
    endsInDays: ended ? null : end ? Math.max(daysBetween(today, end), 0) : null,
    progress: total && elapsed !== null ? elapsed / total : null,
    upcoming: !started,
  };
}

/** Remise la plus forte d'une liste de produits (0 si aucune promo active). */
export function bestDiscount(products: Product[], today: string = todayIso()): number {
  return products.reduce((max, product) => {
    const state = promoState(product, today);
    return state.active ? Math.max(max, state.discount ?? 0) : max;
  }, 0);
}

/** Fin de promo la plus proche (null si aucune promo active avec date de fin). */
export function nextPromoDeadline(
  products: Product[],
  today: string = todayIso()
): { end: string; days: number } | null {
  const deadlines = products
    .map((product) => ({ product, state: promoState(product, today) }))
    .filter((x) => x.state.active && x.product.promo?.end)
    .map((x) => ({ end: x.product.promo!.end, days: x.state.endsInDays ?? 0 }))
    .sort((a, b) => a.end.localeCompare(b.end));

  return deadlines[0] ?? null;
}
