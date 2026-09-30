import type { Metadata } from "next";
import { Catalog } from "@/components/shop/Catalog";
import { listProducts } from "@/lib/product-store";
import {
  applyFilters,
  availableBrands,
  readFilters,
  toSearchParams,
  type SortValue,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Boutique – Tous nos produits informatiques",
  description:
    "Catalogue complet SERGI-TECH : ordinateurs, composants, stockage, périphériques, réseau, impression et accessoires. Filtres prix, marque et disponibilité.",
  alternates: { canonical: "/boutique" },
};

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Page catalogue / boutique (EF-01 à EF-04).
 * Le filtrage est effectué côté serveur : le HTML renvoyé contient déjà les
 * produits correspondants (SEO + rapidité sur connexion mobile lente).
 */
export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = toSearchParams(sp);

  const query = params.get("q") ?? "";
  const tri = (params.get("tri") as SortValue) || "nouveautes";
  const filters = readFilters(params);

  const products = await listProducts();
  const results = applyFilters(products, filters, query, tri);
  const brands = availableBrands(products);

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Notre boutique
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Filtrez par catégorie, marque, prix et disponibilité – trouvez le bon matériel en
          quelques secondes.
        </p>
      </header>

      <Catalog results={results} brands={brands} filters={filters} query={query} tri={tri} />
    </div>
  );
}
