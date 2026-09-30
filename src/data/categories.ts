import type { Category } from "@/types/product";

/** Les 7 catégories du catalogue (CDC §2.3). */
export const CATEGORIES: Category[] = [
  {
    slug: "ordinateurs",
    label: "Ordinateurs",
    description: "Portables, bureaux et ultraportables pour études, travail et entreprise.",
  },
  {
    slug: "composants",
    label: "Composants",
    description: "Cartes mères, mémoires RAM, alimentations et pièces détachées.",
  },
  {
    slug: "stockage",
    label: "Stockage",
    description: "SSD NVMe, disques durs externes et clés USB rapides.",
  },
  {
    slug: "peripheriques",
    label: "Périphériques",
    description: "Écrans, claviers, souris, casques et webcams.",
  },
  {
    slug: "reseau",
    label: "Réseau",
    description: "Routeurs, points d'accès, switchs et câblage réseau.",
  },
  {
    slug: "impression",
    label: "Impression",
    description: "Imprimantes jet d'encre et laser, cartouches et toners.",
  },
  {
    slug: "accessoires",
    label: "Accessoires",
    description: "Sacs, onduleurs, hubs, câbles et adaptateurs.",
  },
];

/** Retourne le libellé d'une catégorie à partir de son slug. */
export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
