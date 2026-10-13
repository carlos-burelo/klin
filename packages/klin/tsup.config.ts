import { readdirSync } from "node:fs";
import { defineConfig } from "tsup";
import { deps } from "./tsup.deps";

// Un entry por componente: `@carlos-burelo/klin/<archivo>` (sin extensión).
// El barril (index) reexporta; el splitting deja el código compartido en
// chunks y cada entry queda delgado. El portal cliente va en build aparte
// (tsup.client.ts) para no contaminar chunks con "use client".
const entry: Record<string, string> = { index: "src/index.ts" };
for (const f of readdirSync("src/components")) {
  // tooltip-portal va en build aparte (tsup.client.ts): su "use client"
  // no puede compartir chunks con el núcleo servidor.
  if (f.endsWith(".tsx") && f !== "tooltip-portal.tsx")
    entry[f.slice(0, -".tsx".length)] = `src/components/${f}`;
}

// Núcleo servidor: puro, sin "use client".
export default defineConfig({
  entry,
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  outDir: "dist",
  external: [...deps, "./components/tooltip-portal"],
});
