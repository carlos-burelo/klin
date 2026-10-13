# @carlos-burelo/klin

Gráficas SSR-first: **d3 para cálculo, SVG puro para render**.
Sin `recharts`, sin `ResponsiveContainer`, sin `"use client"` en el núcleo.

## Principios

- **SSR-first.** Cada gráfica es un Server Component: función pura de `props → SVG`.
  El HTML llega renderizado; sin JS la gráfica se ve completa.
- **d3 solo para math.** `d3-scale`, `d3-shape`, `d3-array`, `d3-format`,
  `d3-hierarchy`. Nada de `d3-selection` ni medición del DOM (`ResizeObserver`,
  `ResponsiveContainer`). Responsivo con `viewBox` + `w-full h-auto`.
- **Tooltip portal mínimo.** El núcleo no tiene JS. Quien quiera tooltip rico envuelve
  en `<ChartTooltipPortal>` (único `"use client"` del paquete): delegación de
  `mouseover` sobre `[data-chart-tip]` + `createPortal` a `document.body` con Tailwind.
  Nativo `<title>` siempre presente para accesibilidad y táctil.
- **Tema.** Colores por defecto `var(--chart-1…5)`; se puede pasar cualquier token
  (`var(--primary)`, `var(--muted-foreground)`…). Sin hex sueltos.
- **A11y.** `role="img"`, `aria-label`, `<title>` por forma.

## Uso

```css
/* globals.css */
@import "@carlos-burelo/klin/styles.css";
```

```tsx
import { BarChart, ChartLegend, ChartTooltipPortal } from "@carlos-burelo/klin";

// Corte exacto por componente (mismo export, mejor split):
import { BarChart } from "@carlos-burelo/klin/bar-chart";
import type { BarChartProps } from "@carlos-burelo/klin/bar-chart";

<ChartTooltipPortal>
  <BarChart
    ariaLabel="Planeaciones por estado"
    data={[{ estado: "Completa", n: 12 }]}
    xKey="estado"
    series={[{ key: "n", label: "Planeaciones" }]}
  />
</ChartTooltipPortal>
```

Cada archivo de `src/components/<nombre>.tsx` es un subpath
(`@carlos-burelo/klin/<nombre>`, con tipos). El barril raíz reexporta
todo; el código compartido vive en chunks internos.

## Sitio (demos y página, mismo repo, fuera del bundle)

`apps/site/` prerenderiza las 80 demos a HTML estático (`apps/site/out/`):
`pnpm site:build` (desde la raíz), previsualiza con `pnpm site:dev` (`:3100`). El tarball no lo
incluye (`files` solo lleva `dist` + raíz; verificado con `pnpm pack --dry-run`).
Detalle en `apps/site/README.md`.

## Componentes

