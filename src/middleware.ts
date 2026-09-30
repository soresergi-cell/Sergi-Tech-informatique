import { NextResponse, type NextRequest } from "next/server";

/**
 * Protection de l'espace de gestion (EF-05 / §5 du CDC).
 *
 * Le middleware s'exécute AVANT tout rendu : il vérifie le cookie de session
 * (jeton HMAC dérivé du mot de passe administrateur) et bloque l'accès aux pages
 * et aux API sensibles, sans qu'aucune donnée ne soit jamais envoyée au client.
 */

const ADMIN_COOKIE = "sergi_admin";
const SALT = "sergi-admin-v1";

const encoder = new TextEncoder();

/** Calcule le jeton attendu (identique à `src/lib/auth.ts`, en Web Crypto). */
async function expectedToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(SALT));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Comparaison à temps constant. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // Routes publiques d'authentification (connexion / déconnexion / état)
  if (pathname.startsWith("/admin/connexion") || pathname.startsWith("/api/admin/session")) {
    return NextResponse.next();
  }

  // Visuels produits : lecture publique (balises <img> du navigateur)
  if (pathname.startsWith("/api/images")) {
    return NextResponse.next();
  }

  // Le catalogue est public en lecture seule (GET /api/produits)
  const isPublicApi = pathname.startsWith("/api/produits") && method === "GET";

  const requiresAuth =
    !isPublicApi &&
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/api/admin") ||
      pathname.startsWith("/api/produits"));

  if (!requiresAuth) return NextResponse.next();

  const password = process.env.ADMIN_PASSWORD || "sergitech2026";
  const token = request.cookies.get(ADMIN_COOKIE)?.value ?? "";
  const authenticated = token.length > 0 && safeEqual(token, await expectedToken(password));

  if (authenticated) return NextResponse.next();

  // API protégée → réponse JSON 401
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Accès non autorisé." }, { status: 401 });
  }

  // Page protégée → redirection vers la connexion (avec retour après login)
  const loginUrl = new URL("/admin/connexion", request.url);
  loginUrl.searchParams.set("suivant", pathname);
  return NextResponse.redirect(loginUrl);
}

export const runtime = "nodejs";

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
