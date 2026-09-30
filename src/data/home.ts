/**
 * Contenu éditorial de la page d'accueil.
 *
 * SEUL FICHIER À MODIFIER pour changer les accroches, les bannières du héro,
 * les avantages ou le bandeau défilant. Aucune mise en page n'y figure : ce sont
 * des données pures, utilisables côté serveur comme côté client.
 *
 * Les produits, promos, prix et compteurs ne sont PAS ici : ils viennent du
 * catalogue (`data/produits.json`), donc de l'espace de gestion.
 */

import type { HomeStats } from "@/lib/product-store";

/** Clés d'icônes disponibles (voir `components/home/icons.tsx`). */
export type HomeIconKey =
  | "truck"
  | "shield"
  | "wallet"
  | "chat"
  | "store"
  | "sparkles"
  | "percent"
  | "clock"
  | "file";

/** Action cliquable d'une bannière. */
export interface HomeCta {
  label: string;
  href: string;
}

/** Bannière du héro : plusieurs messages tournent automatiquement. */
export interface HeroBanner {
  id: string;
  /** Sur-titre. `{remise}` et `{promos}` sont remplacés par les chiffres réels. */
  eyebrow: string;
  /** Début du titre, en blanc. */
  title: string;
  /** Fin du titre, mise en couleur. */
  highlight: string;
  /** Texte d'accompagnement. `{remise}` / `{promos}` pris en charge. */
  subtitle: string;
  primary: HomeCta;
  /** Message WhatsApp prérempli (CTA secondaire « Commander sur WhatsApp »). */
  whatsappMessage: string;
  /** Cible du carrousel de droite. */
  showcase: "promos" | "populaires";
}

export const HERO_BANNERS: HeroBanner[] = [
  {
    id: "boutique",
    eyebrow: "Boutique informatique · Ouagadougou",
    title: "Tout votre équipement informatique,",
    highlight: "testé, garanti, livré à Ouaga.",
    subtitle:
      "Ordinateurs, composants, stockage, réseau et périphériques des marques reconnues. Prix affichés en FCFA, conseil d'expert et commande en 2 minutes sur WhatsApp.",
    primary: { label: "Découvrir la boutique", href: "/boutique" },
    whatsappMessage: "Bonjour SERGI-TECH ! Je cherche un produit informatique.",
    showcase: "promos",
  },
  {
    id: "promotions",
    eyebrow: "Promotions du moment · jusqu'à -{remise} %",
    title: "Des prix barrés,",
    highlight: "de vraies économies.",
    subtitle:
      "{promos} produits en promotion aujourd'hui : stockage, périphériques, composants et portables. Le prix affiché est le prix payé, sans surprise au comptoir.",
    primary: { label: "Voir toutes les promotions", href: "/promotions" },
    whatsappMessage: "Bonjour SERGI-TECH ! Je voudrais profiter d'une promotion en cours.",
    showcase: "promos",
  },
  {
    id: "devis",
    eyebrow: "Entreprises, écoles & ONG",
    title: "Un parc informatique à équiper ?",
    highlight: "Devis personnalisé sous 24 h.",
    subtitle:
      "Volumes, facture conforme, installation et accompagnement à la configuration. Un interlocuteur unique, du devis à la mise en service.",
    primary: { label: "Demander un devis", href: "/devis" },
    whatsappMessage: "Bonjour SERGI-TECH ! Je souhaite un devis pour un achat en quantité.",
    showcase: "populaires",
  },
];

/** Durée d'affichage de chaque bannière et de chaque produit du héro (ms). */
export const HERO_ROTATE_MS = 7000;
export const SHOWCASE_ROTATE_MS = 5000;

/** Éléments du bandeau défilant sous le héro. */
export const RIBBON_ITEMS: { emoji: string; label: string }[] = [
  { emoji: "🔥", label: "Promotions en cours" },
  { emoji: "💳", label: "Paiement à la livraison" },
  { emoji: "🚚", label: "Livraison Ouagadougou 24-48 h" },
  { emoji: "💬", label: "Commande en 1 clic sur WhatsApp" },
  { emoji: "🛡️", label: "Produits neufs garantis" },
];

/** Chiffres de la bande de statistiques : `key` = calcul réel, `value` = texte fixe. */
export type HomeStatKey = "products" | "categories" | "promos" | "brands" | "units";

export interface HomeStatItem {
  key?: HomeStatKey;
  value?: string;
  label: string;
}

