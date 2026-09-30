import { NextResponse } from "next/server";
import { createProduct, listProducts } from "@/lib/product-store";
import { guardApi } from "@/lib/auth";
import { revalidateCatalog } from "@/lib/revalidate";
import type { ProductInput } from "@/types/product";

/** GET /api/produits – catalogue public (intégrations externes, applications tierces). */
export async function GET() {
  const products = await listProducts();
  return NextResponse.json({ count: products.length, products });
}

/** POST /api/produits – création d'un produit (réservé à l'administration). */
export async function POST(request: Request) {
  const denied = await guardApi();
  if (denied) return denied;

  try {
    const body = (await request.json()) as ProductInput;
    if (!body?.name || !body?.reference || !body?.category) {
      return NextResponse.json(
        { error: "Nom, référence et catégorie sont obligatoires." },
        { status: 400 }
      );
    }
    const product = await createProduct(body);
    revalidateCatalog(product.slug);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Création impossible (données invalides)." }, { status: 400 });
  }
}
