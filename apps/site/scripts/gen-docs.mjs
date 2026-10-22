/** Genera src/content/docs/<slug>.mdx desde registry + demos + tipos de la lib. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const site = join(scriptDir, "..");
const root = join(site, "..", "..");

const registrySrc = readFileSync(
  join(site, "src", "demos", "registry.ts"),
  "utf8",
);

// entry("slug", "Título", "Sección", "Descripción", "fuente.tsx")
const entryRe =
  /entry\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"\s*,?\s*\)/g;

const entries = [];
for (const m of registrySrc.matchAll(entryRe)) {
  entries.push({
    slug: m[1],
    title: m[2],
    section: m[3],
    desc: m[4],
    source: m[5],
  });
}

function extractPropsType(componentSrc) {
  const re = /export type (\w*Props\w*) = \{/g;
  for (const match of componentSrc.matchAll(re)) {
    const name = match[1];
    const start = match.index + match[0].length;
    let i = start;
    let depth = 1;
    while (i < componentSrc.length && depth > 0) {
      if (componentSrc[i] === "{") depth++;
      else if (componentSrc[i] === "}") depth--;
      i++;
    }
    const body = componentSrc.slice(start, i - 1);
    // Preferir el primer Props que tenga ariaLabel o data/nodes (evita RootStyleProps).
    if (/ariaLabel|ariaDescribedBy|data|nodes|items|value/.test(body))
      return { name, body };
  }
  return null;
}

function parseFields(body) {
  const lines = body.split("\n");
  const out = [];
  let pendingDoc = "";
  let parenDepth = 0;
  for (const raw of lines) {
    const line = raw.trim();
    const docMatch = line.match(
      /^(?:\/\*\*\s*|\*\s*|\/\/\s*)(.+?)(?:\s*\*\/)?$/,
    );
    if (
      line.startsWith("/**") ||
      line.startsWith("*") ||
      line.startsWith("//")
    ) {
      const text = (docMatch?.[1] ?? "").trim();
      if (text && !/^\/\*+$/.test(text))
        pendingDoc = pendingDoc ? `${pendingDoc} ${text}` : text;
      continue;
    }
    if (!line) continue;
    // Solo vale el doc inmediatamente anterior al campo: cualquier otra
    // línea de código reinicia el pendiente (evita que el header de
    // licencia u otros bloques lejanos contaminen descripciones).
    if (/^export type \w+ = \{$/.test(line)) {
      pendingDoc = "";
      continue;
    }
    const opens = (line.match(/\(/g) || []).length;
    const closes = (line.match(/\)/g) || []).length;
    if (parenDepth > 0) {
      parenDepth += opens - closes;
      continue;
    }
    if (opens > closes) {
      parenDepth += opens - closes;
      pendingDoc = "";
      continue;
    }
    if (/^[{}]/.test(line) || line.startsWith("export ")) continue;
    // nombre?: tipo;  (tipo puede contener |, <>, [], Record, unions)
    const field = line.match(/^(\w+)(\?)?:\s*(.+?);?\s*$/);
    if (field) {
      const [, name, opt, type] = field;
      if (/=>$/.test(type.trim())) {
        pendingDoc = "";
        continue;
      }
      let t = type.trim().replace(/\s+/g, " ");
      if (t.length > 60) t = `${t.slice(0, 57)}…`;
      out.push({
        name,
        type: t,
        required: !opt,
        description: pendingDoc || "—",
      });
      pendingDoc = "";
    }
  }
  return out;
}

function componentImports(demoSrc) {
  const imp = demoSrc.match(
    /import\s*\{([^}]+)\}\s*from\s*"@carlos-burelo\/klin"/,
  );
  return imp
    ? imp[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", ")
    : "";
}

function escapeForMdxCode(src) {
  return src.replace(/```/g, "`\u200b``");
}

/** Descripciones canónicas para props universales (la lib rara vez las documenta por campo). */
const PROP_DOCS = {
  ariaLabel:
    "Etiqueta descriptiva del SVG (role=img). Describe la conclusión, no solo el tipo.",
  ariaDescribedBy:
    "Id de un texto largo que describe la gráfica (opcionales detalles).",
  data: "Filas de datos (records). Valores no-finitos se tratan como 0, nunca NaN en SVG.",
  xKey: "Clave de la categoría en el eje X.",
  yKey: "Clave del valor en el eje Y.",
  labelKey: "Clave de la etiqueta de cada parte.",
  valueKey: "Clave del valor numérico de cada parte.",
  series: "Series a dibujar (clave + etiqueta + color opcional).",
  nodes: "Nodos del diagrama (ids únicos, etiquetas).",
  edges: "Aristas entre nodos (origen, destino, etiqueta opcional).",
  items:
    "Elementos a renderizar (filas, columnas o tareas según el componente).",
  value: "Valor actual (0–100 en indicadores, numérico en medidores).",
  height: "Alto del SVG en px (ancho siempre fluido por viewBox).",
  width: "Ancho base de cómputo (el render escala por viewBox).",
  formatY: "Formateador del eje Y (por defecto es-MX).",
  formatX: "Formateador del eje X (por defecto es-MX).",
  formatValue: "Formateador del valor mostrado (por defecto es-MX).",
  locale: "Locale de formato (por defecto es-MX).",
  className: "Clase extra en el contenedor (aditivo, no rompe estilos).",
  style: "Estilos inline extra en el contenedor.",
  showLegend: "Muestra la leyenda HTML SSR (por defecto true donde aplica).",
  annotations:
    "Líneas o bandas de referencia SSR (valor + `to` opcional + etiqueta + color).",
  emptyTitle: "Título del estado vacío (por defecto EMPTY_TITLE).",
  emptyDescription: "Descripción del estado vacío.",
  itemColor: "Color por dato (token/var) o undefined para el de la serie.",
  barColor: "Color por barra (token/var) o undefined para el de la serie.",
  curve: "monotone (suave), linear (recta) o step (escalón).",
  stacked: "Apila las series en vez de superponerlas.",
  normalize: "Normaliza a 100 % (proporciones en vez de absolutos).",
  percentOf:
    "Base para el % mostrado (total, grupo, lado o inicio según el chart).",
  maxNodes: "Cap SSR de nodos (dedupa ids, ignora vacíos).",
  maxEdges: "Cap SSR de aristas.",
  maxRows: "Cap SSR de filas.",
  yScale: "Escala del eje Y (`linear` o `log` para magnitudes).",
  xScale: "Escala del eje X (`linear` o `log` para magnitudes).",
  connectNulls: "Une vecinos saltando nulos (por defecto los nulos van a 0).",
  binStrategy:
    "Estrategia de cubetas (`count`, `sturges`, `scott`, `freedman` o `width`).",
  showMedian: "Muestra la línea de la mediana.",
  showMean: "Muestra la línea de la media.",
  pointRadius: "Radio de punto (por defecto el token del tema).",
  showLegendValues: "La leyenda incluye el valor formateado.",
  innerRadius: "Radio interior (0 = pétalos desde el centro).",
  gridShape: "Forma de la retícula (`polygon` o `circle`).",
  trackColor: "Color de la pista de fondo.",
  startAngle: "Ángulo inicial en radianes.",
  zones: "Tramos de color ({ from, to, color }).",
  tickCount: "Marcas del medidor (por defecto fracciones fijas).",
  gap: "Separación entre filas o celdas en px.",
  minWidth: "Ancho mínimo de forma en px.",
  emptyColor: "Color de las celdas sobrantes.",
  subtotalAt: "Índices de pasos donde se pinta subtotal acumulado.",
  sortBy: "Orden (`label`, `value`, `total`, `start`, `date`… según el chart).",
  direction: "Dirección del layout (`TB`, `LR` o `RL` según el diagrama).",
  weekStart: "Inicio de semana (1 = lunes, 0 = domingo).",
  missingLabel: "Etiqueta de celda sin dato.",
  maxItems: "Cap de elementos (trunca determinista).",
  maxCards: "Máximo de tarjetas por columna (resto en `+N`).",
  showCounts: "Muestra contadores.",
  nodeWidth: "Ancho de nodo en px (por defecto automático).",
  nodeAlign: "Alineación de nodos (`justify`, `left`, `right` o `center`).",
  nodePadding: "Separación vertical entre nodos en px.",
  padAngle: "Separación angular entre grupos en radianes.",
  density: "Densidad de filas (`comfortable` o `compact`).",
  depth: "Profundidad máxima (poda determinista).",
  collapseDepth: "Profundidad de colapso inicial.",
  roleLegend: "Leyenda de roles con sus colores.",
  showDetails: "Muestra detalles.",
  showBadge: "Muestra insignias.",
  statusColors: "Override de color por estado o kind.",
  showEdgeLabels: "Muestra etiquetas de arista.",
  showSub: "Muestra subtítulos de nodo.",
  showDependencies: "Dibuja flechas de dependencia.",
  dependsOn: "Ids de tareas predecesoras.",
  showValues: "Etiqueta de valor sobre cada forma.",
  sortGroups: "Orden de grupos por total (`none`, `asc` o `desc`).",
  highlightMax: "Acento en el grupo con mayor total.",
  showDiff: "Rotula la diferencia entre extremos.",
  capWidth: "Ancho de remates de rango.",
  aColor: "Color del extremo inicial.",
  bColor: "Color del extremo final.",
  colorUp: "Color de pendientes positivas.",
  colorDown: "Color de pendientes negativas.",
  showDelta: "Muestra el delta en etiqueta y tip.",
  showPoints: "Muestra los puntos de datos.",
  order: "Orden de apilado (d3 stackOrder).",
  bullColor: "Color de vela alcista.",
  bearColor: "Color de vela bajista.",
  showLabels: "Muestra etiquetas.",
  xMin: "Mínimo fijo del dominio X.",
  xMax: "Máximo fijo del dominio X.",
  yMin: "Mínimo fijo del dominio Y.",
  yMax: "Máximo fijo del dominio Y.",
  bars: "Series de barras (agrupadas, eje Y izquierdo).",
  lines: "Series de línea (puntos en el centro de cada grupo).",
  yAxisRight: "Las líneas usan escala propia con ticks a la derecha.",
  cohorts: "Cohortes con retención por periodo (fracciones 0–1).",
  periodLabels: "Etiquetas de periodo (`P1`, `P2`… por defecto).",
  axes: "Dimensiones del paralelo (clave + etiqueta opcional).",
  rows: "Filas a dibujar (etiqueta + valor por dimensión).",
  jitter: "Dispersión horizontal 0–1 (0 = columna recta).",
  seed: "Semilla del jitter determinista.",
  bands: "Bandas de plegado por carril.",
  mode: "Modo de plegado (`mirror` pliega |v|, `offset` respeta el signo).",
  labels: "Etiquetas del eje X (por defecto el índice).",
  showCurve: "Curva de densidad KDE sobre las cubetas.",
  bandwidth: "Ancho de banda KDE (`auto` = Silverman).",
};

