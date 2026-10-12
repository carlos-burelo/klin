# Personalización por chart — @carlos-burelo/klin

> Inventario de props actuales + personalización propuesta por componente.
> Convenciones: todo aditivo (sin romper API), SSR-first (sin `"use client"`),
> colores solo tokens (`CHART_TOKEN`), formato `ValueFormatter` (`es-MX` por defecto),
> tooltip `contexto · serie: valor (parte · extra)`, vacío `EMPTY_TITLE`.

Leyenda de esfuerzo: `S` (props simples) · `M` (cómputo/layout) · `L` (nuevo modo).

---

## Globales (aplican a casi todos)

- `locale?: string = "es-MX"` — locale de `formatDefault` sin pasar formateador (`S`).
- `showLegend?: boolean = true` — ocultar `ChartLegend` en dashboards densos (`S`).
- `height` donde falta (HorizontalBarChart, diverging, pyramid, stacked, bullet, gantt) (`S`).
- `id?: string` — prefijo de `clipPath`/`defs` en vez de `useId` (embeds multi-instancia) (`S`).

---

## ArcDiagram

Actual: `nodes, edges, ariaLabel, emptyTitle, emptyDescription`.

- `nodeSize?: "auto" | "degree" = "degree"` — radio por grado vs fijo (`S`).
- `sortBy?: "degree" | "label" | "order" = "degree"` — orden del eje (`S`).
- `showLabels?: "all" | "ends" | "none" = "all"` — etiquetas en ejes densos (`S`).
- `arcHeight?: "fixed" | "degree" = "fixed"` — altura de arco por peso (`M`).
- `linkFilter?: (link) => boolean` — resaltar subgrafo por predicado (`M`).

## ArchitectureDiagram

Actual: `nodes, edges, ariaLabel, direction = "TB", empty*`.

- `groupBy?: "layer" | "none" = "layer"` — bandas por capa lógica (`M`).
- `statusColors?: Partial<Record<ArchNode["kind"], string>>` — override por tipo (`S`).
- `showBadges?: boolean = true` — insignias de estado en nodos (`S`).
- `compact?: boolean = false` — `nodeH` reducido para mapas grandes (`S`).
- `edgeStyle?: "curved" | "orthogonal" = "curved"` — rutas (`M`).

## AreaChart

Actual: `data, xKey, series, height = 260, ariaLabel, formatY, stacked = false, normalize = false, empty*`.

- `curve?: "monotone" | "linear" | "step" = "monotone"` — como `LineChart` (`S`).
- `showPoints?: boolean = true` — ocultar círculos en series densas (`S`).
- `fillOpacity?: number = AREA_FILL_OPACITY` — opacidad configurable (`S`).
- `stackOrder?: "appearance" | "value" = "appearance"` — orden de apilado (`M`).
- `yMin?: number, yMax?: number` — dominio fijo (targets, benchmarks) (`S`).

## BarChart

Actual: `data, xKey, series, height = 260, ariaLabel, formatY, empty*, barColor?`.

- `layout?: "grouped" | "stacked" | "percent" = "grouped"` — apilado sin otro componente (`M`).
- `orientation` — no: usar `HorizontalBarChart` (intencional).
- `barRadius?: number = BAR_RADIUS` — `0` para estilo denso (`S`).
- `showValues?: boolean = false` — etiqueta de valor sobre barra (`S`).
- `yMin/yMax`, `gridTicks?: number = GRID_TICKS` (`S`).
- `sortGroups?: "none" | "asc" | "desc" = "none"` — ranking (`S`).
- `highlightMax?: boolean = false` — acento al máximo (`S`).

## BoxPlot

Actual: `groups, ariaLabel, height = 260, formatY, empty*`.

- `showOutliers?: boolean = true` (`S`).
- `whisker?: 1.5 | "minmax" = 1.5` — bigotes IQR vs min-max (`S`).
- `orientation?: "vertical" | "horizontal" = "vertical"` (`M`).
- `showSampleSize?: boolean = false` — `n` bajo etiqueta (`S`).
- `notch?: boolean = false` — muesca de mediana (`S`).

