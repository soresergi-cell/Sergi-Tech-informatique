import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth";
import { slugify } from "@/lib/product-store";
import { ALLOWED_MIME, PRODUCTS_DIR, detectImageFormat } from "@/lib/images";

/**
 * POST /api/admin/upload – téléversement des photos produits (EF-05).
 * Les fichiers sont enregistrés dans `public/products/`, puis servis en
 * WebP/AVIF par next/image. L'extension écrite est déduite de la signature
 * binaire du fichier : un JPEG renommé `.png` est range en `.jpg`, ce qui
 * évite les visuels qui « chargent » sans jamais s'afficher.
 *
 * ⚠️ Nécessite un hébergement avec disque persistant (VPS/mutualisé).
 */

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

export async function POST(request: Request) {
  const denied = await guardApi();
  if (denied) return denied;

  const form = await request.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  await fs.mkdir(PRODUCTS_DIR, { recursive: true });
  const urls: string[] = [];

  for (const file of files) {
    if (file.size === 0) {
      return NextResponse.json(
        { error: `Fichier vide : ${file.name}.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Fichier trop volumineux : ${file.name} (5 Mo maximum).` },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Le type déclaré par le navigateur est indicatif : on vérifie le contenu.
    const extension = detectImageFormat(buffer);
    if (!extension) {
      const declared = file.type || "type inconnu";
      const supported = ALLOWED_MIME.join(", ");
      return NextResponse.json(
        {
          error: `Contenu non reconnu pour ${file.name} (déclaré : ${declared}). Formats acceptés : ${supported}.`,
        },
        { status: 415 }
      );
    }

    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "photo";
    const suffix = `${Date.now().toString(36)}${randomBytes(2).toString("hex")}`;
    const filename = `${base}-${suffix}.${extension}`;

    await fs.writeFile(path.join(PRODUCTS_DIR, filename), buffer);
    urls.push(`/products/${filename}`);
  }

  return NextResponse.json({ urls });
}
