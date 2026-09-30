import { SITE } from "@/data/site";
import { categoryLabel } from "@/data/categories";
import type { Product } from "@/types/product";

/**
 * Données structurées JSON-LD (Schema.org) – exigence SEO du CDC §2.8.
 * Elles permettent l'affichage enrichi des produits dans les résultats Google
 * (prix, disponibilité, marque…).
 */

/** Données structurées de l'organisation (page d'accueil). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressCountry: "BF",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: SITE.socials.map((s) => s.href),
  };
}

/** Données structurées produit (EF – SEO produits). */
export function productJsonLd(product: Product) {
  const inStock = product.stock > 0;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.reference,
    mpn: product.reference,
    brand: { "@type": "Brand", name: product.brand },
    category: categoryLabel(product.category),
    description: product.shortDescription,
    image: product.images.map((src) => SITE.url + src),
    url: `${SITE.url}/produit/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "XOF",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE.name },
    },
  };
}

/** Fil JSON-LD générique (à injecter avec dangerouslySetInnerHTML). */
export function JsonLdScript(data: object) {
  return JSON.stringify(data);
}