export const HERO_STATS: HomeStatItem[] = [
  { key: "products", label: "Produits en ligne" },
  { key: "categories", label: "Catégories" },
  { key: "promos", label: "Promos du jour" },
  { value: "24 h", label: "Réponse WhatsApp" },
];

/** Section « confiance / avantages ». */
export interface TrustItem {
  icon: HomeIconKey;
  title: string;
  text: string;
  /** Pied de carte : précision chiffrée. */
  note?: string;
  href?: string;
  ctaLabel?: string;
}

export const TRUST_ITEMS: TrustItem[] = [
  {
    icon: "truck",
    title: "Retrait & livraison à Ouaga",
    text: "Retrait gratuit en boutique à Kalgodin, ou livraison à domicile sous 24 à 48 h.",
    note: "Livraison locale : 2 000 FCFA",
    href: "/faq",
    ctaLabel: "Conditions de livraison",
  },
  {
    icon: "shield",
    title: "Garantie officielle",
    text: "Chaque article est neuf et couvert de 12 à 36 mois selon la marque, pièces et main-d'œuvre.",
    note: "SAV traité en boutique",
  },
  {
    icon: "wallet",
    title: "Paiement à la livraison",
    text: "Vous réglez après avoir reçu et vérifié le matériel. Espèces, virement et mobile money acceptés.",
    note: "Aucun acompte exigé",
    href: "/contact",
    ctaLabel: "Nous écrire",
  },
  {
    icon: "chat",
    title: "Support WhatsApp",
    text: "Un conseiller technique répond à vos questions de choix, de compatibilité et de stock.",
    note: "Réponse sous 24 h ouvrées",
    href: "/contact",
    ctaLabel: "Poser une question",
  },
];

/** Accroches des sections (sur-titres, titres, liens d'action). */
export const SECTION = {
  promos: {
    eyebrow: "Offres à durée limitée",
    title: "Promotions en cours",
    subtitle:
      "Remises réellement applicables aujourd'hui, calculées depuis le catalogue. Le pourcentage affiché est le pourcentage accordé.",
    cta: { label: "Toutes les promotions", href: "/promotions" },
  },
  categories: {
    eyebrow: "Catalogue",
    title: "Explorez nos catégories",
    subtitle: "Sept univers pour équiper particuliers, professionnels et institutions.",
    cta: { label: "Tout le catalogue", href: "/boutique" },
  },
  popular: {
    eyebrow: "Sélection SERGI-TECH",
    title: "Populaires & nouveautés",
    subtitle:
      "Le classement est calculé automatiquement : mise en avant, promotions, disponibilité et fraîcheur des fiches.",
    cta: { label: "Voir la boutique", href: "/boutique" },
  },
  trust: {
    eyebrow: "Pourquoi nous choisir",
    title: "La tranquillité, du premier message à la livraison",
    subtitle: "Quatre engagements simples, appliqués à chaque commande.",
  },
  devis: {
    eyebrow: "Marchés & volumes",
    title: "Un achat en quantité ? Demandez un devis.",
    subtitle:
      "Entreprises, institutions, ONG et établissements scolaires : obtenez une offre personnalisée pour vos équipements, avec facture conforme.",
  },
  about: {
    eyebrow: "Qui sommes-nous",
    title: "SERGI-TECH, votre partenaire informatique local",
    subtitle:
      "Basés à Ouagadougou, nous accompagnons particuliers, étudiants et professionnels dans le choix de leur matériel informatique.",
  },
} as const;

/** Chiffres du bandeau « à propos », toujours calculés depuis le catalogue. */
export const ABOUT_FIGURES: { key: HomeStatKey; label: string }[] = [
  { key: "categories", label: "catégories" },
  { key: "products", label: "produits en ligne" },
  { key: "promos", label: "promos du jour" },
];

/** Remplace les gabarits `{remise}` et `{promos}` par les valeurs réelles. */
export function fillTemplate(
  template: string,
  values: { remise?: number; promos?: number }
): string {
  return template
    .replace(/\{remise\}/g, String(values.remise ?? 0))
    .replace(/\{promos\}/g, String(values.promos ?? 0));
}

/**
 * Met en forme un chiffre du catalogue (héro, bandeau « à propos »).
 * Un seul point de formatage pour tous les compteurs affichés.
 */
export function statValue(key: HomeStatKey, stats: HomeStats): string {
  switch (key) {
    case "products":
      return String(stats.products);
    case "categories":
      return String(stats.categories);
    case "promos":
      return String(stats.promos);
    case "brands":
      return String(stats.brands);
    case "units":
      return new Intl.NumberFormat("fr-FR").format(stats.unitsInStock);
  }
}
