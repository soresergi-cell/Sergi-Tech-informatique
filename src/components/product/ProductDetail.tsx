"use client";

import * as React from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Store,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/input";
import { formatPrice, discountPercent, stockLabel, toFrDate } from "@/lib/format";
import { PromoCountdown } from "@/components/home/PromoCountdown";
import { categoryLabel } from "@/data/categories";
import { productOrderMessage, waLink } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

/**
 * Bloc d'achat de la fiche produit :
 * galerie multi-photos, prix promo, stock, quantité, ajout panier
 * et commande WhatsApp préremplie (EF-02, EF-03, EF-07 / US-03, US-04).
 * Le panneau de commande est défini dans ProductBuyPanel (import circulaire évité).
 */
export function ProductDetail({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [activeImage, setActiveImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  const discount = discountPercent(product.price, product.originalPrice);
  const stock = stockLabel(product.stock);
  const outOfStock = product.stock <= 0;

  const increase = () => setQuantity((q) => Math.min(q + 1, Math.max(product.stock, 1)));
  const decrease = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ---------------- Galerie photos ---------------- */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <ProductImage
                src={product.images[activeImage]}
                alt={`${product.name} – photo ${activeImage + 1}`}
                priority={activeImage === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-2 sm:p-5"
              />
            </motion.div>
          </AnimatePresence>

          {discount && (
            <Badge variant="promo" className="absolute left-4 top-4 text-sm">
              -{discount} % Promo
            </Badge>
          )}
        </div>

        {/* Miniatures */}
        <div className="mt-3 flex gap-3">
          {product.images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveImage(i)}
              aria-label={`Voir la photo ${i + 1}`}
              className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-white transition-all ${
                i === activeImage
                  ? "border-primary shadow"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage
                src={src}
                alt=""
                sizes="80px"
                fallbackLabel=""
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="mt-7">
          <h2 className="mb-2 text-lg font-bold text-brand-navy">Description</h2>
          <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
        </div>
      </div>
      {/* ---------------- Informations & achat ---------------- */}
      <div>
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <ChevronRight className="h-3 w-3" aria-hidden />
          <Link href="/boutique" className="hover:text-primary">Boutique</Link>
          <ChevronRight className="h-3 w-3" aria-hidden />
          <Link href={`/boutique?categorie=${product.category}`} className="hover:text-primary">
            {categoryLabel(product.category)}
          </Link>
        </nav>

        <p className="mb-1.5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <Badge variant="secondary">{product.brand}</Badge>
          <span>Réf. {product.reference}</span>
        </p>

        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-brand-navy sm:text-3xl">
          {product.name}
        </h1>

        {/* Prix */}
        <div className="mt-4 flex flex-wrap items-baseline gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-3xl font-extrabold text-brand-navy">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="price-old text-base">{formatPrice(product.originalPrice)}</span>
              <Badge variant="promo">
                Économisez {formatPrice(product.originalPrice - product.price)}
              </Badge>
            </>
          )}
          {product.promo && (
            <span className="flex w-full flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-slate-500">
              Promotion valable jusqu’au {toFrDate(product.promo.end)}
              <PromoCountdown end={product.promo.end} compact />
            </span>
          )}
        </div>

        {/* Disponibilité & garantie (US-03) */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <p
            className={`flex items-center gap-2 font-semibold ${
              stock.tone === "in"
                ? "text-emerald-600"
                : stock.tone === "low"
                  ? "text-amber-600"
                  : "text-slate-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                stock.tone === "in"
                  ? "bg-emerald-500"
                  : stock.tone === "low"
                    ? "bg-amber-500"
                    : "bg-slate-300"
              }`}
              aria-hidden
            />
            {stock.label}
          </p>
          <p className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
            Garantie : {product.warranty}
          </p>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.shortDescription}</p>

        <Separator className="my-5" />

        {/* Quantité */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 items-center rounded-lg border">
            <button
              onClick={decrease}
              disabled={quantity <= 1}
              aria-label="Diminuer la quantité"
              className="flex h-full w-10 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <span className="w-10 text-center text-sm font-bold" aria-live="polite">
              {quantity}
            </span>
            <button
              onClick={increase}
              disabled={outOfStock || quantity >= product.stock}
              aria-label="Augmenter la quantité"
              className="flex h-full w-10 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            disabled={outOfStock}
            onClick={() => addItem(product, quantity)}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden />
            Ajouter au panier
          </Button>
        </div>

        {/* Commander sur WhatsApp – message prérempli (EF-07) */}
        <Button asChild size="lg" variant="whatsapp" className="mt-3 w-full">
          <a
            href={waLink(productOrderMessage(product, quantity))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            Commander sur WhatsApp
            {quantity > 1 && <span className="font-normal">(× {quantity})</span>}
          </a>
        </Button>

        {/* Modes de livraison (CDC §4.1) */}
        <ul className="mt-5 space-y-2.5 rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">
          <li className="flex items-start gap-2.5">
            <Store className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>
              <strong className="text-brand-navy">Retrait gratuit</strong> en boutique à Ouagadougou.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>
              <strong className="text-brand-navy">Livraison locale</strong> sous 24 – 48 h
              (2 000 FCFA).
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>
              <strong className="text-brand-navy">Paiement à la livraison</strong> ou en espèces
              en boutique.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
