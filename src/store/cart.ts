"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, DeliveryMode, Product } from "@/types/product";

/**
 * État global du panier (Zustand + persistance localStorage).
 * Correspond au package « Commandes & Panier » du MCD (Panier / LignePanier).
 */
interface CartState {
  items: CartItem[];
  delivery: DeliveryMode;
  /** Ajoute un produit (ou incrémente la quantité). */
  addItem: (product: Product, quantity?: number) => void;
  /** Modifie la quantité d'une ligne (bornée par le stock). */
  setQuantity: (productId: string, quantity: number) => void;
  /** Supprime une ligne. */
  removeItem: (productId: string) => void;
  /** Vide le panier. */
  clear: () => void;
  /** Mode de livraison : retrait boutique ou livraison locale. */
  setDelivery: (mode: DeliveryMode) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      delivery: "retrait",

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, Math.max(product.stock, 1)) }
                  : i
              ),
            };
          }
          const item: CartItem = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            reference: product.reference,
            price: product.price,
            image: product.images[0],
            quantity: Math.min(quantity, Math.max(product.stock, 1)),
            stock: product.stock,
          };
          return { items: [...state.items, item] };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId
                    ? { ...i, quantity: Math.min(quantity, Math.max(i.stock, 1)) }
                    : i
                ),
        })),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      clear: () => set({ items: [] }),

      setDelivery: (mode) => set({ delivery: mode }),
    }),
    {
      name: "sergi-tech-cart", // clé localStorage
      partialize: (state) => ({ items: state.items, delivery: state.delivery }),
    }
  )
);

/** Nombre total d'articles dans le panier (badge Header). */
export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/** Sous-total du panier. */
export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
