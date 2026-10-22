// Regla canónica de hover: la única fuente es `data-chart-tip`.
// Prohíbe `<title>` por forma (doble tooltip nativo) y attrs `title=` en
// elementos DOM. Solo sobreviven raíces accesibles (allowlist).
// Uso: `node scripts/check-titles.mjs` (corre en `pnpm lint`).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";

const src = fileURLToPath(new URL("../src/", import.meta.url));

// `<title>` elemento: prohibido en TODO src (ni formas ni raíces).
// El nombre accesible vive solo en `aria-label`; el hover, en `data-chart-tip`.

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      walk(p, out);
      continue;
    }
    if (/\.(tsx?)$/.test(p)) out.push(p);
  }
  return out;
}

let fails = 0;
for (const file of walk(src)) {
  const key = `src/${file.slice(src.length).replace(/\\/g, "/")}`;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    // Líneas de comentario/doc (`//`, `*`) no son código.
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
    // `<title>` elemento prohibido sin excepción.
    if (line.includes("<title")) {
      console.error(
        `${key}:${i + 1}: <title> por forma prohibido (usar data-chart-tip)`,
      );
      fails++;
    }
    // Attr `title=` en elementos DOM (minúscula). Props de componentes
    // (`<ChartEmpty title=`) no disparan nativo y están permitidas.
    // (Las líneas de comentario ya se saltaron arriba.)
    const m = line.match(/<([a-z][a-z0-9-]*)[^>]*\btitle=/);
    if (m) {
      console.error(
        `${key}:${i + 1}: attr title= en <${m[1]}> prohibido (usar data-chart-tip)`,
      );
      fails++;
    }
  });
}
if (fails > 0) {
  console.error(`\ncheck-titles: ${fails} violación(es)`);
  process.exit(1);
}
console.log("check-titles: OK");
