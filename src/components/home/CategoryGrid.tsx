import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "./SectionHeader";
import { ArrowRight, CATEGORY_ICONS } from "./icons";
import { CATEGORIES } from "@/data/categories";
import { SECTION } from "@/data/home";
import type { CategoryCount } from "@/lib/product-store";
import type { CategorySlug } from "@/types/product";

/**
 * Grille des catégories (US-01).
 * Les libellés viennent de `src/data/categories.ts`, les compteurs du catalogue
 * réel : le nombre de produits et le nombre de promotions s'affichent à jour,
 * sans ressaisie manuelle.
 */
export function CategoryGrid({ counts }: { counts: Record<CategorySlug, CategoryCount> }) {
  const copy = SECTION.categories;
  const total = CATEGORIES.reduce((sum, category) => sum + (counts[category.slug]?.total ?? 0), 0);

  return (
    <section className="bg-slate-50 py-12 md:py-16" aria-labelledby="section-categories">
      <div className="container">
        <SectionHeader
          id="section-categories"
          eyebrow={copy.eyebrow}
          title={copy.title}
          subtitle={copy.subtitle}
          action={copy.cta}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.slug];
            const count = counts[category.slug] ?? { total: 0, promos: 0, inStock: 0 };

            return (
              <Reveal key={category.slug} delay={index * 0.04}>
                <Link
                  href={`/boutique?categorie=${category.slug}`}
                  className="group flex h-full flex-col rounded-2xl border bg-white p-4 shadow-soft transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift sm:p-5"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>

                  <span className="text-sm font-bold text-brand-navy sm:text-[15px]">
                    {category.label}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
                    {category.description}
                  </span>

                  <span className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <span className="text-[11px] font-semibold tabular-nums text-slate-500">
                      {count.total} produit{count.total > 1 ? "s" : ""}
                    </span>
                    {count.promos > 0 ? (
                      <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold text-brand-orange">
                        {count.promos} en promo
                      </span>
                    ) : (
                      <ArrowRight
                        className="h-4 w-4 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden
                      />
                    )}
                  </span>
                </Link>
              </Reveal>
            );
          })}

          {/* Huitième tuile : renvoi vers tout le catalogue */}
          <Reveal delay={CATEGORIES.length * 0.04}>
            <Link
              href="/boutique"
              className="group flex h-full flex-col justify-between rounded-2xl bg-brand-navy p-4 text-white shadow-lift transition-all duration-300 ease-smooth hover:-translate-y-1 hover:bg-brand-blue sm:p-5"
            >
              <span>
                <span className="block text-2xl font-extrabold tabular-nums sm:text-3xl">
                  {total}
                </span>
                <span className="mt-1 block text-xs text-slate-300">
                  références disponibles en boutique
                </span>
              </span>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-cyan">
                Tout le catalogue
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
