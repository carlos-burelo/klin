import type { MetadataRoute } from "next";
import { DEMOS } from "../demos/registry";
import { GUIDES } from "../guias/guides";

export const dynamic = "force-static";

/** Sitemap estático: home + docs (componentes y conceptos, todo prerenderizado). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://carlos-burelo.github.io/klin";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/docs/overview`, lastModified: new Date() },
    ...DEMOS.map((d) => ({
      url: `${base}/docs/${d.slug}`,
      lastModified: new Date(),
    })),
    ...GUIDES.map((g) => ({
      url: `${base}/docs/${g.slug}`,
      lastModified: new Date(),
    })),
  ];
}
