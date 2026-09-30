import type { NextConfig } from "next";

/**
 * Configuration Next.js – SERGI-TECH
 * - Images servies en WebP/AVIF pour les connexions mobiles lentes (CDC §5)
 * - SVG autorisé uniquement pour les illustrations locales de secours
 */
const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  reactStrictMode: true,

  /** Alias pratiques : l'espace de gestion est rédigé en français. */
  async redirects() {
    return [
      { source: "/admin/login", destination: "/admin/connexion", permanent: false },
      { source: "/admin/signin", destination: "/admin/connexion", permanent: false },
    ];
  },

  /**
   * Sert les photos téléversées après le démarrage du serveur.
   * Les réécritures `afterFiles` interviennent APRÈS la vérification de
   * `public/` : un fichier déjà publié reste servi en statique, un fichier
   * ajouté en cours d'exécution est lu par /api/images sans redémarrage.
   */
  async rewrites() {
    return {
      afterFiles: [
        { source: "/products/:path*", destination: "/api/images/:path*" },
      ],
    };
  },
};

export default nextConfig;
