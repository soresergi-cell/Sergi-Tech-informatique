"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";

/**
 * Enveloppe publique du site (header, contenu, footer, bouton WhatsApp).
 * Les pages de l'espace de gestion (/admin) sont affichées sans cette enveloppe :
 * elles possèdent leur propre interface.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <div className="flex min-h-screen flex-col">{children}</div>;

  return (
    <>
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
