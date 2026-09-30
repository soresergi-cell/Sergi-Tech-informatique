import { revalidatePath } from "next/cache";

/**
 * Rafraîchit les pages qui affichent le catalogue après une modification
 * effectuée depuis l'espace de gestion (accueil, boutique, promos, sitemap…).
 */
export function revalidateCatalog(slug?: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/boutique");
  revalidatePath("/promotions");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/produit/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/produit/${previousSlug}`);
}
