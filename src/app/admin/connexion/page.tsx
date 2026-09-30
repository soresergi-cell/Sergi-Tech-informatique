import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Connexion – Espace de gestion",
  robots: { index: false, follow: false },
};

/** Page de connexion à l'espace de gestion (toujours publique, la redirection
 * d'un administrateur déjà identifié est gérée côté client). */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ suivant?: string }>;
}) {
  const { suivant } = await searchParams;
  const next = suivant && suivant.startsWith("/admin") ? suivant : "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <LoginForm next={next} />
    </main>
  );
}
