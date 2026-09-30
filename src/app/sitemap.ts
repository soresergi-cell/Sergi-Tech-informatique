import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/product-store";
import { SITE } from "@/data/site";

/** Sitemap automatique (CDC §2.8) – inclut les produits créés depuis l'administration. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/boutique",
    "/promotions",
    "/devis",
    "/a-propos",
    "/contact",
    "/faq",
    "/mentions-legales",
    "/cgv",
    "/confidentialite",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const products = await listProducts();
  const productRoutes = products.map((p) => ({
    url: `${SITE.url}/produit/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
