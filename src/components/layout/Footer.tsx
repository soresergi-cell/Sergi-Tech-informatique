import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Truck,
  ShieldCheck,
  CreditCard,
  RotateCcw,
} from "lucide-react";
import { Logo } from "./Logo";
import { Socials } from "./Socials";
import { CATEGORIES } from "@/data/categories";
import { SITE } from "@/data/site";

/** Liens légaux (pages obligatoires). */
const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGV", href: "/cgv" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "FAQ", href: "/faq" },
];

/** Colonne de liens du pied de page. */
function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
      <div className="space-y-2.5 text-sm text-slate-400">{children}</div>
    </div>
  );
}

/** Pied de page complet : liens, contact, horaires, réseaux sociaux. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-navy text-slate-400">
      {/* Bandeau confiance */}
      <div className="border-b border-white/10">
        <div className="container grid grid-cols-2 gap-4 py-5 text-xs sm:text-sm lg:grid-cols-4">
          {[
            { icon: Truck, label: "Livraison locale", sub: "Ouagadougou sous 24-48 h" },
            { icon: CreditCard, label: "Paiement à la livraison", sub: "Ou espèces en boutique" },
            { icon: ShieldCheck, label: "Produits garantis", sub: "Jusqu'à 36 mois" },
            { icon: RotateCcw, label: "Assistance WhatsApp", sub: "Réponse rapide 7j/7" },
          ].map((t) => (
            <div key={t.label} className="flex items-start gap-2.5">
              <t.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-cyan" aria-hidden />
              <div>
                <p className="font-semibold text-white">{t.label}</p>
                <p className="text-[11px] text-slate-500">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colonnes */}
      <div className="container grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">
            SERGI-TECH est votre partenaire informatique au Burkina Faso : ordinateurs,
            composants, stockage, réseau et accessoires à prix compétitifs, avec un service
            client réactif sur WhatsApp.
          </p>
          <Socials className="mt-5" iconClassName="bg-white/10 text-slate-300 hover:bg-brand-cyan hover:text-white" />
        </div>

        <FooterColumn title="Boutique">
          <ul className="space-y-2.5">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/boutique?categorie=${c.slug}`} className="transition-colors hover:text-white">
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/promotions" className="font-semibold text-brand-orange transition-colors hover:text-white">
                Promotions
              </Link>
            </li>
          </ul>
        </FooterColumn>

        <FooterColumn title="Informations">
          <ul className="space-y-2.5">
            <li><Link href="/a-propos" className="transition-colors hover:text-white">À propos</Link></li>
            <li><Link href="/devis" className="transition-colors hover:text-white">Demande de devis</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
            <li>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 font-medium text-brand-cyan transition-colors hover:text-white"
              >
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Espace de gestion
              </Link>
            </li>
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="Contact & horaires">
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" aria-hidden />
              <span>
                {SITE.address.street}
                <br />
                {SITE.address.city}, {SITE.address.country}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-cyan" aria-hidden />
              <a href={`tel:${SITE.phoneHref}`} className="hover:text-white">{SITE.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-cyan" aria-hidden />
              <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" aria-hidden />
              <span className="space-y-0.5">
                {SITE.hours.map((h) => (
                  <span key={h.day} className="block">
                    {h.day} : <strong className="font-semibold text-slate-300">{h.time}</strong>
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </FooterColumn>
      </div>

      {/* Bas de page */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>© {year} {SITE.name} – Tous droits réservés.</p>
          <p className="flex items-center gap-4">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
