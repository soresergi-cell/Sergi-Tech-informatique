import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Espace de gestion",
  robots: { index: false, follow: false },
};

/**
 * Layout de l'espace de gestion (groupe de routes protégé).
 * Toute page enfant exige une session administrateur valide.
 */
export default async function GestionLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
