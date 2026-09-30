import { NextResponse } from "next/server";
import { checkPassword, cookieOptions, isSecureRequest, sessionToken, isAdmin } from "@/lib/auth";

/** POST /api/admin/session – connexion à l'espace de gestion. */
export async function POST(request: Request) {
  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  const secure = isSecureRequest(request);
  response.cookies.set({ ...cookieOptions(secure), value: sessionToken() });
  return response;
}

/** DELETE /api/admin/session – déconnexion. */
export async function DELETE(request: Request) {
  const response = NextResponse.json({ success: true });
  const secure = isSecureRequest(request);
  response.cookies.set({ ...cookieOptions(secure), value: "", maxAge: 0 });
  return response;
}

/** GET /api/admin/session – état de la session (utilisé par l'interface). */
export async function GET() {
  return NextResponse.json({ authenticated: await isAdmin() });
}
