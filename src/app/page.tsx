import type { Metadata } from "next";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DevisAndAbout } from "@/components/home/DevisAndAbout";
import { HomeHero, type HeroStat } from "@/components/home/HomeHero";
import { ProductTabs } from "@/components/home/ProductTabs";
import { PromoSection } from "@/components/home/PromoSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { TrustSection } from "@/components/home/TrustSection";
import {
  HERO_BANNERS,
  HERO_STATS,
  RIBBON_ITEMS,
  SECTION,
  fillTemplate,
  statValue,
} from "@/data/home";
import { SITE } from "@/data/site";
import {
  categoryCounts,
  homeStats,
  listHeroShowcase,
  listNewArrivals,
  listPopularProducts,
  listPromoProducts,
} from "@/lib/product-store";

export const metadata: Metadata = {
  title: `${SITE.name} – Ordinateurs, composants & accessoires informatiques au Burkina Faso`,
  description:
    "Achetez ordinateurs portables, composants, SSD, périphériques, réseau et accessoires chez SERGI-TECH – Ouagadougou. Prix affichés, promos en cours, commande WhatsApp et paiement à la livraison.",
  alternates: { canonical: "/" },
};

/**
 * Le catalogue est resservi au plus toutes les 15 minutes, et immédiatement
 * après chaque modification depuis l'administration (`revalidateCatalog`).
 */
export const revalidate = 900;

/**
 * Page d'accueil : toutes les sections se remplissent depuis le catalogue.
 *
 * Aucun produit, aucun prix, aucune promotion et aucun compteur n'est écrit
 * ici. Mettre un article en avant, barer un prix ou créer une fiche dans
 * l'espace de gestion suffit à rafraîchir la page.
 */
export default async function HomePage() {
  const [promos, popular, arrivals, counts, stats, heroProducts] = await Promise.all([
    listPromoProducts(),
    listPopularProducts(8),
    listNewArrivals(8),
    categoryCounts(),
    homeStats(),
    listHeroShowcase(5),
  ]);

  // Chiffres réels injectés dans les accroches ({remise} et {promos}).
  const template = { remise: stats.bestDiscount, promos: stats.promos };
  const banners = HERO_BANNERS.map((banner) => ({
    ...banner,
    eyebrow: fillTemplate(banner.eyebrow, template),
    subtitle: fillTemplate(banner.subtitle, template),
  }));

  const heroStats: HeroStat[] = HERO_STATS.map((item) => ({
    label: item.label,
    value: item.value ?? (item.key ? statValue(item.key, stats) : "—"),
  }));

  /** Le carrousel du héro n'affiche que des produits illustrés. */
  const withPhoto = (products: typeof popular) =>
    products.filter((product) => product.images?.[0]).slice(0, 5);

  const showcases = {
    promos: heroProducts,
    populaires: withPhoto(popular),
  };

  const popularCopy = SECTION.popular;

  return (
    <>
      <HomeHero
        banners={banners}
        showcases={showcases}
        stats={heroStats}
        ribbon={RIBBON_ITEMS}
      />

      {/* 1. Promotions réellement applicables aujourd'hui */}
      <PromoSection promos={promos} />

      {/* 2. Catégories, comptage fait sur le catalogue */}
      <CategoryGrid counts={counts} />

      {/* 3. Populaires et nouveautés */}
      <section className="container py-12 md:py-16" aria-labelledby="section-populaires">
        <SectionHeader
          id="section-populaires"
          eyebrow={popularCopy.eyebrow}
          title={popularCopy.title}
          subtitle={popularCopy.subtitle}
          action={popularCopy.cta}
        />
        <ProductTabs popular={popular} arrivals={arrivals} />
      </section>

      {/* 4. Avantages et réassurance */}
      <TrustSection />

      {/* 5. Devis + à propos, chiffres du catalogue */}
      <DevisAndAbout stats={stats} />
    </>
  );
}
