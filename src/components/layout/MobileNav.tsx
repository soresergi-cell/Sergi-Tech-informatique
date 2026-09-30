"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Socials } from "./Socials";
import { CATEGORIES } from "@/data/categories";
import { SITE } from "@/data/site";

const NAV_MAIN = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "Promotions", href: "/promotions" },
  { label: "Devis", href: "/devis" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSearch: (e: React.FormEvent) => void;
  query: string;
  setQuery: (v: string) => void;
}

/** Menu latéral mobile : recherche, navigation, catégories, contact (US-01). */
export function MobileNav({ open, onOpenChange, onSubmitSearch, query, setQuery }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Déclenché par le bouton hamburger du Header (état contrôlé) */}
      <SheetContent side="left" className="p-0">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Navigation mobile">
          {/* Recherche mobile */}
          <form onSubmit={onSubmitSearch} className="relative mb-5">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit…"
              className="pl-9"
              aria-label="Rechercher un produit"
            />
          </form>

          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</p>
          <ul className="mb-6 space-y-1">
            {NAV_MAIN.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`flex rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === l.href
                      ? "bg-primary/10 text-primary"
                      : "text-brand-navy hover:bg-slate-100"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Catégories</p>
          <ul className="space-y-1">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/boutique?categorie=${c.slug}`}
                  className="flex rounded-lg px-3 py-2.5 text-sm text-brand-navy transition-colors hover:bg-slate-100"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t pt-5 text-sm text-slate-600">
            <a href={`tel:${SITE.phoneHref}`} className="mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" aria-hidden /> {SITE.phone}
            </a>
            <p className="mb-3 flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {SITE.address.street}, {SITE.address.city}
            </p>
            <Socials />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
