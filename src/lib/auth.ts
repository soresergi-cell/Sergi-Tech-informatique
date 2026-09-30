import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Authentification de l'espace de gestion (EF-05 / §5 du CDC : administration protégée).
 *
 * Principe : un mot de passe unique (variable d'environnement ADMIN_PASSWORD)
 * ouvre une session matérialisée par un cookie httpOnly contenant un jeton HMAC.
 * Aucun mot de passe n'est stocké côté client.
 */

const ADMIN_COOKIE = "sergi_admin";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 heures

/** Mot de passe d'administration (à définir dans .env.local en production). */
function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "sergitech2026";
}

/** Jeton de session déterministe dérivé du mot de passe. */
export function sessionToken(): string {
  return createHmac("sha256", adminPassword()).update("sergi-admin-v1").digest("hex");
}

/** Comparaison à temps constant (protection contre les attaques par timing). */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Vérifie le mot de passe saisi sur la page de connexion. */
export function checkPassword(input: string): boolean {
  return safeEqual(input, adminPassword());
}

/** Options du cookie de session. */
export function cookieOptions(secure: boolean) {
  return {
    name: ADMIN_COOKIE,
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

/** La requête arrive-t-elle en HTTPS ? (derrière un proxy : x-forwarded-proto) */
export function isSecureRequest(request: Request): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return process.env.NODE_ENV === "production";
  }
}

/** L'utilisateur courant est-il administrateur ? */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, sessionToken());
}

/** Garde de page : redirige vers la connexion si non authentifié. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/connexion?bloque=session");
  }
}

/** Garde d'API : renvoie une réponse 401 si non authentifié. */
export async function guardApi(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Accès non autorisé." }, { status: 401 });
}