## BulletChart

Actual: `rows, ariaLabel, format, color, empty*`.

- `bands?: [string, string, string]` — colores de bandas (`S`).
- `showTargetLabel?: boolean = true` — valor de meta visible (`S`).
- `scaleMax?: "auto" | number = "auto"` — tope fijo comparativo (`S`).
- `orientation` — no (horizontal intencional).

## CalendarHeatmap

Actual: `values, ariaLabel, end (= hoy), weeks = 26, format, color, empty*`.

- `start?: string` — ventana explícita (hoy se deriva de `end`) (`S`).
- `weekStart?: 0 | 1 = 1` — semana Lun vs Dom (`M`).
- `showMonthLabels?: boolean = true`, `showWeekdayLabels?: boolean = true` (`S`).
- `scale?: "linear" | "sqrt" | "quantile" = "linear"` — distribución sesgada (`M`).
- `firstDayLabel?: boolean` — no: cubierto por `format`.

## ClassDiagram

Actual: `nodes, edges, ariaLabel, direction = "TB", empty*`.

- `showMethods?: boolean = true`, `showAttributes?: boolean = true` (`S`).
- `visibility?: "all" | "public" = "all"` — filtrar `+/#/−` (`S`).
- `memberLimit?: number = 12` — colapsar clases gigantes (`S`).

## DivergingBar

Actual: `data, yKey, left, right, ariaLabel, formatX, empty*`.

- `midLabels?: "outside" | "center" = "outside"` (`S`).
- `showShare?: boolean = true` — tooltip ya trae `% de la fila`; flag para etiqueta (`S`).
- `neutralKey?: string` — tercera columna gris (NS/NR) (`M`).
- `sortBy?: "total" | "diff" | "none" = "none"` (`S`).

## DonutChart / PieChart

Actual: `data, ariaLabel, size = 220, thickness = 38 (dona), format, empty*`.

- `totalLabel?: string = "Total"` — hoy hardcode en dona (`S`).
- `showTotal?: boolean = true` — dona minimalista (`S`).
- `startAngle?: number = 0`, `padAngle?: number = 0` — estilo (`S`).
- `innerLabels?: "none" | "percent" = "none"` — % dentro de rebanada grande (`M`).
- `sortSlices?: boolean = false` — respetar orden de entrada (hoy) vs ranking (`S`).
- `cornerRadius?: number = 0` — arcos redondeados (`S`).

## ChartEmpty

Actual: `title = EMPTY_TITLE, description?`.

- `size?: "sm" | "md" = "md"` — `py` compacto en celdas (`S`).
- `icon?: ReactNode` — glifo opcional sin romper SSR (`S`).

## ErDiagram

Actual: `entities, relations, ariaLabel, direction = "LR", empty*`.

- `showKeys?: boolean = true` — insignias PK/FK (`S`).
- `crowFoot?: boolean = true` — pata de gallo vs `1—N` texto (`S`).
- `showWeak?: boolean = true` — estilo entidad débil (`S`).

## FlowChart

Actual: `nodes, edges, ariaLabel, direction = "TB", empty*`.

- `swimlanes?: string[]` — bandas por actor/sistema (`L`).
- `showStatus?: boolean` — color por `node.status?` (prop aditiva en `FlowNode`) (`M`).
- `edgeStyle?: "curved" | "orthogonal"` (`M`).

## FunnelChart

Actual: `stages, ariaLabel, height = 280, format, empty*`.

- `showDropOff?: boolean = true` — pérdida entre etapas en conector (`S`, tooltip ya la trae como `% previo`).
- `shape?: "trapezoid" | "bar" = "trapezoid"` (`M`).
- `baseline?: "first" | "previous" = "first"` — base del % (`S`).

## GanttChart

Actual: `tasks, ariaLabel, formatDate, empty*`.

- `showProgress?: boolean = true` (`S`).
- `today?: string | Date` — línea "hoy" (`S`).
- `granularity?: "day" | "week" | "month" = "day"` — ticks (`M`).
- `rowHeight?: number = 30`, `labelWidth?: number = 148` (`S`).
- `dependencies?: Array<{from,to}>` — flechas fin-fin (`L`).

