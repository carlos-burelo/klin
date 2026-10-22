// Fija imports relativos sin extensión en dist/ (tsc los emite tal cual y
// Node ESM exige extensión explícita). Idempotente: salta los que ya la
// tienen. Los .d.ts no se tocan (TS resuelve sin extensión).
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));

function fixFile(path) {
  const src = readFileSync(path, "utf8");
  const out = src.replace(
    /((?:from|import|export)\s+(?:[^'"]*?\sfrom\s+)?)(['"])(\.[^'"]+)\2/g,
    (m, head, q, spec) => {
      const base = spec.split("/").pop() ?? "";
      // Solo se considera extensión real al final (los puntos intermedios
      // como `box-plot.compute` son parte del nombre base, no extensión).
      if (/\.(?:js|mjs|cjs|json|css)$/.test(base)) return m;
      return `${head}${q}${spec}.js${q}`;
    },
  );
  if (out !== src) writeFileSync(path, out);
}

function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (p.endsWith(".js")) fixFile(p);
  }
}

walk(dist);
