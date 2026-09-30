import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Panier",
  description: "Votre panier d'achats SERGI-TECH – validez votre commande en un clic sur WhatsApp.",
  alternates: { canonical: "/panier" },
  robots: { index: false },
};

/** Page panier (EF-08). */
export default function PanierPage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Votre panier
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Vérifiez vos articles, choisissez le mode de livraison puis validez la commande sur
          WhatsApp.
        </p>
      </header>
      <CartView />
    </div>
  );
}
