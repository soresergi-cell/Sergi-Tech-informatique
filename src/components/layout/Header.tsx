"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Phone, Search, ShoppingCart, Clock, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/data/categories";
import { SITE } from "@/data/site";
import { useCart, cartCount } from "@/store/cart";
import { useMounted } from "@/hooks/use-mounted";

/**
 * En-tête du site – mobile first :
 * bandeau info, logo, recherche, panier, menu tiroir latéral,
 * barre de catégories (desktop).
 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const count = mounted ? cartCount(items) : 0;

  // Ferme le menu mobile à chaque navigation
  React.useEffect(() => setOpen(false), [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/boutique?q=${encodeURIComponent(q)}` : "/boutique");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Bandeau info (masqué sous 640px) */}
      <div className="hidden bg-brand-navy text-slate-300 sm:block">
        <div className="container flex h-9 items-center justify-between text-xs">
          <p className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <TruckIcon /> Livraison locale &amp; retrait boutique à Ouagadougou
            </span>
            <span className="hidden items-center gap-1.5 md:flex">
              <Clock className="h-3.5 w-3.5 text-brand-cyan" aria-hidden />
              Lun – Sam : 08h – 19h
            </span>
          </p>
          <p className="flex items-center gap-4">
            <Link href="/devis" className="flex items-center gap-1 hover:text-white">
              <Tag className="h-3.5 w-3.5 text-brand-orange" aria-hidden />
              Devis professionnel
            </Link>
            <a href={`tel:${SITE.phoneHref}`} className="flex items-center gap-1 hover:text-white">
              <Phone className="h-3.5 w-3.5 text-brand-cyan" aria-hidden />
              {SITE.phone}
            </a>
          </p>
        </div>
      </div>

      {/* Ligne principale */}
      <div className="container flex h-16 items-center gap-3 md:h-20">
        <MobileNav
          open={open}
          onOpenChange={setOpen}
          onSubmitSearch={submitSearch}
          query={query}
          setQuery={setQuery}
        />

        <Logo className="shrink-0" />

        {/* Recherche desktop */}
        <form onSubmit={submitSearch} className="relative mx-auto hidden max-w-xl flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher : portable, SSD, routeur…"
            className="bg-slate-50 pl-9 pr-16"
            aria-label="Rechercher un produit"
          />
          <Button type="submit" size="sm" className="absolute right-1.5 top-1.5 h-7">
            Rechercher
          </Button>
        </form>
        {/* Actions */}
        <div className="ml-auto flex items-center gap-1.5 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <a
            href={`tel:${SITE.phoneHref}`}
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-brand-navy transition-colors hover:bg-slate-100 sm:flex"
            aria-label={`Appeler ${SITE.phone}`}
          >
            <Phone className="h-5 w-5" />
          </a>

          <Link
            href="/panier"
            aria-label={`Panier (${count} article${count > 1 ? "s" : ""})`}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-brand-navy transition-colors hover:bg-slate-100"
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[11px] font-bold text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Button asChild className="hidden bg-[#25D366] text-white hover:bg-[#1EBE5A] lg:inline-flex">
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                `Bonjour ${SITE.name} ! Je souhaite des informations.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Commander sur WhatsApp
            </a>
          </Button>
        </div>
      </div>

      {/* Barre de catégories (desktop) */}
      <nav className="hidden border-t border-slate-100 bg-slate-50/70 md:block" aria-label="Catégories">
        <div className="container flex h-11 items-center gap-6 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/boutique?categorie=${c.slug}`}
              className="whitespace-nowrap text-[13px] font-medium text-slate-600 transition-colors hover:text-primary"
            >
              {c.label}
            </Link>
          ))}
          <span className="ml-auto flex items-center gap-1.5 text-[13px] font-medium text-brand-orange">
            <Tag className="h-3.5 w-3.5" aria-hidden />
            <Link href="/promotions" className="hover:underline">
              Promotions du moment
            </Link>
          </span>
        </div>
      </nav>
    </header>
  );
}

/** Petit pictogramme camion du bandeau. */
function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 text-brand-cyan"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M1 5h13v11H1zM14 9h4l4 4v3h-8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18.5" r="1.8" />
      <circle cx="17.5" cy="18.5" r="1.8" />
    </svg>
  );
}
