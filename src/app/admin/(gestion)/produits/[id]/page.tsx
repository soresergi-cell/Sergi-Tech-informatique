import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { findProductById } from "@/lib/product-store";

export const metadata: Metadata = {
  title: "Modifier un produit",
  robots: { index: false, follow: false },
};

/** Page de modification d'un produit (EF-05 / US-08). */
export default async function ModifierProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await findProductById(id);
  if (!product) notFound();

  return <ProductForm mode="edit" product={product} />;
}
