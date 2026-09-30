import type { Metadata } from "next";
import Link from "next/link";

/** Conteneur commun des pages légales (typographie longue). */
export function LegalContainer({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-3xl py-10 md:py-14">
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">Dernière mise à jour : {updated}</p>
      <article className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-brand-navy [&_li]:mb-1.5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </article>

      <nav className="mt-10 flex flex-wrap gap-4 border-t pt-6 text-sm text-primary">
        <Link href="/mentions-legales" className="hover:underline">Mentions légales</Link>
        <Link href="/cgv" className="hover:underline">CGV</Link>
        <Link href="/confidentialite" className="hover:underline">Politique de confidentialité</Link>
        <Link href="/faq" className="hover:underline">FAQ</Link>
      </nav>
    </div>
  );
}

/** Métadonnées partagées des pages légales. */
export function legalMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
  };
}
