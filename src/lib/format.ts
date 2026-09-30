/**
 * Formatage des prix en Francs CFA (XOF).
 * Exemple : 545000 -> "545 000 FCFA"
 */
export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

/** Pourcentage de remise arrondi (badge « Promo »). */
export function discountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/** Libellé de disponibilité à partir du stock (US-03). */
export function stockLabel(stock: number): { label: string; tone: "in" | "low" | "out" } {
  if (stock <= 0) return { label: "Rupture de stock", tone: "out" };
  if (stock <= 5) return { label: `Plus que ${stock} en stock`, tone: "low" };
  return { label: "En stock", tone: "in" };
}

/**
 * Date ISO `YYYY-MM-DD` → libellé français long (« 12 octobre 2026 »).
 * La chaîne est relue en fuseau local : sans cette précaution, une date sans
 * heure est interprétée en UTC et peut reculer d'un jour à l'affichage.
 */
export function toFrDate(iso: string): string {
  const parsed = Date.parse(`${iso.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(parsed)) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(parsed));
}
