import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio estático: HTML prerenderizado, despliegue en cualquier hosting.
  output: "export",
  // La lib se consume como TypeScript fuente (source-first).
  transpilePackages: ["@carlos-burelo/klin"],
  // El paquete se enlaza al workspace: Turbopack necesita la raíz común.
  turbopack: { root: path.join(process.cwd(), "..", "..") },
};

export default nextConfig;
