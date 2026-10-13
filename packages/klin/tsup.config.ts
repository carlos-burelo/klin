import { defineConfig } from "tsup";
import { deps } from "./tsup.deps";

// Núcleo servidor: puro, sin "use client".
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  outDir: "dist",
  external: [...deps, "./components/tooltip-portal"],
});
