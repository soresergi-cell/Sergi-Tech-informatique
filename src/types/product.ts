/** Types métier alignés sur le MCD des diagrammes UML (packages Catalogue / Commandes / B2B). */

export type CategorySlug =
  | "ordinateurs"
  | "composants"
  | "stockage"
  | "peripheriques"
  | "reseau"
  | "impression"
  | "accessoires";

/** Période d'une promotion (EF-06 : prix barré + dates de validité). */
export interface PromoPeriod {
  start: string; // ISO YYYY-MM-DD
  end: string; // ISO YYYY-MM-DD
}

/** Fiche produit – obligatoire : nom, référence, images, description, specs, prix, promo, stock, garantie, catégorie, marque. */
export interface Product {
  id: string;
  slug: string;
  reference: string;
  name: string;
  brand: string;
  category: CategorySlug;
  /** Prix courant en FCFA */
  price: number;
  /** Prix avant promotion (affiché barré) */
  originalPrice?: number;
  promo?: PromoPeriod;
  images: string[];
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  stock: number;
  warranty: string;
  featured?: boolean;
  createdAt: string; // ISO date – utilisé pour le tri « nouveautés »
}

/** Champs modifiables depuis l'espace de gestion (id, slug et date sont générés côté serveur). */
export type ProductInput = Omit<Product, "id" | "slug" | "createdAt">;

export interface Category {
  slug: CategorySlug;
  label: string;
  description: string;
}

/** Ligne du panier (store Zustand). */
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  reference: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

/** Mode de livraison (CDC §4.1 : retrait boutique / livraison locale / COD). */
export type DeliveryMode = "retrait" | "livraison";
