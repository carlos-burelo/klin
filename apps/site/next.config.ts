import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio estático: HTML prerenderizado, despliegue en cualquier hosting.
  output: "export",
  // La lib se consume compilada (dist/); sin transpilePackages.
  // El paquete se enlaza al workspace: Turbopack necesita la raíz común.
  turbopack: { root: path.join(process.cwd(), "..", "..") },
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