## GaugeChart

Actual: `value, ariaLabel, label?, size = 220, thickness = 22, color, trackColor, format (% inside), emptyTitle`.

- `min?: number = 0, max?: number = 100` — hoy 0–100 fijos (`S`).
- `zones?: Array<{to: number; color?: string}>` — bandas (`M`).
- `showNeedle?: boolean = false` — aguja vs arco (`S`).
- `emptyDescription?` — falta vs resto (`S`).

## HorizontalBarChart

Actual: `data, yKey, series, ariaLabel, formatX, empty*`.

- Paridad con `BarChart`: `height?`, `barRadius?`, `showValues?` (hoy `true` fijo), `sortGroups?`, `gridTicks?` (`S` c/u).
- `labelWidth?: number = 132` — hoy `MARGIN.left` fijo (`S`).

## MatrixHeatmap

Actual: `rows, cols, values, ariaLabel, format, color, empty*`.

- `scale?: "linear" | "quantile" = "linear"` (`M`).
- `showValues?: "auto" | "always" | "never" = "auto"` — texto en celda (`S`).
- `cluster?: boolean = false` — ordenar filas/columnas por similitud (`L`).
- `missingLabel?: string = "—"` — celdas `NaN` (`S`).

## Histogram

Actual: `values, ariaLabel, bins = 12, height = 240, format, color, empty*`.

- `binning?: "count" | "width" | "sturges" = "count"` (`M`).
- `cumulative?: boolean = false` — ojiva (`M`).
- `showMean?: boolean = false` — línea media/mediana (`S`).
- `domain?: [number, number]` — recorte de outliers (`S`).

## KanbanBoard

Actual: `columns, ariaLabel, empty*`.

- `cardFields?: Array<"tags" | "assignee" | "due"> = ["tags"]` — densidad (`S`).
- `wipWarn?: boolean = true` — resaltar exceso WIP (`S`).
- `collapsedColumns?: string[]` — columnas colapsadas (`S`).
- `density?: "comfortable" | "compact" = "comfortable"` (`S`).

## ChartLegend

Actual: `items`.

- `layout?: "row" | "column" = "row"`, `align?: "center" | "start" = "center"` (`S`).
- `shape?: "square" | "line" | "dot" = "square"` — series de línea (`S`).
- `maxItems?: number` — colapsar resto en `+N` (`S`).

## LineChart

Actual: `data, xKey, series, height = 260, ariaLabel, formatY, curve = "monotone", empty*`.

- `showPoints?: boolean = true`, `showArea?: boolean = false` — área bajo línea (`S`).
- `yMin/yMax`, `gridTicks?` (`S`).
- `missing?: "gap" | "zero" | "connect" = "connect"` — huecos (`M`).
- `band?: { lower: string; upper: string }` — intervalo de confianza (`L`).

## LollipopChart

Actual: `data, xKey, yKey, ariaLabel, height = 260, formatY, color, empty*`.

- `multiSeries` — no: usar `BarChart`/`LineChart` (intencional, una serie).
- `stemStyle?: "solid" | "dashed" = "solid"` (`S`).
- `sortGroups?`, `showValues?` (`S`).

## MindmapDiagram

Actual: `root, ariaLabel, empty*`.

- `direction?: "LR" | "both" = "LR"` — ramas a ambos lados (`M`).
- `collapsible?: boolean` — no: SSR puro; documentar que colapso vive en `TreeView` (cero props).
- `depthColors?: string[]` — color por profundidad (`S`).
- `nodeWidth?: number = 150` (`S`).

## NetworkGraph

Actual: `nodes, edges, ariaLabel, seed = 42, empty*`.

- `forces?: { distance?: number; charge?: number; collide?: number }` — física (`S`, defaults `NETWORK_*`).
- `nodeSize?: "degree" | "fixed" = "degree"` (`S`).
- `showIsolated?: boolean = true` — atenuar grado 0 (`S`).
- `ticks?: number = NETWORK_TICKS` — calidad vs costo SSR (`S`).

## NetworkTopology

