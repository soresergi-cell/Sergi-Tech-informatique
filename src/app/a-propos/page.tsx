import type { Metadata } from "next";
import Link from "next/link";
import { Target, HeartHandshake, Zap, ShieldCheck, Users, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "À propos – Qui sommes-nous ?",
  description:
    "SERGI-TECH, entreprise burkinabè spécialisée dans la vente de produits informatiques : notre histoire, nos valeurs et notre engagement clients.",
  alternates: { canonical: "/a-propos" },
};

const VALUES = [
  { icon: ShieldCheck, title: "Fiabilité", text: "Des produits neufs, garantis et vérifiés avant chaque livraison." },
  { icon: Zap, title: "Réactivité", text: "Une équipe joignable sur WhatsApp, des réponses rapides et concrètes." },
  { icon: HeartHandshake, title: "Proximité", text: "Une boutique physique à Ouagadougou et un service de livraison local." },
  { icon: Target, title: "Transparence", text: "Des prix affichés clairement, sans surprise au moment de la commande." },
];

/** Page « À propos » (page obligatoire – CDC §2.5). */
export default function AProposPage() {
  return (
    <div>
      {/* En-tête */}
      <section className="bg-brand-navy py-14 text-white md:py-20">
        <div className="container max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-cyan">
            À propos de nous
          </p>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            SERGI-TECH, votre partenaire informatique au Burkina Faso
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            Spécialisée dans la commercialisation de produits informatiques neufs –
            ordinateurs, composants, périphériques, stockage, réseau et accessoires –
            SERGI-TECH accompagne particuliers, étudiants, professionnels et institutions
            avec un catalogue fiable et un service client de proximité.
          </p>
        </div>
      </section>

      {/* Histoire + mission */}
      <section className="container grid gap-8 py-12 md:grid-cols-2 md:py-16">
        <Reveal>
          <div>
            <h2 className="section-title">Notre histoire</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                Née d’une boutique physique à Ouagadougou, SERGI-TECH s’est imposée comme un
                interlocuteur de confiance pour l’équipement informatique au Burkina Faso.
                Aujourd’hui, l’entreprise étend son rayonnement en ligne pour permettre à
                chacun de découvrir le catalogue, comparer les prix et commander 24 h/24.
              </p>
              <p>
                Notre force : allier la disponibilité immédiate d’une boutique de proximité et
                la commodité du numérique, avec WhatsApp comme fil directeur des échanges.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: "7", l: "catégories" },
                { v: "19+", l: "références en ligne" },
                { v: "24 h", l: "délai de réponse" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-extrabold text-primary">{s.v}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="h-full rounded-2xl border bg-slate-50 p-6">
            <h3 className="mb-4 text-lg font-bold text-brand-navy">Notre mission</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Rendre l’équipement informatique accessible, fiable et simple à acheter au
              Burkina Faso : un catalogue transparent, des conseils honnêtes et un parcours de
              commande en quelques clics.
            </p>
            <h3 className="mb-3 mt-6 text-lg font-bold text-brand-navy">Nos publics</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                Particuliers et étudiants à la recherche du bon rapport qualité-prix.
              </li>
              <li className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                Professionnels, TPE et entreprises équipant leurs bureaux.
              </li>
              <li className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                Institutions et ONG pour leurs marchés d’équipement.
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                Clients à distance, partout au Burkina Faso et à l’international.
              </li>
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Valeurs */}
      <section className="bg-slate-50 py-12 md:py-16">
        <div className="container">
          <Reveal>
            <h2 className="section-title">Nos valeurs</h2>
            <p className="section-subtitle">Ce qui guide chacune de nos interactions.</p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.07}>
                <div className="h-full rounded-xl border bg-white p-5 shadow-sm">
                  <v.icon className="mb-3 h-6 w-6 text-primary" aria-hidden />
                  <h3 className="font-semibold text-brand-navy">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-12 text-center md:py-16">
        <h2 className="text-2xl font-extrabold text-brand-navy sm:text-3xl">
          Prêt à équiper votre poste ?
        </h2>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/boutique">
              Voir la boutique <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/devis">Demander un devis</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {SITE.address.street} – {SITE.address.city}
        </p>
      </section>
    </div>
  );
}
