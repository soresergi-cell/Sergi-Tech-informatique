import { NextResponse } from "next/server";
import { deleteProduct, findProductById, updateProduct } from "@/lib/product-store";
import { guardApi } from "@/lib/auth";
import { revalidateCatalog } from "@/lib/revalidate";
import type { ProductInput } from "@/types/product";

type Params = { params: Promise<{ id: string }> };

/** GET /api/produits/[id] – détail d'un produit. */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await findProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

/** PUT /api/produits/[id] – mise à jour (administration). */
export async function PUT(request: Request, { params }: Params) {
  const denied = await guardApi();
  if (denied) return denied;

  const { id } = await params;
  const previous = await findProductById(id);
  if (!previous) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  try {
    const body = (await request.json()) as ProductInput;
    if (!body?.name || !body?.reference || !body?.category) {
      return NextResponse.json(
        { error: "Nom, référence et catégorie sont obligatoires." },
        { status: 400 }
      );
    }
    const product = await updateProduct(id, body);
    if (!product) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }
    revalidateCatalog(product.slug, previous.slug);
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Mise à jour impossible." }, { status: 400 });
  }
}

/** DELETE /api/produits/[id] – suppression (administration). */
export async function DELETE(_request: Request, { params }: Params) {
  const denied = await guardApi();
  if (denied) return denied;

  const { id } = await params;
  const previous = await findProductById(id);
  const removed = await deleteProduct(id);

  if (!removed) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }
  revalidateCatalog(undefined, previous?.slug);
  return NextResponse.json({ success: true });
}