Actual: `nodes, edges, ariaLabel, direction = "TB", empty*`.

- `linkLegend?: boolean = true` — leyenda activo/degradado/caído (`S`).
- `glyphSize?: number = GLYPH_R` (`S`).
- `statusColors?: Record<TopoEdge["status"], string>` (`S`).

## OrgChart

Actual: `root, ariaLabel, empty*`.

- `showRole?: boolean = true`, `showAvatar?: boolean = false` (iniciales) (`S`).
- `direction?: "TB" | "LR" = "TB"` (`M`).
- `collapseDepth?: number` — podar niveles (`S`).

## ParetoChart

Actual: `data, xKey, yKey, ariaLabel, height = 280, formatY, color, empty*`.

- `topN?: number` — resto en "Otros" (`S`).
- `threshold?: number = 80` — línea 80/20 (`S`).
- `showCumLabels?: boolean = false` — % acumulado sobre puntos (`S`).

## ProgressList

Actual: `rows, ariaLabel, format, color, empty*`.

- `barHeight?: "sm" | "md" = "md"` (`S`).
- `showPercent?: boolean = true` — badge `%` (`S`, tooltip ya trae `de total`).
- `status?: (pct) => "ok" | "warn" | "bad"` — color por umbral (`S`).

## PyramidChart

Actual: `groups, left, right, ariaLabel, formatX, labels = "left", empty*`.

- `showShare?: boolean = true` — etiqueta `%` (tooltip ya) (`S`).
- `centerGap?: number` — hoy fijo (`S`).
- `sortGroups?` (`S`).

## QuadrantChart

Actual: `points, ariaLabel, xLabel = "→ Esfuerzo", yLabel = "↑ Impacto", quads = [...], empty*`.

- `bubbleBy?: string` — radio por campo (`M`, `points` gana `size?`).
- `showCounts?: boolean = false` — `n` por cuadrante (`S`).
- `thresholds?: { x: number; y: number }` — cruz no centrada (`S`).

## RadarChart

Actual: `axes, series, ariaLabel, size = 300, levels = 4, maxValue?, format, empty*`.

- `fillOpacity?: number` — por serie (`S`).
- `showVertices?: boolean = true` (`S`).
- `scale?: "linear" | "sqrt" = "linear"` (`S`).

## RadialProgress

Actual: `value, ariaLabel, label?, size = 160, thickness = 16, color, trackColor, format (% inside), emptyTitle`.

- `min/max`, `trackStyle?: "full" | "ticks"` (`S`).
- `emptyDescription?` (`S`).

## SankeyDiagram

Actual: `nodes, flows, ariaLabel, format, empty*`.

- `nodeAlign?: "left" | "justify" | "center" = "justify"` — d3-sankey (`S`).
- `showNodeValues?: boolean = true` (`S`).
- `linkColor?: "source" | "target" | "gradient" = "source"` (`M`).
- `sortNodes?: boolean = false` (`S`).

## ScatterPlot

Actual: `points, ariaLabel, xLabel = "x", yLabel = "y", height = 260, format, color, empty*`.

- `trendline?: boolean = false` — regresión lineal (`M`).
- `sizeBy?: string` — burbujas (`M`).
- `quadrants?: boolean = false` — cruz en medias (`S`).

## SequenceDiagram

Actual: `participants, messages, ariaLabel, empty*`.

- `showNumbers?: boolean = true` — hoy siempre (`S`).
- `groupBy?: string` — fragmentos `alt/opt/loop` (`L`).
- `actorStyle?: "box" | "stickman" = "box"` (`M`).

## Sparkline

Actual: `values, ariaLabel, width = 120, height = 36, color, emptyTitle, emptyDescription`.

- `kind?: "line" | "area" | "bar" = "line"` (`M`).
- `showLastDot?: boolean = true`, `showMinMax?: boolean = false` (`S`).
- `reference?: number` — línea de meta (`S`).

## StackedBar

Actual: `rows, segments, ariaLabel, format, percentOf (= segments[0]), empty*`.

