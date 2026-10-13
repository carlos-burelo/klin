import { defineConfig } from "tsup";
import { deps } from "./tsup.deps";

// Único módulo cliente. esbuild elimina las directivas al empaquetar, así que
// sale sin sourcemap y scripts/postbuild.mjs antepone "use client" después.
export default defineConfig({
  entry: { "components/tooltip-portal": "src/components/tooltip-portal.tsx" },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  clean: false,
  treeshake: true,
  minify: false,
  outDir: "dist",
  external: deps,
});
