# @carlos-burelo/klin

Gráficas SSR-first: **d3 para cálculo, SVG puro para render**.
Sin `recharts`, sin `ResponsiveContainer`, sin `"use client"` en el núcleo.

> © 2026 Carlos Burelo. Licencia AGPL-3.0-or-later (`LICENSE`). Proyecto personal,
> sin afiliación institucional: nadie más posee derechos sobre este código.
> Quien use, modifique u ofrezca este código por red debe liberar el suyo
> bajo la misma licencia (copyleft fuerte, incluye SaaS).

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
  (`var(--color-primary)`, `var(--color-muted-foreground)`…). Sin hex sueltos.
- **A11y.** `role="img"`, `aria-label`, `<title>` por forma.

## Uso

```css
/* globals.css, después de ui */
@import "@carlos-burelo/klin/styles.css";
```

```ts
// next.config.ts
transpilePackages: ["@carlos-burelo/klin"],
```

```tsx
import { BarChart, ChartLegend, ChartTooltipPortal } from "@carlos-burelo/klin";

<ChartTooltipPortal>
  <BarChart
    ariaLabel="Planeaciones por estado"
    data={[{ estado: "Completa", n: 12 }]}
    xKey="estado"
    series={[{ key: "n", label: "Planeaciones" }]}
  />
</ChartTooltipPortal>
```

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
| `LollipopChart` | Puntos sobre palos con valor |
| `Streamgraph` | Capas con desplazamiento central |
| `ArcDiagram` | Relaciones sobre un eje |
| `ChartLegend` | Leyenda HTML |
| `ChartEmpty` | Estado vacío homogéneo |
| `ChartTooltipPortal` | Único cliente: tooltip por portal (mínimo JS) |

Paleta: `CHART_PALETTE` (`--chart-1…5`). Formato por defecto `es-MX`.

## Línea de estilo (obligatoria)

Toda gráfica nueva sigue esta spec para que el set se vea uno solo:

- **Geometría**: barras/buckets/celdas/columnas con `rx=4`; pistas tipo píldora
  (`rounded-full` o recorte); puntos `r=3.5` con borde `var(--background)` de `1.5`
  (dispersión `r=4.5`, radar `r=3`); líneas `2px round`; grid `var(--border)` de `1`.
- **Texto**: ejes y ticks `11px var(--color-muted-foreground)`; valores destacados
  `tabular-nums` (`font-mono` en HTML); leyenda `text-xs` vía `ChartLegend`.
- **Color**: solo tokens (`var(--chart-N)`, `var(--color-*)`, `var(--muted)` para
  pistas). Sin hex. Serie N → `seriesColor(N, override)`.
- **Tooltip**: cada forma lleva `<title>` (texto plano) + `data-chart-tip` con el
  mismo texto. Nada de estado ni handlers en el núcleo.
- **Vacíos y a11y**: `ChartEmpty` si no hay datos; `role="img"` + `ariaLabel`
  obligatoria en la raíz.
- **Diagramas**: layout en `src/lib/graph.tsx` (`layoutDag` + `EdgeLabel`);
  nodos con `rx` de la línea (8 proceso/clase/ER, 12 estados, píldora inicio/fin),
  flechas `1.5px var(--color-muted-foreground)` y etiquetas de arista en píldora
  mono de `10px`.
- **Variantes**: si el tipo admite multi-serie, apilado o 100 %, se expone por
  props (`series[]`, `stacked`, `normalize`, `percentOf`) en vez de otro componente.

## Agregar una gráfica

1. `src/components/<nombre>.tsx` (sin `"use client"`) + tipos exportados.
2. Exportarla en `src/index.ts` (tipos con `export type`, ordenados).
3. Caso en `test/charts.test.tsx` con `renderToStaticMarkup`: N formas,
   tooltip, vacío y `aria-label` (prueba de SSR).
4. Fila en la tabla de arriba + demo y `.mdx` en showcase
   (`apps/showcase`: `demos.tsx`, `demo-registry.ts`, `src/docs/graficas/`).
5. `pnpm --filter @carlos-burelo/klin lint && pnpm --filter @carlos-burelo/klin typecheck && pnpm --filter @carlos-burelo/klin test`.