| Componente | Para qué |
|---|---|
| `BarChart` | Barras verticales, una o agrupadas (`series[]`, `barColor` por barra) |
| `HorizontalBarChart` | Barras horizontales agrupadas (altura automática) |
| `StackedBar` | Barras horizontales apiladas (progreso: N segmentos, % al final) |
| `VerticalStackedBar` | Barras verticales apiladas (con modo `normalize` 100 %) |
| `DonutChart` | Dona con total al centro |
| `PieChart` | Torta (dona sin agujero) |
| `LineChart` | Líneas con puntos (categorías o secuencia) |
| `AreaChart` | Áreas superpuestas o `stacked` |
| `RadialProgress` | Anillo 0–100 % para avances e indicadores |
| `ProgressList` | Medidores lineales con valor tabular |
| `ScatterPlot` | Dispersión XY |
| `Histogram` | Distribución con `d3.bin` |
| `RadarChart` | Telaraña multivariada |
| `FunnelChart` | Embudo de conversión por etapas |
| `MatrixHeatmap` | Calor filas × columnas |
| `Sparkline` | Minigráfica para tablas y KPIs |
| `BoxPlot` | Cajas y bigotes (min, Q1, mediana, Q3, max, atípicos) |
| `WaterfallChart` | Cascada por deltas con total |
| `PyramidChart` | Pirámide espejada (dos series) |
| `CalendarHeatmap` | Calor de calendario estilo contribuciones |
| `GanttChart` | Tareas en el tiempo con % de avance |
| `TreemapChart` | Mapa rectangular por área y jerarquía |
| `FlowChart` | Flujo (inicio/fin, proceso, decisión) |
| `StateDiagram` | Máquina de estados (inicial, estados, final) |
| `ErDiagram` | Entidad-relación (atributos + cardinalidad) |
| `ClassDiagram` | Clases UML (herencia, asociación, composición) |
| `UseCaseDiagram` | Actores + elipses + include/extend |
| `SequenceDiagram` | Secuencia (participantes y mensajes) |
| `MindmapDiagram` | Mapa mental (árbol horizontal) |
| `QuadrantChart` | Cuadrantes 2×2 con puntos |
| `TimelineChart` | Hitos alternados sobre un eje |
| `KanbanBoard` | Tablero HTML (columnas + WIP) |
| `ArchitectureDiagram` | Servicios, bases, colas, actores, externos |
| `VennDiagram` | Venn de 2 o 3 conjuntos |
| `WardleyMap` | Cadena de valor vs. evolución |
| `NetworkGraph` | Red con fuerzas deterministas (semilla) |
| `NetworkTopology` | Topología por roles (glifos + estado de enlace) |
| `SankeyDiagram` | Flujos ponderados (`d3-sankey`) |
| `BulletChart` | Valor vs. meta sobre bandas |
| `GaugeChart` | Velocímetro 0–100 con marcas |
| `ParetoChart` | Barras ordenadas + % acumulado |
| `DivergingBar` | Barras divergentes (encuestas) |
| `SunburstChart` | Jerarquía en anillos (`d3.partition`) |
| `OrgChart` | Organigrama vertical |
| `WaffleChart` | 100 cuadros para partes |
| `ComboChart` | Barras y líneas con doble eje opcional |
| `CohortChart` | Retención triangular por cohorte |
| `ParallelCoordinates` | Multivariado con ejes normalizados |
| `StripPlot` | Puntos 1D con jitter determinista |
| `HorizonChart` | Series densas plegadas en bandas |
| `ECDFChart` | Distribución acumulada en escalones |
| `LollipopChart` | Puntos sobre palos con valor |
| `Streamgraph` | Capas con desplazamiento central |
| `ArcDiagram` | Relaciones sobre un eje |
| `CandlestickChart` | Velas OHLC (mecha + cuerpo alcista/bajista) |
| `DumbbellChart` | Dos puntos conectados por categoría |
| `RangeChart` | Intervalos low–high con valor |
| `ViolinPlot` | Distribución con KDE por grupo |
| `RidgelinePlot` | Densidades apiladas con solape |
| `BeeswarmPlot` | Puntos sin solape (fuerza determinista) |
| `BumpChart` | Rankings por periodo |
| `SlopeChart` | Cambios entre dos instantes |
| `DendrogramChart` | Árbol cluster (`d3.cluster`) |
| `IcicleChart` | Partición rectangular (`d3.partition`) |
| `CirclePackChart` | Jerarquía en burbujas (`d3.pack`) |
| `NightingaleChart` | Rosa polar de proporciones |
| `RadialBarChart` | Barras concéntricas 0–100 |
| `MarimekkoChart` | Ancho y alto en porcentaje |
| `TernaryPlot` | Dispersión triangular de composiciones |
| `DotPlot` | Puntos ordenados estilo Cleveland |
| `IsotypeChart` | Pictogramas repetidos por valor |
| `FishboneDiagram` | Espina causa-efecto |
| `TableChart` | Tabla HTML con barras inline |
| `TreeView` | Árbol jerárquico colapsable (HTML) |
| `ChordDiagram` | Ribbons entre grupos (`d3-chord`) |
| `DensityContourPlot` | Isolíneas sobre dispersión (`d3-contour`) |
| `HexbinPlot` | Agregación hexagonal (`d3-hexbin`) |
| `ChartLegend` | Leyenda HTML |
| `ChartEmpty` | Estado vacío homogéneo |
| `ChartTooltipPortal` | Único cliente: tooltip por portal (mínimo JS) |

Paleta: `CHART_PALETTE` (`--chart-1…5`). Formato por defecto `es-MX`
(`formatDefault(v, locale?, opts?)`, no-finitos → `"—"`).
Helpers: `seriesColors(series)`, `truncateLabel`, `toNumber`, `domainWithZero`,
`topPositive`, `stableKey`, `layoutDag` (dedupa ids, ignora vacíos,
`maxNodes`/`maxEdges`), `EdgeLabel` (trunca a 24).
Vacío único: `EMPTY_TITLE`. Formateadores tipados `ValueFormatter`.
Caps centralizados `DEFAULT_MAX_NODES/LINKS/LEAVES/ROWS` (`src/lib/limits.ts`).
Serie única `ChartSeries`.
Universal aditivo: `className`/`style`, `ariaDescribedBy?`, `locale?` (`es-MX`),
`showLegend?`, `annotations?` (línea de referencia SSR), `itemColor?` por dato.
Cada componente exporta su `XProps` (`import type { BarChartProps } from "@carlos-burelo/klin"`).
Diagramas pesados exponen su cómputo puro (`computeNetworkPositions`,
`computeSankeyLayout`, `computeTreemapLayout`, …) con caps SSR
(400 nodos / 800 edges-hojas).

