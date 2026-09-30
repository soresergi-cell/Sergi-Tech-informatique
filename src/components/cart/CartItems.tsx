"use client";

import { ProductImage } from "@/components/ui/ProductImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";

/** Lignes du panier : image, quantités, prix, suppression. */
export function CartItems() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const clear = useCart((s) => s.clear);

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.article
            key={item.productId}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex gap-3 rounded-xl border bg-white p-3 sm:gap-4 sm:p-4"
          >
            <Link
              href={`/produit/${item.slug}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white sm:h-24 sm:w-24"
            >
              <ProductImage
                src={item.image}
                alt={item.name}
                sizes="96px"
                fallbackLabel=""
                className="object-contain p-1"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-500">{item.reference}</p>
                  <h3 className="line-clamp-2 text-sm font-semibold text-brand-navy">
                    <Link href={`/produit/${item.slug}`} className="hover:text-primary">
                      {item.name}
                    </Link>
                  </h3>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Retirer ${item.name} du panier`}
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                {/* Quantité */}
                <div className="flex h-9 items-center rounded-lg border">
                  <button
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    aria-label="Diminuer la quantité"
                    className="flex h-full w-8 items-center justify-center text-slate-600 hover:bg-slate-50"
                  >
                    <Minus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    aria-label="Augmenter la quantité"
                    className="flex h-full w-8 items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>

                <p className="text-right">
                  <span className="block text-sm font-bold text-brand-navy">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-[11px] text-muted-foreground">
                      {formatPrice(item.price)} / unité
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/boutique">← Continuer mes achats</Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={clear} className="text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" aria-hidden />
          Vider le panier
        </Button>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShoppingCart className="h-3.5 w-3.5" aria-hidden />
        Vos articles restent enregistrés sur cet appareil.
      </p>
    </div>
  );
}
