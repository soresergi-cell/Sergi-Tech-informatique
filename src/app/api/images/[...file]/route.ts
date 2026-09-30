import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { mimeFromFilename, resolveProductImage } from "@/lib/images";

/**
 * GET /api/images/[...file] – diffusion des visuels produits.
 *
 * Intérêt : `next start` ne publie que les fichiers présents dans `public/`
 * au moment du démarrage. Une photo téléversée après le lancement renvoie
 * donc 404 tant que le serveur n'est pas relancé. La réécriture déclarée dans
 * `next.config.ts` (`/products/:path*` → `/api/images/:path*`) n'est évaluée
 * que si le fichier statique est absent : les visuels déjà en cache sont servis
 * par le serveur statique, les nouveaux le sont immédiatement par cette route.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Fichiers products au contenu immuable (nom horodaté à l'ajout). */
const CACHE = "public, max-age=31536000, immutable";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string[] }> }
) {
  const { file } = await params;
  const relative = (file ?? []).join("/");
  const absolute = resolveProductImage(relative);

  if (!absolute) {
    return NextResponse.json({ error: "Image introuvable." }, { status: 404 });
  }

  const contentType = mimeFromFilename(path.basename(absolute));
  if (!contentType) {
    return NextResponse.json({ error: "Format non supporté." }, { status: 415 });
  }

  try {
    const stat = await fs.stat(absolute);
    const etag = `W/"${stat.size.toString(16)}-${Math.trunc(stat.mtimeMs).toString(16)}"`;
    const expected = etag.replace(/^W\//, "");
    const submitted = (request.headers.get("if-none-match") ?? "").trim();
    if (submitted === "*" || submitted.replace(/^W\//, "") === expected) {
      return new NextResponse(null, {
        status: 304,
        headers: { ETag: etag, "Cache-Control": CACHE },
      });
    }

    const data = await fs.readFile(absolute);
    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(stat.size),
        ETag: etag,
        "Last-Modified": stat.mtime.toUTCString(),
        "Cache-Control": CACHE,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image illisible." }, { status: 404 });
  }
}
