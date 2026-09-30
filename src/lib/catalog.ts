import type { CategorySlug, Product } from "@/types/product";

/**
 * Logique de filtrage/tri du catalogue.
 * Module partagé entre le serveur (rendu HTML filtré → SEO) et le client (interactions).
 */

/** Tri disponible (US-02). */
export const SORTS = [
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "nom-asc", label: "Nom A → Z" },
] as const;

export type SortValue = (typeof SORTS)[number]["value"];

/** État des filtres du catalogue. */
export interface FilterState {
  categories: CategorySlug[];
  brands: string[];
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  promoOnly: boolean;
}

/** Filtres vides (réinitialisation). */
export const EMPTY_FILTERS: FilterState = {
  categories: [],
  brands: [],
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
  promoOnly: false,
};

/** Lit l'état des filtres depuis les paramètres d'URL. */
export function readFilters(params: URLSearchParams): FilterState {
  return {
    categories: (params.get("categorie") ?? "").split(",").filter(Boolean) as CategorySlug[],
    brands: (params.get("marque") ?? "").split(",").filter(Boolean),
    minPrice: params.get("prix_min") ?? "",
    maxPrice: params.get("prix_max") ?? "",
    inStockOnly: params.get("dispo") === "stock",
    promoOnly: params.get("promo") === "1",
  };
}

/** Sérialise un état de filtres en paramètres d'URL. */
export function writeFilters(filters: FilterState, query: string, tri: SortValue): string {
  const p = new URLSearchParams();
  if (query) p.set("q", query);
  if (filters.categories.length) p.set("categorie", filters.categories.join(","));
  if (filters.brands.length) p.set("marque", filters.brands.join(","));
  if (filters.minPrice) p.set("prix_min", filters.minPrice);
  if (filters.maxPrice) p.set("prix_max", filters.maxPrice);
  if (filters.inStockOnly) p.set("dispo", "stock");
  if (filters.promoOnly) p.set("promo", "1");
  if (tri !== "nouveautes") p.set("tri", tri);
  return p.toString();
}

/** Normalise les searchParams Next.js en URLSearchParams. */
export function toSearchParams(
  input: Record<string, string | string[] | undefined>
): URLSearchParams {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) value.forEach((v) => p.append(key, v));
    else if (value != null) p.set(key, value);
  }
  return p;
}

/** Applique recherche + filtres + tri (EF-04 / US-02). */
export function applyFilters(
  products: Product[],
  f: FilterState,
  q: string,
  tri: SortValue
): Product[] {
  let result = [...products];

  if (q) {
    const needle = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle) ||
        p.reference.toLowerCase().includes(needle) ||
        p.shortDescription.toLowerCase().includes(needle)
    );
  }
  if (f.categories.length) result = result.filter((p) => f.categories.includes(p.category));
  if (f.brands.length) result = result.filter((p) => f.brands.includes(p.brand));
  if (f.minPrice) result = result.filter((p) => p.price >= Number(f.minPrice));
  if (f.maxPrice) result = result.filter((p) => p.price <= Number(f.maxPrice));
  if (f.inStockOnly) result = result.filter((p) => p.stock > 0);
  if (f.promoOnly) result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);

  switch (tri) {
    case "prix-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "prix-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "nom-asc":
      result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
      break;
    default:
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return result;
}

/** Liste des marques disponibles (filtre marque). */
export function availableBrands(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort((a, b) =>
    a.localeCompare(b, "fr")
  );
}