## Línea de estilo (obligatoria)

Toda gráfica nueva sigue esta spec para que el set se vea uno solo:

- **Geometría**: barras/buckets/celdas/columnas con `rx=4`; pistas tipo píldora
  (`rounded-full` o recorte); puntos `r=3.5` con borde `var(--background)` de `1.5`
  (dispersión `r=4.5`, radar `r=3`); líneas `2px round`; grid `var(--border)` de `1`.
- **Texto**: ejes y ticks `11px var(--muted-foreground)`; valores destacados
  `tabular-nums` (`font-mono` en HTML); leyenda `text-xs` vía `ChartLegend`.
- **Color**: solo tokens (`CHART_TOKEN` en `src/lib/theme.ts`, nunca `var(--*)`
  suelto ni hex). Serie N → `seriesColor(N, override)`, fallback `CHART_TOKEN.chart1`.
- **Sin mágicos**: ni un número ni token suelto en componentes. Geometría en
  `src/lib/theme.ts` (`BAR_RADIUS`, `LINE_WIDTH`, `POINT_RADIUS`, `TICK_FONT_SIZE`,
  `GRID_TICKS`, `PERCENT_FACTOR`, `CHART_TOKEN`…), layouts en `DAG_DEFAULTS` y
  `src/lib/limits.ts`, resto en const locales (`GROUP_BAND_PADDING`, `NODE_RX_PROCESS`,
  `GLYPH_FRAME`…). Excepciones: `0/1/2` en índices y centrado (`/ 2`).
- **Sin clonar**: cartesianos usan `CartesianFrame` + `AnnotationLayer`
  (`src/lib/cartesian.tsx`); tips con `shareTip`/`pctOf` (`src/lib/tips.ts`);
  guards con `isBlank` (`src/lib/empty.ts`); formateador con
  `resolveFormatter` (`src/lib/format.ts`). Nuevo patrón repetido =
  nueva primitiva en `lib/`, no tercer copiado.
- **Tooltip**: cada forma lleva `<title>` (texto plano) + `data-chart-tip` con el
  mismo texto. Nada de estado ni handlers en el núcleo. El portal acelera con
  `rAF`, sigue `focus`/`touch`, cierra con `Escape` y voltea si no cabe abajo.
  Formato perfecto `contexto · serie: valor (parte · extra)`: dona/sankey/treemap/
  sunburst/histograma con `% del total`; barras/líneas multi-serie con `% del grupo`
  (single sin ruido); funnel con `% del inicio · % previo`; pirámide/divergente con
  `% del lado/fila`; pareto con `% · acumulado N%`; calendario `fecha (weekday)`;
  gantt `fechas · progreso · N d`; caja/bala/progreso/sparkline con resumen completo.
- **Datos**: todo input externo pasa por `toNumber` (no-finito → 0);
  cartesianos usan `domainWithZero` (negativos con línea de cero).
  Conteos (`pareto`, `funnel`, `pyramid`) clamp a 0. Nunca `NaN` en SVG.
- **Keys**: etiquetas duplicadas permitidas (`stableKey([label], i)`);
  ticks d3 por valor; `clipPath` con `useId` (multi-chart seguro).
- **Vacíos y a11y**: `ChartEmpty` si no hay datos; `role="img"` + `ariaLabel`
  obligatoria en la raíz.
- **Diagramas**: layout en `src/lib/graph.tsx` (`layoutDag` + `EdgeLabel`);
  nodos con `rx` de la línea (8 proceso/clase/ER, 12 estados, píldora inicio/fin),
  flechas `1.5px var(--muted-foreground)` y etiquetas de arista en píldora
  mono de `10px`.
- **Variantes**: si el tipo admite multi-serie, apilado o 100 %, se expone por
  props (`series[]`, `stacked`, `normalize`, `percentOf`) en vez de otro componente.

## Agregar una gráfica

1. `src/components/<nombre>.tsx` (sin `"use client"`, salvo portal) + tipos exportados.
2. Exportarla en `src/index.ts` (tipos con `export type`, ordenados).
   El subpath `@carlos-burelo/klin/<nombre>` queda solo (build + `exports` por patrón).
3. Caso en `test/charts.test.tsx` con `renderToStaticMarkup`: N formas,
   tooltip, vacío y `aria-label` (prueba de SSR).
4. Fila en la tabla de arriba + demo y `.mdx` en el site
   (`apps/site`: `src/demos/<slug>.tsx`, `src/demos/registry.ts`,
   `src/content/docs/<slug>.mdx` vía `pnpm docs:gen`).
5. `pnpm --filter @carlos-burelo/klin lint && pnpm --filter @carlos-burelo/klin typecheck && pnpm --filter @carlos-burelo/klin test`.

