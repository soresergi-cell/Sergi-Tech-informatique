import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Clock, FileText } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/button";
import { ABOUT_FIGURES, SECTION, statValue } from "@/data/home";
import { SITE } from "@/data/site";
import type { HomeStats } from "@/lib/product-store";

/**
 * Bandeau « demande de devis » (EF-10 / US-07) + teaser À propos.
 * Les chiffres du teaser sont calculés depuis le catalogue, plus codés en dur.
 */
export function DevisAndAbout({ stats }: { stats: HomeStats }) {
  return (
    <section className="bg-slate-50 py-12 md:py-16">
      <div className="container grid gap-6 lg:grid-cols-2">
        {/* Devis */}
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-2xl bg-brand-navy p-6 text-white shadow-lift sm:p-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-cyan">
                {SECTION.devis.eyebrow}
              </span>
              <span className="mb-4 mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cyan/20 text-brand-cyan">
                <FileText className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                {SECTION.devis.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {SECTION.devis.subtitle}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-brand-cyan" aria-hidden />
                  Réponse sous 24 h ouvrées
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-brand-cyan" aria-hidden />
                  Tarifs dégressifs selon les volumes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-cyan" aria-hidden />
                  Facture conforme et accompagnement à la configuration
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <Button
                asChild
                size="lg"
                className="w-full bg-brand-orange text-white hover:bg-brand-orange/90 sm:w-auto"
              >
                <Link href="/devis">
                  Demander un devis <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>

        {/* À propos */}
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between rounded-2xl border bg-white p-6 shadow-soft sm:p-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                {SECTION.about.eyebrow}
              </span>
              <span className="mb-4 mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-brand-navy sm:text-2xl">
                {SECTION.about.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {SECTION.about.subtitle} Nous vous conseillons comme en boutique, avec le souci du
                matériel qui dure.
              </p>

              <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
                {ABOUT_FIGURES.map((figure) => (
                  <div key={figure.key} className="rounded-xl bg-slate-50 py-3">
                    <dd className="text-lg font-extrabold tabular-nums text-primary">
                      {statValue(figure.key, stats)}
                    </dd>
                    <dt className="mt-0.5 text-[11px] text-muted-foreground">{figure.label}</dt>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/a-propos">En savoir plus</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/contact">Nous contacter</Link>
              </Button>
              <span className="self-center text-xs text-muted-foreground">{SITE.tagline}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
