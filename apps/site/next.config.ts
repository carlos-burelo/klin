import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// La lib se consume desde src (sin build previo): HMR directo en dev y
// mismo código en `next build`. dist/ solo existe para el publish en npm.
const klinSrc = path.resolve(
  process.cwd(),
  "..",
  "..",
  "packages",
  "klin",
  "src",
);
// Relativa POSIX: Turbopack no resuelve alias con ruta absoluta Windows.
const klinSrcRel = path
  .relative(process.cwd(), klinSrc)
  .split(path.sep)
  .join(path.posix.sep);

const nextConfig: NextConfig = {
  // Sitio estático: HTML prerenderizado, despliegue en cualquier hosting.
  output: "export",
  transpilePackages: ["@carlos-burelo/klin"],
  turbopack: {
    root: path.join(process.cwd(), "..", ".."),
    resolveAlias: {
      "@carlos-burelo/klin": `${klinSrcRel}/index.ts`,
    },
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    // Directorio: cubre el root (index.ts) y subpaths (core/*, etc.).
    config.resolve.alias["@carlos-burelo/klin"] = klinSrc;
    return config;
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        {
          // Doble tema: las clases .dark del site conmutan los tokens.
          theme: { light: "github-light", dark: "github-dark" },
          // El fondo lo pone nuestro Pre (bg-card); shiki solo colorea tokens.
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
