import type { Metadata } from "next";
import { LegalContainer, legalMetadata } from "@/components/legal/LegalContainer";
import { SITE } from "@/data/site";

export const metadata: Metadata = legalMetadata(
  "Mentions légales",
  "Mentions légales du site sergi-tech.bf – éditeur, hébergement et propriété intellectuelle.",
  "/mentions-legales"
);

/** Page Mentions légales. */
export default function MentionsLegalesPage() {
  return (
    <LegalContainer title="Mentions légales" updated="28 septembre 2026">
      <h2>1. Éditeur du site</h2>
      <p>
        Le présent site est édité par <strong>{SITE.name}</strong>, entreprise spécialisée dans
        la vente de produits informatiques au Burkina Faso.
      </p>
      <ul>
        <li><strong>Siège social :</strong> {SITE.address.street}, {SITE.address.city}, {SITE.address.country}</li>
        <li><strong>Téléphone :</strong> {SITE.phone}</li>
        <li><strong>E-mail :</strong> {SITE.email}</li>
        <li><strong>Directeur de la publication :</strong> le dirigeant de {SITE.name}</li>
      </ul>

      <h2>2. Hébergement</h2>
      <p>
        Le site est hébergé par un prestataire d’hébergement web professionnel assurant un
        certificat SSL (HTTPS), des sauvegardes automatiques quotidiennes et une disponibilité
        mensuelle supérieure ou égale à 99 %. Les coordonnées complètes de l’hébergeur seront
        communiquées à la mise en ligne.
      </p>

      <h2>3. Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus du site (textes, photographies, logos, charte graphique,
        structure) est la propriété exclusive de {SITE.name} ou de ses partenaires. Toute
        reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.
        Les marques citées (Dell, HP, ASUS, Samsung, etc.) appartiennent à leurs propriétaires
        respectifs.
      </p>

      <h2>4. Responsabilité</h2>
      <p>
        {SITE.name} s’efforce d’assurer l’exactitude des informations publiées (prix,
        disponibilités, caractéristiques techniques). Toutefois, des erreurs ou omissions
        peuvent survenir ; les prix et stocks affichés sur le site prévalent en cas de
        divergence, et la disponibilité est confirmée au moment de la commande.
      </p>

      <h2>5. Droit applicable</h2>
      <p>
        Le présent site est régi par la législation burkinabè. En cas de litige, les parties
        rechercheront en priorité une solution amiable avant toute action judiciaire.
      </p>
    </LegalContainer>
  );
}
