import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { CheckCircle2, Building2, Clock, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Demande de devis – Offres pour professionnels",
  description:
    "Demandez un devis SERGI-TECH pour vos achats informatiques en quantité : entreprises, institutions et ONG. Réponse sous 24 h ouvrées.",
  alternates: { canonical: "/devis" },
};

/** Page demande de devis (EF-10 / US-07). */
export default function DevisPage() {
  return (
    <div className="bg-slate-50">
      <div className="container py-10 md:py-14">
        {/* En-tête */}
        <header className="mb-8 max-w-2xl">
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            Demande de devis professionnel
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Équipement de bureau, parc informatique, marché d’institution ou achat en quantité :
            décrivez votre besoin et recevez une offre personnalisée avec facture conforme.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <QuoteForm />

          {/* Encart bénéfices */}
          <aside className="space-y-4">
            <div className="rounded-2xl bg-brand-navy p-5 text-white">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-cyan">
                Pourquoi nous ?
              </h2>
              <ul className="space-y-4 text-sm">
                {[
                  { icon: Clock, t: "Réponse sous 24 h", s: "Proposition détaillée et chiffrée." },
                  { icon: Building2, t: "Facture conforme", s: "Documents administratifs fournis." },
                  { icon: Users, t: "Conseil dédié", s: "Un interlocuteur unique pour votre dossier." },
                  { icon: CheckCircle2, t: "Tarifs dégressifs", s: "Remises selon les volumes commandés." },
                ].map((b) => (
                  <li key={b.t} className="flex items-start gap-3">
                    <b.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" aria-hidden />
                    <span>
                      <strong className="block font-semibold text-white">{b.t}</strong>
                      <span className="text-slate-400">{b.s}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border bg-white p-5 text-sm text-slate-600">
              <p className="font-semibold text-brand-navy">Besoin d’un conseil rapide ?</p>
              <p className="mt-1">
                Contactez directement notre équipe sur WhatsApp, nous vous orientons vers la
                meilleure solution.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
