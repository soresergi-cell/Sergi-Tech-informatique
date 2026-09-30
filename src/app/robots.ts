import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

/** Robots.txt (CDC §2.8). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/panier"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
