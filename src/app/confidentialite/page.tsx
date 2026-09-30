import type { Metadata } from "next";
import { LegalContainer, legalMetadata } from "@/components/legal/LegalContainer";
import { SITE } from "@/data/site";

export const metadata: Metadata = legalMetadata(
  "Politique de confidentialité",
  "Politique de confidentialité SERGI-TECH : données collectées, finalités, conservation et droits des utilisateurs.",
  "/confidentialite"
);

/** Page Politique de confidentialité (conformité protection des données). */
export default function ConfidentialitePage() {
  return (
    <LegalContainer title="Politique de confidentialité" updated="28 septembre 2026">
      <h2>1. Responsable du traitement</h2>
      <p>
        {SITE.name}, {SITE.address.street}, {SITE.address.city} – contact : {SITE.email}.
      </p>

      <h2>2. Données collectées</h2>
      <ul>
        <li>
          <strong>Panier :</strong> articles ajoutés et mode de livraison, stockés
          localement dans votre navigateur (localStorage) et jamais transmis à un serveur ;
        </li>
        <li>
          <strong>Formulaires :</strong> nom, téléphone, e-mail, adresse, objet et contenu du
          message lorsque vous demandez un devis ou nous écrivez ;
        </li>
        <li>
          <strong>Statistiques :</strong> données de fréquentation anonymes (Google Analytics)
          afin d’améliorer le site.
        </li>
      </ul>

      <h2>3. Finalités</h2>
      <p>
        Les données sont utilisées pour traiter les commandes et devis, assurer le suivi
        commercial, répondre aux demandes de contact et produire des statistiques
        d’audience. Elles ne sont ni vendues ni louées à des tiers.
      </p>

      <h2>4. Conservation</h2>
      <p>
        Les données de commandes et devis sont conservées le temps nécessaire au suivi
        commercial et aux obligations comptables, puis supprimées ou anonymisées. Le panier
        local peut être vidé à tout moment depuis votre navigateur.
      </p>

      <h2>5. Vos droits</h2>
      <p>
        Conformément aux règles de protection des données, vous disposez d’un droit d’accès,
        de rectification et de suppression de vos données. Exercez-le en écrivant à{" "}
        <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a> ;
        une réponse vous sera apportée sous 30 jours.
      </p>

      <h2>6. Cookies</h2>
      <p>
        Le site utilise uniquement des cookies techniques (fonctionnement du panier) et des
        cookies de mesure d’audience. Aucun traceur publicitaire tiers n’est déposé sans votre
        accord.
      </p>

      <h2>7. Sécurité</h2>
      <p>
        Le site est servi en HTTPS. Aucune donnée bancaire n’est enregistrée sur nos
        systèmes ; les paiements sont soit à la livraison, soit traités par des prestataires
        agréés (lorsqu’ils seront activés).
      </p>
    </LegalContainer>
  );
}
