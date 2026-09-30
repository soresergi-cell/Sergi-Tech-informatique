import { SITE } from "@/data/site";
import { categoryLabel } from "@/data/categories";
import { formatPrice } from "@/lib/format";
import type { CartItem, DeliveryMode, Product } from "@/types/product";
import { DELIVERY } from "@/data/site";

/**
 * Utilitaires de commande WhatsApp (EF-07 / US-04).
 * Construit un message prérempli contenant : produit, quantité, prix et lien de la fiche.
 */

/** Lien wa.me avec message pré-encodé. */
export function waLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Message de commande d'un produit (fiche produit / ProductCard). */
export function productOrderMessage(product: Product, quantity: number = 1): string {
  const lines = [
    `Bonjour ${SITE.name} ! 👋`,
    `Je souhaite commander :`,
    `• Produit : ${product.name}`,
    `• Référence : ${product.reference}`,
    `• Catégorie : ${categoryLabel(product.category)}`,
    `• Quantité : ${quantity}`,
    `• Prix unitaire : ${formatPrice(product.price)}`,
    `• Total : ${formatPrice(product.price * quantity)}`,
    `• Lien fiche : ${SITE.url}/produit/${product.slug}`,
    ``,
    `Merci de me confirmer la disponibilité et les modalités de livraison.`,
  ];
  return lines.join("\n");
}

/** Message récapitulatif du panier (page Panier → Commander). */
export function cartOrderMessage(
  items: CartItem[],
  delivery: DeliveryMode,
  subtotal: number
): string {
  const lines = [
    `Bonjour ${SITE.name} ! 👋`,
    `Je passe commande depuis le site :`,
    ``,
    ...items.map(
      (i) =>
        `• ${i.name} (${i.reference}) × ${i.quantity} = ${formatPrice(i.price * i.quantity)}`
    ),
    ``,
    `Sous-total : ${formatPrice(subtotal)}`,
    `Mode : ${DELIVERY[delivery].label}${
      delivery === "livraison" ? ` (+${formatPrice(DELIVERY.livraison.fee)})` : ""
    }`,
    `Total estimé : ${formatPrice(subtotal + DELIVERY[delivery].fee)}`,
    `Paiement : à la livraison / en boutique`,
    ``,
    `Merci de me confirmer la commande et le délai de livraison.`,
  ];
  return lines.join("\n");
}

/** Message générique de demande de devis (US-07). */
export function quoteMessage(data: {
  name: string;
  company?: string;
  email: string;
  phone: string;
  subject: string;
  details: string;
}): string {
  return [
    `Bonjour ${SITE.name} ! 👋`,
    `Nouvelle demande de devis :`,
    `• Nom : ${data.name}`,
    data.company ? `• Société : ${data.company}` : null,
    `• E-mail : ${data.email}`,
    `• Téléphone : ${data.phone}`,
    `• Objet : ${data.subject}`,
    `• Détails : ${data.details}`,
  ]
    .filter(Boolean)
    .join("\n");
}