- `scale?: "row" | "global" = "global"` — hoy global (`maxTotal`) (`S`).
- `showPercent?: boolean = true` — badge (hoy siempre) (`S`).
- `barHeight?: number = TRACK_H` (`S`).

## StateDiagram

Actual: `nodes, edges, ariaLabel, direction = "LR", empty*`.

- `showInitial?: boolean = true` — pseudoinicio aunque no venga en nodos (`S`).
- `historyStates?: boolean` — no: modo UML avanzado, propuesta `L`.
- Igual que flow: `edgeStyle?` (`M`).

## Streamgraph

Actual: `data, xKey, series, height = 280, ariaLabel, formatY, empty*`.

- `offset?: "wiggle" | "silhouette" | "zero" = "wiggle"` — hoy wiggle fijo (`S`).
- `curve?` como `LineChart` (`S`).
- `showPoints?: boolean = false` (`S`).

## SunburstChart

Actual: `data, ariaLabel, size = 300, format, empty*`.

- `depth?: number` — podar anillos (`S`).
- `showRootLabel?: boolean = true` (`S`).
- `cornerRadius?`, `padAngle?` (`S`).

## TimelineChart

Actual: `events, ariaLabel, empty*`.

- `side?: "alternate" | "left" | "right" = "alternate"` (`S`).
- `showDates?: boolean = true`, `formatDate?` como `GanttChart` (`S`).
- `density?: "comfortable" | "compact"` (`S`).

## ChartTooltipPortal

Actual: `children, className?, offset = TOOLTIP_OFFSET`.

- `position?: "cursor" | "anchor" = "cursor"` — anclar a forma en touch (`M`).
- `delay?: number = 0` — retardo de aparición (`S`).
- `maxWidth?: number = TOOLTIP_WIDTH` (`S`).

## TreeView

Actual: `items, ariaLabel, defaultOpen = true, empty*`.

- `searchable?: boolean` — no: requiere cliente; documentar filtro fuera (cero props).
- `density?`, `showBadges?` (hoy siempre) (`S`).

## TreemapChart

Actual: `data, ariaLabel, format, empty*`.

- `tiling?: "squarify" | "slice" | "dice" = "squarify"` (`S`).
- `showValues?: boolean = true`, `minLabelArea?: number` (`S`).
- `depthColors?` (`S`).

## UseCaseDiagram

Actual: `actors, usecases, edges, ariaLabel, empty*`.

- `boundary?: string` — rectángulo de sistema (`S`).
- `showStereotypes?: boolean = true` — `≪include≫` (`S`).

## VennDiagram

Actual: `sets (2|3), intersections?, ariaLabel, size = 340, format, empty*`.

- `showPercent?: boolean = false` — % del universo (`S`, requiere `universe?: number`).
- `proportional?: boolean` — no: geometría fija intencional (documentar, cero props).

## VerticalStackedBar

Actual: `data, xKey, series, height = 260, ariaLabel, formatY, normalize = false, empty*`.

- Paridad con `BarChart`: `barRadius?` (hoy clip), `showValues?`, `gridTicks?`, `sortGroups?` (`S`).
- `stackOrder?` como `AreaChart` (`M`).

## WaffleChart

Actual: `parts, ariaLabel, size = 220, format, empty*`.

- `columns?: number = 10` — hoy 10×10 fijo (`S`).
- `gap?: number = 3`, `cellRadius?` (`S`).
- `showLegendValues?: boolean = true` (hoy siempre) (`S`).

## WardleyMap

Actual: `nodes, edges, ariaLabel, empty*`.

- `showGridLabels?: boolean = true` (`S`).
- `stages?: [string, string, string, string]` — hoy fijos Génesis→Mercancía (`S`).
- `nodeSize?: "fixed" | "edges" = "fixed"` (`S`).

## WaterfallChart

Actual: `steps, ariaLabel, height = 280, totalLabel = "Total", formatY, empty*`.

- `showConnectors?: boolean = true` (hoy siempre) (`S`).
- `positiveColor?/negativeColor?/totalColor?` — hoy `chart1/chart5/primary` (`S`).
- `runningTotal?: boolean = true` — etiqueta acumulada (hoy siempre) (`S`).
