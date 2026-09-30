import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SITE } from "@/data/site";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "FAQ – Questions fréquentes",
  description:
    "Toutes les réponses sur les commandes, livraison, paiement à la livraison, garanties et retours chez SERGI-TECH.",
  alternates: { canonical: "/faq" },
};

/** Questions fréquentes (page obligatoire – CDC §2.5). */
const FAQ = [
  {
    q: "Comment passer une commande sur le site ?",
    r: "Deux options s’offrent à vous : ajoutez vos articles au panier puis validez la commande sur WhatsApp avec le récapitulatif prérempli, ou cliquez directement sur « Commander WhatsApp » depuis la fiche d’un produit. Votre message contient le nom, la quantité, le prix et le lien du produit.",
  },
  {
    q: "Quels sont les modes de livraison ?",
    r: "Le retrait en boutique à Ouagadougou est gratuit. La livraison locale sur Ouagadougou coûte 2 000 FCFA et est assurée sous 24 à 48 h. Pour les autres villes ou l’international, contactez-nous pour un devis d’expédition.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    r: "Le paiement à la livraison (espèces) et le paiement en boutique sont disponibles dès l’ouverture du site. Le paiement Mobile Money et par carte bancaire sera activé par la suite : vous en serez informé sur cette page.",
  },
  {
    q: "Les produits sont-ils garantis ?",
    r: "Oui, tous nos produits sont neufs et garantis par le fabricant ou par SERGI-TECH, de 12 à 36 mois selon l’article. La garantie figure clairement sur chaque fiche produit.",
  },
  {
    q: "Puis-je obtenir une facture et un devis ?",
    r: "Absolument. Une facture conforme est fournie pour toute commande professionnelle ou institutionnelle. Pour les achats en quantité, utilisez notre formulaire de devis : la réponse est donnée sous 24 h ouvrées.",
  },
  {
    q: "Un produit est en rupture, que faire ?",
    r: "Contactez-nous sur WhatsApp : nous vous informerons de la date de réapprovisionnement ou proposerons une alternative équivalente.",
  },
  {
    q: "Livrez-vous en dehors de Ouagadougou ?",
    r: "Oui, sur devis. Nous organisons des expéditions vers les autres villes du Burkina Faso ainsi que vers l’étranger, avec des frais calculés selon le poids et la destination.",
  },
  {
    q: "Comment suivre ma commande ?",
    r: "Chaque commande validée sur WhatsApp reçoit un accusé de réception de notre équipe, puis des mises à jour jusqu’à la livraison. Vous pouvez aussi nous relancer à tout moment par téléphone ou WhatsApp.",
  },
];

/** Page FAQ. */
export default function FaqPage() {
  return (
    <div className="container max-w-3xl py-10 md:py-14">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Questions fréquentes
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Commandes, livraison, paiement, garanties : trouvez vos réponses ici.
        </p>
      </header>

      <div className="space-y-3">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border bg-white p-4 transition-shadow open:shadow-sm sm:p-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-navy sm:text-base">
              {item.q}
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.r}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-brand-navy p-6 text-center text-white">
        <p className="font-semibold">Vous n’avez pas trouvé votre réponse ?</p>
        <p className="mt-1 text-sm text-slate-300">
          Notre équipe vous répond directement sur WhatsApp.
        </p>
        <a
          href={waLink(`Bonjour ${SITE.name} ! J'ai une question :`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-[#25D366] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1EBE5A]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Écrire sur WhatsApp
        </a>
        <p className="mt-3 text-xs text-slate-400">
          Ou consultez nos <Link href="/cgv" className="underline hover:text-white">CGV</Link> et
          notre <Link href="/confidentialite" className="underline hover:text-white">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}
