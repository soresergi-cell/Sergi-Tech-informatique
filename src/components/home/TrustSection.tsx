import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { HOME_ICONS } from "./icons";
import { SECTION, TRUST_ITEMS } from "@/data/home";
import { SITE } from "@/data/site";
import { waLink } from "@/lib/whatsapp";

/**
 * Section « confiance » : les quatre engagements de SERGI-TECH, pilotés par
 * `src/data/home.ts`, complétés d'une interpellation WhatsApp.
 */
export function TrustSection() {
  const copy = SECTION.trust;

  return (
    <section
      className="container border-t border-slate-200/70 py-12 md:py-16"
      aria-labelledby="section-avantages"
    >
      <SectionHeader
        id="section-avantages"
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_ITEMS.map((item, index) => {
          const Icon = HOME_ICONS[item.icon];

          return (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className="flex h-full flex-col rounded-2xl border bg-white p-5 shadow-soft transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>

                <h3 className="text-[15px] font-bold text-brand-navy">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>

                <span className="mt-auto pt-4">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {item.note}
                  </span>
                  {item.href && item.ctaLabel && (
                    <Link
                      href={item.href}
                      className="mt-1 inline-block text-sm font-semibold text-primary hover:underline"
                    >
                      {item.ctaLabel} →
                    </Link>
                  )}
                </span>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Interpellation WhatsApp / téléphone */}
      <Reveal delay={0.1}>
        <div className="mt-6 flex flex-col items-start gap-5 rounded-2xl bg-brand-navy p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h3 className="text-lg font-extrabold sm:text-xl">
              Un doute sur le choix du matériel ? Posez la question.
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
              Compatibilité, usage, budget, installation : un conseiller vous répond du lundi au
              samedi, en boutique comme sur WhatsApp ({SITE.phone}).
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" variant="whatsapp">
              <a
                href={waLink(
                  `Bonjour ${SITE.name} ! J'aurais besoin d'un conseil pour choisir un matériel informatique.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Discuter sur WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${SITE.phoneHref}`}>Appeler la boutique</a>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
