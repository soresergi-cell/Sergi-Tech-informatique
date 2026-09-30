import type { Metadata } from "next";
import { LegalContainer, legalMetadata } from "@/components/legal/LegalContainer";

export const metadata: Metadata = legalMetadata(
  "Conditions générales de vente (CGV)",
  "Conditions générales de vente SERGI-TECH : commandes, prix, paiement à la livraison, livraison, garanties et retours.",
  "/cgv"
);

/** Page Conditions Générales de Vente. */
export default function CgvPage() {
  return (
    <LegalContainer title="Conditions générales de vente (CGV)" updated="28 septembre 2026">
      <h2>Article 1 – Objet</h2>
      <p>
        Les présentes CGV régissent les ventes de produits informatiques conclues via le site
        sergi-tech.bf entre SERGI-TECH (« le vendeur ») et tout client (« le client »),
        particulier ou professionnel.
      </p>

      <h2>Article 2 – Prix</h2>
      <p>
        Les prix sont indiqués en francs CFA (FCFA), toutes taxes comprises. Ils peuvent être
        modifiés à tout moment ; ceux affichés sur le site au moment de la commande font foi.
        Les éventuelles promotions sont appliquées automatiquement pendant leur période de
        validité et signalées par la mention « Promo ».
      </p>

      <h2>Article 3 – Commande</h2>
      <p>
        Le client sélectionne ses articles et peut : (1) valider son panier, puis envoyer sa
        commande via WhatsApp avec un récapitulatif prérempli, ou (2) commander
        directement depuis une fiche produit. Toute commande est confirmée par notre équipe
        (disponibilité, délai, mode de livraison) et vaut acceptation des présentes CGV.
      </p>

      <h2>Article 4 – Paiement</h2>
      <ul>
        <li><strong>Paiement à la livraison</strong> (espèces), remis au livreur ou en boutique ;</li>
        <li><strong>Paiement en boutique</strong> au retrait de la commande ;</li>
        <li>Paiement Mobile Money ou par carte bancaire : disponibles prochainement, ils
          seront proposés via une passerelle sécurisée. Aucune donnée bancaire n’est stockée
          sur le site.</li>
      </ul>

      <h2>Article 5 – Livraison</h2>
      <ul>
        <li><strong>Retrait en boutique</strong> à Ouagadougou : gratuit ;</li>
        <li><strong>Livraison locale</strong> (Ouagadougou) : 2 000 FCFA, sous 24 à 48 h ;</li>
        <li>Autres villes et international : sur devis, délai communiqué à la confirmation.</li>
      </ul>
      <p>
        Le client vérifie la conformité de la livraison en présence du livreur et signale
        toute réserve immédiatement (colis ouvert, produit endommagé).
      </p>

      <h2>Article 6 – Garantie et retours</h2>
      <p>
        Tous les produits sont neufs et garantis 12 à 36 mois selon les articles, conformément
        aux conditions du fabricant. En cas de défaut constaté, le client contacte le service
        après-vente sous 7 jours ; le produit est échangé ou réparé après vérification. Les
        retours sont acceptés uniquement pour produit non ouvert, dans son emballage d’origine,
        accompagné de la facture.
      </p>

      <h2>Article 7 – Données personnelles</h2>
      <p>
        Les données collectées (nom, téléphone, e-mail, adresse) servent exclusivement au
        traitement des commandes et sont conservées de façon sécurisée. Pour plus de détails,
        consultez notre <a href="/confidentialite" className="text-primary hover:underline">politique de confidentialité</a>.
      </p>

      <h2>Article 8 – Médiation et litiges</h2>
      <p>
        Toute réclamation est adressée en priorité au service client (WhatsApp/e-mail). À
        défaut d’accord amiable dans un délai de 15 jours, le litige relève des tribunaux
        compétents du Burkina Faso.
      </p>
    </LegalContainer>
  );
}
