import fs from "fs";
import path from "path";

/**
 * Visuels produits : détection du format réel et résolution sûre des fichiers.
 *
 * Pourquoi une détection binaire ? L'extension déclarée par le navigateur
 * (ou le nom du fichier) est rarement fiable : un cliché d'appareil photo est
 * souvent nommé `photo.jpg` alors que son contenu est du PNG ou du WebP.
 * On écrit donc toujours le fichier avec l'extension qui correspond à sa
 * signature, pour que le navigateur et `next/image` le décodent du premier coup.
 */

/** Répertoire des visuels produits (téléversés depuis l'espace de gestion). */
export const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");

/** Extensions acceptées → type MIME servi. */
export const IMAGE_MIME = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
} as const;

export type ImageExtension = keyof typeof IMAGE_MIME;

/** Types MIME acceptés au téléversement (contrôle rapide avant la signature). */
export const ALLOWED_MIME = Object.values(IMAGE_MIME);

const FOURCC = (buffer: Buffer, offset: number) =>
  buffer.subarray(offset, offset + 4).toString("latin1");

/**
 * Détermine le format réel d'une image à partir de ses premiers octets.
 * Renvoie `null` si le contenu n'est pas une image acceptée.
 */
export function detectImageFormat(buffer: Buffer): ImageExtension | null {
  if (buffer.length < 12) return null;

  // JPEG : FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";

  // PNG : 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  )
    return "png";

  // WebP : "RIFF" .... "WEBP"
  if (FOURCC(buffer, 0) === "RIFF" && FOURCC(buffer, 8) === "WEBP") return "webp";

  // AVIF / HEIF : "ftyp" + marque avif | avis | mif1
  if (FOURCC(buffer, 4) === "ftyp") {
    const brand = FOURCC(buffer, 8);
    if (brand === "avif" || brand === "avis" || brand === "mif1") return "avif";
  }

  return null;
}

/** Type MIME correspondant à une extension de fichier (ou `null`). */
export function mimeFromFilename(filename: string): string | null {
  const ext = path.extname(filename).slice(1).toLowerCase() as ImageExtension;
  return IMAGE_MIME[ext] ?? null;
}

/** Nom de fichier ne contenant ni traversée de chemin ni caractère inattendu. */
const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/**
 * Résout le chemin absolu d'un visuel produit en interdisant toute sortie
 * du répertoire `public/products` (protection contre `../../etc/passwd`).
 * Renvoie `null` si le nom est invalide ou si le fichier n'existe pas.
 */
export function resolveProductImage(relativePath: string): string | null {
  if (!relativePath || relativePath.includes("\0")) return null;

  const segments = relativePath.split("/");
  if (!segments.every((segment) => SAFE_NAME.test(segment))) return null;
  if (!mimeFromFilename(segments[segments.length - 1])) return null;

  const absolute = path.resolve(PRODUCTS_DIR, ...segments);
  const root = path.resolve(PRODUCTS_DIR) + path.sep;
  if (!absolute.startsWith(root)) return null;

  try {
    const stat = fs.statSync(absolute, { throwIfNoEntry: false });
    return stat?.isFile() ? absolute : null;
  } catch {
    return null;
  }
}