function docFor(name, fallback) {
  if (fallback && fallback !== "—") return fallback;
  return PROP_DOCS[name] ?? "—";
}

let generated = 0;
let skipped = 0;
const force = process.argv.includes("--force");
for (const e of entries) {
  const outDir = join(site, "src", "content", "docs");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${e.slug}.mdx`);
  // Sin --force no se tocan los MDX existentes (permiten edición manual).
  if (existsSync(outPath) && !force) {
    skipped++;
    continue;
  }
  const demoPath = join(site, "src", "demos", `${e.slug}.tsx`);
  const demoSrc = existsSync(demoPath) ? readFileSync(demoPath, "utf8") : "";
  // Los tipos viven en `<slug>.types.ts` desde la modularización (la vista
  // solo re-exporta); fallback a la vista para componentes sin partir.
  const typesPath = join(
    root,
    "packages",
    "klin",
    "src",
    "components",
    `${e.slug}.types.ts`,
  );
  const libPath = existsSync(typesPath)
    ? typesPath
    : join(root, "packages", "klin", "src", "components", e.source);
  const libSrc = existsSync(libPath) ? readFileSync(libPath, "utf8") : "";
  const propsType = libSrc ? extractPropsType(libSrc) : null;
  const fields = propsType ? parseFields(propsType.body) : [];
  const imports = componentImports(demoSrc);
  const mainComponent =
    imports
      .split(",")
      .map((s) => s.trim())
      .find((s) => s && !/Portal|Legend|Empty/.test(s)) ??
    imports.split(",")[0] ??
    "";

  const rows = fields
    .map((f) => {
      const desc = docFor(f.name, f.description);
      return `    { name: "${f.name}", type: "${f.type.replace(/"/g, "'")}", required: ${f.required}, description: "${desc.replace(/"/g, "'").slice(0, 160)}" },`;
    })
    .join("\n");

  const propsBlock =
    fields.length > 0
      ? `<PropsTable props={[\n${rows}\n]} />\n\n*Tipo completo: \`${propsType.name}\` en \`${e.source}\`.*`
      : `*Props: ver tipo en \`${e.source}\` ([fuente](${`https://github.com/carlos-burelo/klin/blob/main/packages/klin/src/components/${e.source}`})).*`;

  // Ejemplo mínimo: solo props requeridas, cada una en su línea.
  const requiredFields = fields.filter((f) => f.required);
  const requiredAttrs = requiredFields
    .map((f) =>
      f.name === "ariaLabel"
        ? `  ariaLabel="${e.title}"`
        : `  ${f.name}={/* … */}`,
    )
    .join("\n");
  const usePortal = /\bChartTooltipPortal\b/.test(imports);
  const wrapOpen = usePortal ? `<ChartTooltipPortal>\n` : "";
  const wrapClose = usePortal ? `\n</ChartTooltipPortal>` : "";

  const usage = mainComponent
    ? `\`\`\`tsx\nimport { ${imports} } from "@carlos-burelo/klin";\nimport "@carlos-burelo/klin/styles.css";\n\n${wrapOpen}<${mainComponent}\n${requiredAttrs}\n/>${wrapClose}\n\`\`\``
    : `\`\`\`tsx\nimport "@carlos-burelo/klin/styles.css";\n\`\`\``;

  const mdx = `import { LightbulbIcon } from "lucide-react";
import Demo from "../../demos/${e.slug}";
import Examples from "../../demos/examples/${e.slug}";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { DemoBlock } from "../../components/docs/demo-block";
import { PropsTable } from "../../components/docs/props-table";

## Vista previa

${e.desc} Demo completa con datos realistas, renderizada en el servidor. Más abajo están las configuraciones, una por una.

<DemoBlock>
  <Demo />
</DemoBlock>

## Ejemplos

Todas las configuraciones del componente, cada una viva y con datos propios. Cambia entre Preview y Code en cada tarjeta y copia lo que necesites.

<Examples />

## Uso

Ejemplo mínimo con las props requeridas. Copia, pega y cambia los datos:

${usage}

<Alert>
  <LightbulbIcon />
  <AlertTitle>SSR-first</AlertTitle>
  <AlertDescription>
    La gráfica es función pura de props a SVG: el HTML llega renderizado y sin JS se ve completa.
    Las demos vivas ya envuelven en \`ChartTooltipPortal\` para el tooltip rico (hover vía \`data-chart-tip\`; no se generan \`\\<title\\>\`).
    Lee la guía [/docs/ssr-first](/docs/ssr-first) una vez y listo.
  </AlertDescription>
</Alert>

## Código de esta demo

<details>
<summary>Ver fuente (\`src/demos/${e.slug}.tsx\`)</summary>

\`\`\`tsx
${escapeForMdxCode(demoSrc.trim())}
\`\`\`

</details>

## Props

${propsBlock}

## Accesibilidad

- Toda gráfica exige \`ariaLabel\` descriptivo; el SVG usa \`role="img"\` con \`aria-label\` (única fuente de nombre, sin \`\\<title\\>\`).
- Cada forma con hover lleva \`data-chart-tip\` para el portal rico (las demos lo envuelven por defecto).
- Sin datos se renderiza estado vacío homogéneo (\`ChartEmpty\`), nunca SVG roto.
- Detalle del contrato en [/docs/accesibilidad](/docs/accesibilidad).

## Recursos

- Fuente del componente: [\`${e.source}\`](https://github.com/carlos-burelo/klin/blob/main/packages/klin/src/components/${e.source})
- Guías: [SSR-first](/docs/ssr-first) · [Tema](/docs/tema) · [Tooltip](/docs/tooltip)
`;

  writeFileSync(outPath, mdx);
  generated++;
}

// load-doc.ts se genera siempre (registry = única fuente; sin fallback mudo).
const loadDoc = `/** Carga perezosa del MDX por slug (GENERADO por scripts/gen-docs.mjs: no editar). */
export function loadDoc(
  slug: string,
): Promise<{ default: React.ComponentType }> {
  switch (slug) {
${entries.map((e) => `    case "${e.slug}":\n      return import("./docs/${e.slug}.mdx");`).join("\n")}
    default:
      throw new Error(\`doc desconocida (falta en registry): \${slug}\`);
  }
}
`;
writeFileSync(join(site, "src", "content", "load-doc.ts"), loadDoc);

console.log(`MDX generados: ${generated}, omitidos: ${skipped}`);
