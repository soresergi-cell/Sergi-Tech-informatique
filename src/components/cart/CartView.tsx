"use client";

import { CartItems } from "./CartItems";
import { CartSummary } from "./CartSummary";
import { useCart } from "@/store/cart";
import { useMounted } from "@/hooks/use-mounted";

/**
 * Vue du panier : lignes + récapitulatif (EF-08 / US-05).
 * Gère l'hydratation localStorage et l'état vide.
 */
export function CartView() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);

  if (!mounted) {
    return (
      <div
        className="h-64 animate-pulse rounded-xl bg-slate-100"
        aria-label="Chargement du panier"
        role="status"
      />
    );
  }

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <CartItems />
      <CartSummary />
    </div>
  );
}

/** Panier vide – renvoie vers la boutique. */
function EmptyCart() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-slate-50 px-6 py-16 text-center">
      <svg
        viewBox="0 0 24 24"
        className="mb-4 h-12 w-12 text-slate-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 className="text-lg font-bold text-brand-navy">Votre panier est vide</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Parcourez notre catalogue et ajoutez vos coups de cœur – vous pourrez commander
        directement sur WhatsApp.
      </p>
      <a
        href="/boutique"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        Découvrir la boutique
      </a>
    </div>
  );
}
