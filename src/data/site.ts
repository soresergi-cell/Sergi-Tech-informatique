/**
 * Configuration centrale du site SERGI-TECH.
 * Coordonnées réelles de la boutique : elles irriguent l'en-tête, le pied de
 * page, la page Contact, les mentions légales, la carte Google Maps, les liens
 * WhatsApp et les données structurées JSON-LD. C'est le seul endroit à modifier.
 */
export const SITE = {
  name: "SERGI-TECH",
  tagline: "Votre boutique informatique au Burkina Faso",
  description:
    "SERGI-TECH – Vente d'ordinateurs, composants, périphériques, stockage, réseau et accessoires informatiques au Burkina Faso. Commande en ligne ou directement sur WhatsApp.",
  url: "https://www.sergi-tech.bf",
  locale: "fr-BF",
  currency: "XOF",

  // Contact (CDC §2.9)
  phone: "+226 77 85 27 79",
  phoneHref: "+22677852779",
  email: "contact@sergi-tech.bf",
  whatsapp: "22677852779", // format international sans "+"

  // Adresse boutique + Google Maps (EF-11)
  address: {
    street: "Kalgodin, non loin d'Aube Nouvelle",
    city: "Ouagadougou",
    country: "Burkina Faso",
  },
  // Repère « Aube Nouvelle » : plus fiable sur Google Maps qu'un libellé long.
  mapsQuery: "Aube Nouvelle, Ouagadougou, Burkina Faso",

  // Horaires (EF-12)
  hours: [
    { day: "Lundi – Vendredi", time: "08h00 – 19h00" },
    { day: "Samedi", time: "09h00 – 18h00" },
    { day: "Dimanche", time: "Fermé" },
  ],

  // Réseaux sociaux (EF-13)
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/sergitech.bf", icon: "facebook" as const },
    { label: "Instagram", href: "https://www.instagram.com/sergitech.bf", icon: "instagram" as const },
    { label: "TikTok", href: "https://www.tiktok.com/@sergitech.bf", icon: "tiktok" as const },
  ],
} as const;

/** Conditions de livraison affichées panier / checkout (CDC §4.1). */
export const DELIVERY = {
  retrait: { label: "Retrait en boutique", fee: 0, note: "Gratuit – Kalgodin (Aube Nouvelle)" },
  livraison: { label: "Livraison locale (Ouaga)", fee: 2000, note: "2 000 FCFA – sous 24 à 48 h" },
} as const;
