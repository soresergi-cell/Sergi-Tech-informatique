"use client";

import * as React from "react";
import { MessageCircle, Store, Truck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Separator } from "@/components/ui/input";
import { useCart, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { DELIVERY } from "@/data/site";
import { cartOrderMessage, waLink } from "@/lib/whatsapp";

/**
 * Récapitulatif du panier : livraison, coordonnées, total et
 * validation de commande via WhatsApp (paiement à la livraison).
 */
export function CartSummary() {
  const items = useCart((s) => s.items);
  const delivery = useCart((s) => s.delivery);
  const setDelivery = useCart((s) => s.setDelivery);

  const [customer, setCustomer] = React.useState({ name: "", phone: "", address: "" });

  const subtotal = cartSubtotal(items);
  const fee = DELIVERY[delivery].fee;
  const total = subtotal + fee;

  /** Message final = récap panier + coordonnées client. */
  const message = React.useMemo(() => {
    let m = cartOrderMessage(items, delivery, subtotal);
    if (customer.name || customer.phone) {
      m += `\n\n— Coordonnées —\nNom : ${customer.name}\nTéléphone : ${customer.phone}`;
      if (delivery === "livraison") m += `\nAdresse : ${customer.address}`;
    }
    return m;
  }, [items, delivery, subtotal, customer]);

  return (
    <aside>
      <div className="sticky top-44 rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-brand-navy">Récapitulatif</h2>

        {/* Mode de livraison (CDC §4.1) */}
        <fieldset className="mb-4 space-y-2">
          <legend className="mb-1 text-sm font-semibold text-brand-navy">Mode de livraison</legend>
          {(Object.keys(DELIVERY) as Array<keyof typeof DELIVERY>).map((mode) => (
            <label
              key={mode}
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 text-sm transition-colors ${
                delivery === mode
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="delivery"
                checked={delivery === mode}
                onChange={() => setDelivery(mode)}
                className="mt-0.5 h-4 w-4 accent-[#1E3A8A]"
              />
              <span>
                <span className="flex items-center gap-1.5 font-semibold text-brand-navy">
                  {mode === "retrait" ? (
                    <Store className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Truck className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {DELIVERY[mode].label}
                </span>
                <span className="text-xs text-muted-foreground">{DELIVERY[mode].note}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <Separator className="my-4" />

        {/* Coordonnées (intégrées au message WhatsApp) */}
        <div className="mb-4 space-y-2.5">
          <Label htmlFor="cart-name">Nom complet *</Label>
          <Input
            id="cart-name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            placeholder="Ex. : Amina Ouédraogo"
          />
          <Label htmlFor="cart-phone">Téléphone *</Label>
          <Input
            id="cart-phone"
            type="tel"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            placeholder="Ex. : 70 00 00 00"
          />
          {delivery === "livraison" && (
            <>
              <Label htmlFor="cart-address">Adresse de livraison *</Label>
              <Input
                id="cart-address"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                placeholder="Quartier, rue, repère…"
              />
            </>
          )}
        </div>

        {/* Totaux */}
        <div className="space-y-1.5 text-sm">
          <p className="flex justify-between text-slate-600">
            <span>Sous-total</span>
            <span>{formatPrice(subtotal)}</span>
          </p>
          <p className="flex justify-between text-slate-600">
            <span>{DELIVERY[delivery].label}</span>
            <span>{fee === 0 ? "Gratuit" : formatPrice(fee)}</span>
          </p>
          <Separator className="my-2" />
          <p className="flex justify-between text-base font-extrabold text-brand-navy">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </p>
        </div>

        {/* Validation de la commande */}
        <Button asChild size="lg" variant="whatsapp" className="mt-4 w-full">
          <a href={waLink(message)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" aria-hidden />
            Commander sur WhatsApp
          </a>
        </Button>

        <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
          Paiement à la livraison ou en boutique – aucune donnée bancaire n’est stockée sur le
          site.
        </p>
      </div>
    </aside>
  );
}
