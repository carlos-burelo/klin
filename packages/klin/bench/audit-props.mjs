// Matriz de opciones por chart: extrae props de cada <slug>.types.ts
// y marca presencia de opciones canónicas. Uso: node bench/audit-props.mjs
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../src/components/", import.meta.url);
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".types.ts"))
  .sort();

// Opción canónica -> regex sobre el cuerpo del archivo de tipos.
const CHECKS = {
  format: /format[A-Z]?\??\s*:|ValueFormatter/,
  locale: /locale\?:/,
  legend: /showLegend|legend/i,
  empty: /emptyTitle/,
  describedBy: /ariaDescribedBy/,
  classStyle: /className\?:/,
  annot: /annotations\?:/,
  ticks: /gridTicks|ticks\?:/,
  height: /height\?:/,
  sort: /sort[A-Z]\w*\?:|sortGroups|sortBy/,
  values: /showValues|showValue/,
  colors: /color\??:|palette|scheme/i,
  id: /\bid\?:/,
  localeFmt: /locale\?:/,
};

const rows = [];
for (const f of files) {
  const src = readFileSync(new URL(f, dir), "utf8");
  const slug = f.replace(".types.ts", "");
  const row = { chart: slug };
  for (const [k, re] of Object.entries(CHECKS))
    row[k] = re.test(src) ? "✓" : "·";
  rows.push(row);
}

const cols = ["chart", ...Object.keys(CHECKS)];
console.log(cols.join(","));
for (const r of rows) console.log(cols.map((c) => r[c]).join(","));
const missing = rows.filter((r) =>
  Object.keys(CHECKS).some((k) => r[k] === "·"),
).length;
console.log(`\ncharts: ${rows.length}, con huecos: ${missing}`);
