import Link from "next/link";

/** Page 404 personnalisée. */
export default function NotFound() {
  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <p className="text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">Page introuvable</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        La page que vous cherchez n’existe pas ou a été déplacée. Explorez notre catalogue
        pour trouver votre prochain équipement.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Retour à l’accueil
        </Link>
        <Link
          href="/boutique"
          className="inline-flex h-11 items-center rounded-lg border bg-white px-6 text-sm font-semibold text-brand-navy hover:bg-slate-50"
        >
          Voir la boutique
        </Link>
      </div>
    </div>
  );
}
