import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SITE } from "@/data/site";
import { organizationJsonLd, JsonLdScript } from "@/lib/seo";

/** Typographie : Inter (CDC §2.6). */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** Métadonnées globales (SEO technique – CDC §2.8). */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – Ordinateurs, composants & accessoires informatiques au Burkina Faso`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "SERGI-TECH",
    "informatique Burkina Faso",
    "vente ordinateur Ouagadougou",
    "composants PC",
    "SSD",
    "accessoires informatiques",
    "boutique informatique Ouagadougou",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} – Votre boutique informatique au Burkina Faso`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F172A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        {/* Lien d'évitement (accessibilité clavier) */}
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu principal
        </a>

        <SiteChrome>{children}</SiteChrome>

        {/* Données structurées organisation (SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JsonLdScript(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
