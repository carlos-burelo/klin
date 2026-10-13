import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** Robots: todo indexable, sitemap absoluto. */
export default function robots(): MetadataRoute.Robots {
  const base = "https://carlos-burelo.github.io/klin";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
