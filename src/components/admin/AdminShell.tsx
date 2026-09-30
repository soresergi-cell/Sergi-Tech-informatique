"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut, Menu, PlusCircle, ShieldCheck, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

type NavItem = { label: string; href: string; icon: typeof LayoutDashboard; match?: "exact" | "prefix" };

/** Navigation groupée de l'espace de gestion. */
const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Catalogue",
    items: [
      { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard, match: "exact" },
      { label: "Ajouter un produit", href: "/admin/produits/nouveau", icon: PlusCircle },
    ],
  },
  {
    group: "Site public",
    items: [{ label: "Voir la boutique", href: "/boutique", icon: Store }],
  },
];

/** Titre affiché dans l'en-tête collant selon la route courante. */
function pageTitle(pathname: string): string {
  if (pathname === "/admin") return "Tableau de bord";
  if (pathname === "/admin/produits/nouveau") return "Nouveau produit";
  if (/^\/admin\/produits\/[^/]+$/.test(pathname)) return "Modifier un produit";
  return "Espace de gestion";
}

/** Vraie si l'item de navigation correspond à la route courante. */
function isActive(item: NavItem, pathname: string): boolean {
  if (item.match === "exact") {
    // Les fiches d'édition restent rattachées au tableau de bord.
    return pathname === item.href || /^\/admin\/produits\/[^/]+$/.test(pathname);
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Liens de navigation (barre latérale et tiroir mobile). */
function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-6" aria-label="Navigation administration">
      {NAV.map((section) => (
        <div key={section.group}>
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            {section.group}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = isActive(item, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {active ? (
                      <span
                        className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-cyan to-brand-blue"
                        aria-hidden
                      />
                    ) : null}
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Bloc marque (barre latérale + tiroir). */
function BrandBlock() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan shadow-lg shadow-brand-blue/25">
        <ShieldCheck className="h-5 w-5 text-white" aria-hidden />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-extrabold text-white">{SITE.name}</p>
        <p className="text-[11px] text-slate-400">Espace de gestion</p>
      </div>
    </div>
  );
}

/** Bouton de déconnexion (supprime le cookie de session). */
function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const logout = async () => {
    setLoading(true);
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/connexion");
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      disabled={loading}
      className={cn("w-full justify-start text-slate-300 hover:bg-white/10 hover:text-white", className)}
    >
      <LogOut className="h-4 w-4" aria-hidden />
      {loading ? "Déconnexion…" : "Déconnexion"}
    </Button>
  );
}

/**
 * Interface de l'espace de gestion : barre latérale fixe (bureau),
 * en-tête collant avec titre de page et actions rapides, contenu défilant.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ----------------------- Barre latérale (bureau) ----------------------- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/10 bg-brand-navy px-4 py-5 lg:flex">
        <div className="px-1 pb-6">
          <BrandBlock />
        </div>

        <div className="scrollbar-slim flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </div>

        <div className="space-y-3 pt-6">
          <p className="rounded-lg bg-white/5 p-3 text-[11px] leading-relaxed text-slate-400 ring-1 ring-inset ring-white/5">
            Les modifications sont publiées immédiatement sur le site public.
          </p>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-72">
        {/* ------------------ En-tête collant (toutes tailles) ------------------ */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Ouvrir le menu d’administration"
                className="-ml-2 lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-brand-navy p-0">
              <SheetHeader className="border-b border-white/10 px-4 py-4 text-left">
                <SheetTitle className="text-left text-white">
                  <BrandBlock />
                </SheetTitle>
              </SheetHeader>
              <div className="scrollbar-slim flex flex-1 flex-col overflow-y-auto p-4">
                <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
                <div className="mt-auto pt-6">
                  <LogoutButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Gestion des produits
            </p>
            <p className="truncate text-sm font-bold text-brand-navy sm:text-base">
              {pageTitle(pathname)}
            </p>
          </div>

          <Button asChild variant="ghost" size="sm" className="hidden text-slate-600 sm:inline-flex">
            <Link href="/boutique" target="_blank" rel="noopener">
              <ExternalLink className="h-4 w-4" aria-hidden />
              Voir la boutique
            </Link>
          </Button>
          <Button asChild size="sm" className="shrink-0">
            <Link href="/admin/produits/nouveau">
              <PlusCircle className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Ajouter un produit</span>
              <span className="sm:hidden">Ajouter</span>
            </Link>
          </Button>
        </header>

        {/* ------------------------------ Contenu ------------------------------ */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}


