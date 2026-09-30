import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Navigation } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Socials } from "@/components/layout/Socials";
import { SITE } from "@/data/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact – Boutique & horaires",
  description:
    "Contactez SERGI-TECH : adresse de la boutique à Ouagadougou, téléphone, WhatsApp, horaires d'ouverture et formulaire de contact.",
  alternates: { canonical: "/contact" },
};

/** URL d'intégration Google Maps (sans clé API). */
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed`;

/** Page Contact : formulaire + carte Google Maps + horaires (EF-11, EF-12). */
export default function ContactPage() {
  return (
    <div className="container py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Contactez-nous
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Une question, un suivi de commande ou un besoin de conseil ? Notre équipe vous
          répond rapidement par WhatsApp, par e-mail ou en boutique.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Colonne gauche : coordonnées + carte */}
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: Phone,
                label: "Téléphone",
                value: SITE.phone,
                href: `tel:${SITE.phoneHref}`,
              },
              { icon: Mail, label: "E-mail", value: SITE.email, href: `mailto:${SITE.email}` },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group rounded-xl border bg-white p-4 transition-shadow hover:shadow-md"
              >
                <c.icon className="mb-2 h-5 w-5 text-primary" aria-hidden />
                <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                <p className="text-sm font-semibold text-brand-navy group-hover:text-primary">
                  {c.value}
                </p>
              </a>
            ))}

            {/* Adresse */}
            <div className="rounded-xl border bg-white p-4 sm:col-span-2">
              <MapPin className="mb-2 h-5 w-5 text-primary" aria-hidden />
              <p className="text-xs font-medium text-muted-foreground">Adresse de la boutique</p>
              <p className="text-sm font-semibold text-brand-navy">
                {SITE.address.street}, {SITE.address.city}, {SITE.address.country}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-4 w-4" aria-hidden />
                  Itinéraire
                </a>
              </Button>
            </div>
          </div>

          {/* Google Maps intégré (EF-11) */}
          <div className="overflow-hidden rounded-xl border">
            <iframe
              src={MAP_SRC}
              title="Localisation de la boutique SERGI-TECH sur Google Maps"
              className="h-72 w-full border-0 sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {/* Horaires (EF-12) */}
          <div className="rounded-xl border bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-brand-navy">
              <Clock className="h-5 w-5 text-primary" aria-hidden />
              Horaires d’ouverture
            </h2>
            <ul className="divide-y text-sm">
              {SITE.hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between py-2.5">
                  <span className="text-slate-600">{h.day}</span>
                  <span
                    className={`font-semibold ${
                      h.time === "Fermé" ? "text-slate-400" : "text-brand-navy"
                    }`}
                  >
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3">
              <span className="text-sm text-slate-600">Suivez-nous</span>
              <Socials />
            </div>
          </div>
        </div>

        {/* Colonne droite : formulaire */}
        <div className="rounded-2xl border bg-white p-5 sm:p-7">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">Envoyez-nous un message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
