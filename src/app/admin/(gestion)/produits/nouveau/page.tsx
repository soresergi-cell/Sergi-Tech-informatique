import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Nouveau produit",
  robots: { index: false, follow: false },
};

/** Page de création d'un produit (EF-05 / US-08). */
export default function NouveauProduitPage() {
  return <ProductForm mode="create" />;
}
