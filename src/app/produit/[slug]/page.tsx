import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProductBySlug, listProducts } from "@/lib/product-store";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/product/ProductCard";
import { SITE } from "@/data/site";
import { productJsonLd, JsonLdScript } from "@/lib/seo";
import { categoryLabel } from "@/data/categories";

/** Pré-génération des fiches produit au build (nouvelles fiches rendues à la demande). */
export const dynamicParams = false;
export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

/** Métadonnées dynamiques + Open Graph produit (SEO – CDC §2.8). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  // notFound() ici garantit un vrai statut HTTP 404 (sinon la réponse démarre en 200).
  if (!product) notFound();

  return {
    title: `${product.name} – ${formatPriceMeta(product.price)}`,
    description: product.shortDescription,
    alternates: { canonical: `/produit/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `${SITE.url}/produit/${product.slug}`,
      type: "website",
      images: [{ url: product.images[0], width: 800, height: 800, alt: product.name }],
    },
  };
}

/** Prix formaté pour le titre SEO. */
function formatPriceMeta(price: number) {
  return `${new Intl.NumberFormat("fr-FR").format(price)} FCFA`;
}

/** Page fiche produit détaillée (US-03 / EF-02). */
export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  if (!product) notFound();

  // Suggestions de la même catégorie
  const catalogue = await listProducts();
  const related = catalogue
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="container py-8 md:py-12">
      <ProductDetail product={product} />

      {/* Suggestions */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-xl font-extrabold text-brand-navy sm:text-2xl">
            Dans la même catégorie : {categoryLabel(product.category)}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Données structurées produit (SEO Google) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JsonLdScript(productJsonLd(product)) }}
      />
    </div>
  );
}
