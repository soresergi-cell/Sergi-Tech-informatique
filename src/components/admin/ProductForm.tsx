"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SpecsEditor } from "./SpecsEditor";
import { ImageManager } from "./ImageManager";
import { DeleteProductButton } from "./DeleteProductButton";
import { CATEGORIES } from "@/data/categories";
import type { CategorySlug, Product, ProductInput } from "@/types/product";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
}

/** Données initiales du formulaire (création ou édition). */
const EMPTY: ProductInput = {
  name: "",
  reference: "",
  brand: "",
  category: "ordinateurs",
  price: 0,
  originalPrice: undefined,
  promo: undefined,
  images: [],
  shortDescription: "",
  description: "",
  specs: [{ label: "", value: "" }],
  stock: 1,
  warranty: "12 mois",
  featured: false,
};

const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

/**
 * Formulaire de création / modification d'un produit (EF-05, US-08, US-09).
 * Champs obligatoires : nom, référence, catégorie, prix, stock, photo, description courte.
 */
export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = React.useState<ProductInput>(() =>
    product
      ? {
          name: product.name,
          reference: product.reference,
          brand: product.brand,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          promo: product.promo,
          images: product.images,
          shortDescription: product.shortDescription,
          description: product.description,
          specs: product.specs.length ? product.specs : [{ label: "", value: "" }],
          stock: product.stock,
          warranty: product.warranty,
          featured: product.featured ?? false,
        }
      : EMPTY
  );

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [saving, setSaving] = React.useState(false);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  /** Validation côté client avant envoi. */
  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = "Le nom du produit est obligatoire.";
    if (!form.reference.trim()) next.reference = "La référence est obligatoire.";
    if (!CATEGORY_SLUGS.includes(form.category)) next.category = "Catégorie invalide.";
    if (!form.price || form.price <= 0) next.price = "Indiquez un prix supérieur à 0.";
    if (form.originalPrice && form.originalPrice <= form.price)
      next.originalPrice = "Le prix barré doit être supérieur au prix actuel.";
    if (form.stock < 0) next.stock = "Le stock ne peut pas être négatif.";
    if (form.images.length === 0) next.images = "Ajoutez au moins une photo.";
    if (form.shortDescription.trim().length < 10)
      next.shortDescription = "Rédigez une description courte (10 caractères minimum).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  /** Enregistrement (création ou mise à jour via l'API). */
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) {
      setStatus({ type: "error", text: "Merci de corriger les champs signalés ci-dessous." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        mode === "create" ? "/api/produits" : `/api/produits/${product!.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus({ type: "error", text: data.error ?? "Enregistrement impossible." });
        return;
      }

      if (mode === "create") {
        router.push("/admin?ok=created");
        router.refresh();
      } else {
        setStatus({ type: "success", text: "Modifications enregistrées et publiées." });
        router.refresh();
      }
    } catch {
      setStatus({ type: "error", text: "Erreur réseau. Vérifiez votre connexion." });
    } finally {
      setSaving(false);
    }
  };

  const promoActive = !!form.originalPrice && form.originalPrice > form.price;

  return (
    <form onSubmit={save} className="space-y-6 pb-24 lg:pb-0">
      {/* En-tête */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Retour au tableau de bord
            </Link>
          </Button>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">
            {mode === "create" ? "Nouveau produit" : "Modifier le produit"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "create"
              ? "Renseignez la fiche : elle sera publiée immédiatement dans la boutique."
              : `${product?.name} — référence ${product?.reference}`}
          </p>
        </div>

        {mode === "edit" && product && (
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/produit/${product.slug}`} target="_blank">
                <ExternalLink className="h-4 w-4" aria-hidden />
                Voir la fiche
              </Link>
            </Button>
            <DeleteProductButton
              productId={product.id}
              productName={product.name}
              redirectTo="/admin?ok=deleted"
            />
          </div>
        )}
      </header>

      {/* Message d'état */}
      {status && (
        <p
          role="status"
          className={`flex items-start gap-2 rounded-lg p-3.5 text-sm ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-700"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          )}
          {status.text}
        </p>
      )}

      {/* ---------------- Informations générales ---------------- */}
      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-base font-bold text-brand-navy">Informations générales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="p-name">Nom du produit *</Label>
            <Input
              id="p-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ex. : SSD Samsung 980 NVMe M.2 1 To"
              className="mt-1.5"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="p-reference">Référence interne *</Label>
            <Input
              id="p-reference"
              value={form.reference}
              onChange={(e) => set("reference", e.target.value)}
              placeholder="Ex. : ST-ST-3015"
              className="mt-1.5"
              aria-invalid={!!errors.reference}
            />
            {errors.reference && <p className="mt-1 text-xs text-red-600">{errors.reference}</p>}
          </div>

          <div>
            <Label htmlFor="p-brand">Marque *</Label>
            <Input
              id="p-brand"
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              placeholder="Ex. : Samsung"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="p-category">Catégorie *</Label>
            <select
              id="p-category"
              value={form.category}
              onChange={(e) => set("category", e.target.value as CategorySlug)}
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={!!form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#1E3A8A]"
              />
              Mettre en avant sur la page d’accueil
            </label>
          </div>
        </div>
      </section>
      {/* ---------------- Prix, promotion & stock ---------------- */}
      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-base font-bold text-brand-navy">Prix, promotion &amp; stock</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="p-price">Prix de vente (FCFA) *</Label>
            <Input
              id="p-price"
              type="number"
              inputMode="numeric"
              min={0}
              value={form.price || ""}
              onChange={(e) => set("price", Number(e.target.value))}
              className="mt-1.5"
              aria-invalid={!!errors.price}
            />
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
          </div>

          <div>
            <Label htmlFor="p-original">Prix avant promotion (optionnel)</Label>
            <Input
              id="p-original"
              type="number"
              inputMode="numeric"
              min={0}
              value={form.originalPrice ?? ""}
              onChange={(e) =>
                set("originalPrice", e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Prix barré"
              className="mt-1.5"
              aria-invalid={!!errors.originalPrice}
            />
            {errors.originalPrice ? (
              <p className="mt-1 text-xs text-red-600">{errors.originalPrice}</p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Laissez vide si aucun prix barré.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="p-stock">Stock disponible *</Label>
            <Input
              id="p-stock"
              type="number"
              inputMode="numeric"
              min={0}
              value={form.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
              className="mt-1.5"
              aria-invalid={!!errors.stock}
            />
            {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
          </div>

          <div>
            <Label htmlFor="p-warranty">Garantie</Label>
            <Input
              id="p-warranty"
              value={form.warranty}
              onChange={(e) => set("warranty", e.target.value)}
              placeholder="Ex. : 12 mois"
              className="mt-1.5"
            />
          </div>

          {promoActive && (
            <>
              <div>
                <Label htmlFor="p-promo-start">Début de la promotion</Label>
                <Input
                  id="p-promo-start"
                  type="date"
                  value={form.promo?.start ?? ""}
                  onChange={(e) =>
                    set("promo", { start: e.target.value, end: form.promo?.end ?? "" })
                  }
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="p-promo-end">Fin de la promotion</Label>
                <Input
                  id="p-promo-end"
                  type="date"
                  value={form.promo?.end ?? ""}
                  onChange={(e) =>
                    set("promo", { start: form.promo?.start ?? "", end: e.target.value })
                  }
                  className="mt-1.5"
                />
              </div>
            </>
          )}
        </div>

        {promoActive && (
          <p className="mt-3 rounded-lg bg-orange-50 p-3 text-xs text-orange-800">
            Un badge « Promo » et le prix barré seront affichés automatiquement sur le site
            {form.promo?.end ? ` jusqu’au ${form.promo.end}` : ""}.
          </p>
        )}
      </section>

      {/* ---------------- Descriptions ---------------- */}
      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-base font-bold text-brand-navy">Descriptions</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="p-short">Description courte * (affichée dans la boutique)</Label>
            <Textarea
              id="p-short"
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              placeholder="Une phrase qui résume le produit."
              className="mt-1.5 min-h-[80px]"
              aria-invalid={!!errors.shortDescription}
            />
            {errors.shortDescription && (
              <p className="mt-1 text-xs text-red-600">{errors.shortDescription}</p>
            )}
          </div>

          <div>
            <Label htmlFor="p-description">Description détaillée (fiche produit)</Label>
            <Textarea
              id="p-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Présentez le produit, ses atouts et ses usages."
              className="mt-1.5 min-h-[140px]"
            />
          </div>
        </div>
      </section>
      {/* ---------------- Caractéristiques techniques ---------------- */}
      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-1.5 text-base font-bold text-brand-navy">
          Caractéristiques techniques
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Elles s’affichent dans un tableau sur la fiche produit (ex. Processeur, Mémoire, Écran).
        </p>
        <SpecsEditor specs={form.specs} onChange={(specs) => set("specs", specs)} />
      </section>

      {/* ---------------- Photos ---------------- */}
      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-1.5 text-base font-bold text-brand-navy">Photos du produit *</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          La première image sert de visuel principal (boutique, accueil, réseaux sociaux).
        </p>
        <ImageManager images={form.images} onChange={(images) => set("images", images)} />
        {errors.images && <p className="mt-2 text-xs text-red-600">{errors.images}</p>}
      </section>

      {/* ---------------- Barre d'actions ---------------- */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 p-3 backdrop-blur lg:static lg:z-auto lg:rounded-xl lg:border lg:p-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <p className="order-2 text-center text-xs text-muted-foreground sm:order-1 sm:mr-auto sm:text-left">
            Les champs marqués * sont obligatoires.
          </p>
          <Button asChild variant="ghost" className="order-3 sm:order-2">
            <Link href="/admin">Annuler</Link>
          </Button>
          <Button type="submit" size="lg" disabled={saving} className="order-1 sm:order-3">
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <Save className="h-5 w-5" aria-hidden />
            )}
            {saving
              ? "Enregistrement…"
              : mode === "create"
                ? "Publier le produit"
                : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>
    </form>
  );
}
