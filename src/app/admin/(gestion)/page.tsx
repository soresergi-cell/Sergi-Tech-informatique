import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  LayoutDashboard,
  Package,
  Percent,
  PlusCircle,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { ProductDataTable } from "@/components/admin/ProductDataTable";
import type { ProductTag } from "@/components/admin/product-columns";
import { listProducts, storeStats } from "@/lib/product-store";
import { formatPrice } from "@/lib/format";

type SearchParams = Record<string, string | string[] | undefined>;

/** Valeurs acceptées pour le paramètre d'URL `?filtre=`. */
const FILTER_VALUES: ProductTag[] = ["stock", "faible", "rupture", "promo"];

/**
 * Tableau de bord de l'espace de gestion : indicateurs du catalogue et
 * tableau des produits (TanStack Table) avec recherche, tri, filtres et actions.
 */
export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const rawQuery = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const ok = Array.isArray(sp.ok) ? sp.ok[0] : sp.ok;
  const rawFilter = Array.isArray(sp.filtre) ? sp.filtre[0] : sp.filtre;

  const initialFilters = (rawFilter ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is ProductTag => FILTER_VALUES.includes(value as ProductTag));

  const [products, stats] = await Promise.all([listProducts(), storeStats()]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tableau de bord"
        icon={LayoutDashboard}
        description="Ajoutez, modifiez et suivez vos produits : les changements sont publiés immédiatement."
        actions={
          <Button asChild size="lg" className="shrink-0">
            <Link href="/admin/produits/nouveau">
              <PlusCircle className="h-5 w-5" aria-hidden />
              Ajouter un produit
            </Link>
          </Button>
        }
      />

      {/* Confirmation d'action (création / suppression) */}
      {ok ? (
        <p
          role="status"
          className="animate-fade-up flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800 shadow-soft"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {ok === "created"
            ? "Produit publié : il est désormais visible dans la boutique."
            : ok === "deleted"
              ? "Produit supprimé du catalogue."
              : "Opération effectuée avec succès."}
        </p>
      ) : null}

      {/* Indicateurs */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Indicateurs du catalogue">
        <AdminStatCard
          label="Produits au catalogue"
          value={stats.total}
          hint={`${stats.total - stats.outOfStock} disponible(s) à la vente`}
          icon={Package}
          tone="neutral"
          delay={40}
        />
        <AdminStatCard
          label="En promotion"
          value={stats.promos}
          hint="Prix barré actif"
          icon={Percent}
          tone="accent"
          href="/admin?filtre=promo"
          delay={80}
        />
        <AdminStatCard
          label="En rupture"
          value={stats.outOfStock}
          hint="À réapprovisionner"
          icon={AlertTriangle}
          tone="danger"
          href="/admin?filtre=rupture"
          delay={120}
        />
        <AdminStatCard
          label="Valeur du stock"
          value={formatPrice(stats.stockValue)}
          hint="Prix de vente × quantités"
          icon={Wallet}
          tone="success"
          delay={160}
        />
      </section>

      {stats.lowStock > 0 ? (
        <p className="animate-fade-up flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-800 shadow-soft">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
          {stats.lowStock} produit{stats.lowStock > 1 ? "s" : ""} à stock faible (5 unités ou moins).
          <Link href="/admin?filtre=faible" className="font-semibold underline-offset-2 hover:underline">
            Les afficher
          </Link>
        </p>
      ) : null}

      <ProductDataTable
        products={products}
        initialQuery={rawQuery ?? ""}
        initialFilters={initialFilters}
      />
    </div>
  );
}
