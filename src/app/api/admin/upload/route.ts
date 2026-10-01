import { put } from "@vercel/blob";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { guardApi } from "@/lib/auth";
import { slugify } from "@/lib/product-store";
import { ALLOWED_MIME, detectImageFormat } from "@/lib/images";

/**
 * POST /api/admin/upload – téléversement des photos produits via Vercel Blob.
 *
 * Remplace l'écriture locale (`fs.writeFile`) qui ne fonctionne pas sur Vercel
 * (système de fichiers en lecture seule). Les fichiers sont maintenant stockés
 * dans Vercel Blob et servis depuis un CDN. Le token est lu depuis la variable
 * d'environnement BLOB_READ_WRITE_TOKEN (à créer dans Vercel Dashboard → Storage).
 */

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

export async function POST(request: Request) {
  const denied = await guardApi();
  if (denied) return denied;

  // Vérification préalable : le token Blob doit être configuré
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Le stockage d'images n'est pas encore configuré. Ajoutez BLOB_READ_WRITE_TOKEN dans les variables d'environnement Vercel.",
      },
      { status: 503 }
    );
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

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

    // Vérification du format réel (la déclaration du navigateur est indicative)
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
    const filename = `products/${base}-${suffix}.${extension}`;

    // Upload vers Vercel Blob (CDN mondial, persistant)
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: file.type || `image/${extension}`,
    });

    urls.push(blob.url);
  }

  return NextResponse.json({ urls });
}
