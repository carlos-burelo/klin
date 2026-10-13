/**
 * Registro de demos del sitio (no se publica en el bundle de la lib).
 * Cada demo vive en `./<slug>.tsx` y se documenta en
 * `../content/docs/<slug>.mdx` (el MDX la importa como demo viva).
 */

export type DemoSection = "Gráficas" | "Diagramas" | "Utilidades";

export type DemoEntry = {
  slug: string;
  title: string;
  section: DemoSection;
  description: string;
  /** Archivo fuente en el repo (enlace a GitHub). */
  source: string;
};

const REPO =
  "https://github.com/carlos-burelo/klin/blob/main/packages/klin/src/components";

function entry(
  slug: string,
  title: string,
  section: DemoSection,
  description: string,
  source: string,
): DemoEntry {
  return { slug, title, section, description, source: `${REPO}/${source}` };
}

export const DEMOS: DemoEntry[] = [
  entry(
    "area-chart",
    "Area Chart",
    "Gráficas",
    "Superpuestas o apiladas, con modo 100 %.",
    "area-chart.tsx",
  ),
  entry(
    "bar-chart",
    "Bar Chart",
    "Gráficas",
    "Una o varias series agrupadas, con negativos.",
    "bar-chart.tsx",
  ),
  entry(
    "box-plot",
    "Box Plot",
    "Gráficas",
    "Cuartiles, mediana y atípicos.",
    "box-plot.tsx",
  ),
  entry(
    "bullet-chart",
    "Bullet Chart",
    "Gráficas",
    "Valor vs meta sobre bandas.",
    "bullet-chart.tsx",
  ),
  entry(
    "calendar-heatmap",
    "Calendar Heatmap",
    "Gráficas",
    "Actividad diaria estilo contribuciones.",
    "calendar-heatmap.tsx",
  ),
  entry(
    "diverging-bar",
    "Diverging Bar",
    "Gráficas",
    "Encuestas a favor y en contra.",
    "diverging-bar.tsx",
  ),
  entry(
    "donut-chart",
    "Donut Chart",
    "Gráficas",
    "Partes con total al centro y % del total.",
    "donut-chart.tsx",
  ),
  entry(
    "pie-chart",
    "Pie Chart",
    "Gráficas",
    "Dona sin agujero.",
    "donut-chart.tsx",
  ),
  entry(
    "funnel-chart",
    "Funnel Chart",
    "Gráficas",
    "Conversión por etapas con caída.",
    "funnel-chart.tsx",
  ),
  entry(
    "gauge-chart",
    "Gauge Chart",
    "Gráficas",
    "Indicador con zonas.",
    "gauge-chart.tsx",
  ),
  entry(
    "horizontal-bar-chart",
    "Horizontal Bar Chart",
    "Gráficas",
    "Comparativas con valor tabular.",
    "horizontal-bar-chart.tsx",
  ),
  entry(
    "matrix-heatmap",
    "Matrix Heatmap",
    "Gráficas",
    "Intensidad filas × columnas.",
    "matrix-heatmap.tsx",
  ),
  entry(
    "histogram",
    "Histogram",
    "Gráficas",
    "Distribución con bins y %.",
    "histogram.tsx",
  ),
  entry(
    "line-chart",
    "Line Chart",
    "Gráficas",
    "Series con curvas y anotaciones.",
    "line-chart.tsx",
  ),
  entry(
    "lollipop-chart",
    "Lollipop Chart",
    "Gráficas",
    "Puntos sobre palos.",
    "lollipop-chart.tsx",
  ),
  entry(
    "pareto-chart",
    "Pareto Chart",
    "Gráficas",
    "Causas ordenadas con % acumulado.",
    "pareto-chart.tsx",
  ),
  entry(
    "progress-list",
    "Progress List",
    "Gráficas",
    "Medidores lineales con valor tabular.",
    "progress-list.tsx",
  ),
  entry(
    "pyramid-chart",
    "Pyramid Chart",
    "Gráficas",
    "Dos series espejadas.",
    "pyramid-chart.tsx",
  ),
  entry(
    "quadrant-chart",
    "Quadrant Chart",
    "Gráficas",
    "Matriz esfuerzo-impacto.",
    "quadrant-chart.tsx",
  ),
  entry(
    "radar-chart",
    "Radar Chart",
    "Gráficas",
    "Telaraña multivariada.",
    "radar-chart.tsx",
  ),
  entry(
    "radial-progress",
    "Radial Progress",
    "Gráficas",
    "Anillo 0–100 para avances.",
    "radial-progress.tsx",
  ),
  entry(
    "sankey-diagram",
    "Sankey Diagram",
    "Gráficas",
    "Flujos ponderados entre etapas.",
    "sankey-diagram.tsx",
  ),
  entry(
    "scatter-plot",
    "Scatter Plot",
    "Gráficas",
    "Puntos XY con negativos.",
    "scatter-plot.tsx",
  ),
  entry(
    "sparkline",
    "Sparkline",
    "Gráficas",
    "KPI de tabla sin ejes.",
    "sparkline.tsx",
  ),
  entry(
    "stacked-bar",
    "Stacked Bar",
    "Gráficas",
    "Progreso por segmentos con %.",
    "stacked-bar.tsx",
  ),
  entry(
    "streamgraph",
    "Streamgraph",
    "Gráficas",
    "Capas con desplazamiento central.",
    "streamgraph.tsx",
  ),
  entry(
    "sunburst-chart",
    "Sunburst Chart",
    "Gráficas",
    "Jerarquía en anillos.",
    "sunburst-chart.tsx",
  ),
  entry(
    "treemap-chart",
    "Treemap Chart",
    "Gráficas",
    "Jerarquía por área.",
    "treemap-chart.tsx",
  ),
  entry(
    "vertical-stacked-bar",
    "Vertical Stacked Bar",
    "Gráficas",
    "Apilado clásico o 100 %.",
    "vertical-stacked-bar.tsx",
  ),
  entry(
    "waterfall-chart",
    "Waterfall Chart",
    "Gráficas",
    "Deltas acumulados con total.",
    "waterfall-chart.tsx",
  ),
  entry(
    "waffle-chart",
    "Waffle Chart",
    "Gráficas",
    "100 cuadros de composición.",
    "waffle-chart.tsx",
  ),
  entry(
    "beeswarm-plot",
    "Beeswarm Plot",
    "Gráficas",
    "Puntos sin solape sobre un eje.",
    "beeswarm-plot.tsx",
  ),
  entry(
    "bump-chart",
    "Bump Chart",
    "Gráficas",
    "Rankings que suben y bajan.",
    "bump-chart.tsx",
  ),
  entry(
    "candlestick-chart",
    "Candlestick Chart",
    "Gráficas",
    "OHLC con mechas y cuerpos.",
    "candlestick-chart.tsx",
  ),
  entry(
    "dumbbell-chart",
    "Dumbbell Chart",
    "Gráficas",
    "Dos puntos conectados por categoría.",
    "dumbbell-chart.tsx",
  ),
  entry(
    "marimekko-chart",
    "Marimekko Chart",
    "Gráficas",
    "Ancho y alto en porcentaje.",
    "marimekko-chart.tsx",
  ),
  entry(
    "nightingale-chart",
    "Nightingale Chart",
    "Gráficas",
    "Rosa polar de proporciones.",
    "nightingale-chart.tsx",
  ),
  entry(
    "radial-bar-chart",
    "Radial Bar Chart",
    "Gráficas",
    "Barras concéntricas 0–100.",
    "radial-bar-chart.tsx",
  ),
  entry(
    "range-chart",
    "Range Chart",
    "Gráficas",
    "Intervalos con valor y bigotes.",
    "range-chart.tsx",
  ),
  entry(
    "ridgeline-plot",
    "Ridgeline Plot",
    "Gráficas",
    "Densidades apiladas con solape.",
    "ridgeline-plot.tsx",
  ),
  entry(
    "slope-chart",
    "Slope Chart",
    "Gráficas",
    "Cambios entre dos instantes.",
    "slope-chart.tsx",
  ),
  entry(
    "violin-plot",
    "Violin Plot",
    "Gráficas",
    "Distribución con KDE por grupo.",
    "violin-plot.tsx",
  ),
  entry(
    "ternary-plot",
    "Ternary Plot",
    "Gráficas",
    "Composiciones en triángulo.",
    "ternary-plot.tsx",
  ),
  entry(
    "dot-plot",
    "Dot Plot",
    "Gráficas",
    "Puntos ordenados estilo Cleveland.",
    "dot-plot.tsx",
  ),
  entry(
    "isotype-chart",
    "Isotype Chart",
    "Gráficas",
    "Pictogramas repetidos por valor.",
    "isotype-chart.tsx",
  ),
  entry(
    "chord-diagram",
    "Chord Diagram",
    "Gráficas",
    "Ribbons entre grupos.",
    "chord-diagram.tsx",
  ),
  entry(
    "density-contour-plot",
    "Density Contour Plot",
    "Gráficas",
    "Isolíneas sobre dispersión.",
    "density-contour-plot.tsx",
  ),
  entry(
    "hexbin-plot",
    "Hexbin Plot",
    "Gráficas",
    "Agregación hexagonal.",
    "hexbin-plot.tsx",
  ),
  entry(
    "table-chart",
    "Table Chart",
    "Gráficas",
    "Tabla con barras inline.",
    "table-chart.tsx",
  ),
  entry(
    "arc-diagram",
    "Arc Diagram",
    "Diagramas",
    "Relaciones sobre un eje.",
    "arc-diagram.tsx",
  ),
  entry(
    "architecture-diagram",
    "Architecture Diagram",
    "Diagramas",
    "Servicios, datos, colas y actores.",
    "architecture-diagram.tsx",
  ),
  entry(
    "class-diagram",
    "Class Diagram",
    "Diagramas",
    "Herencia y composición.",
    "class-diagram.tsx",
  ),
  entry(
    "er-diagram",
    "ER Diagram",
    "Diagramas",
    "Entidades y cardinalidad.",
    "er-diagram.tsx",
  ),
  entry(
    "flow-chart",
    "Flow Chart",
    "Diagramas",
    "Procesos y decisiones.",
    "flow-chart.tsx",
  ),
  entry(
    "state-diagram",
    "State Diagram",
    "Diagramas",
    "Máquina de estados.",
    "state-diagram.tsx",
  ),
  entry(
    "usecase-diagram",
    "Use Case Diagram",
    "Diagramas",
    "Actores e include/extend.",
    "usecase-diagram.tsx",
  ),
  entry(
    "sequence-diagram",
    "Sequence Diagram",
    "Diagramas",
    "Participantes y mensajes.",
    "sequence-diagram.tsx",
  ),
  entry(
    "mindmap-diagram",
    "Mindmap Diagram",
    "Diagramas",
    "Árbol horizontal.",
    "mindmap-diagram.tsx",
  ),
  entry(
    "org-chart",
    "Org Chart",
    "Diagramas",
    "Jerarquía vertical.",
    "org-chart.tsx",
  ),
  entry(
    "kanban-board",
    "Kanban Board",
    "Diagramas",
    "Columnas con límite WIP.",
    "kanban-board.tsx",
  ),
  entry(
    "timeline-chart",
    "Timeline Chart",
    "Diagramas",
    "Hitos alternados.",
    "timeline-chart.tsx",
  ),
  entry(
    "tree-view",
    "Tree View",
    "Diagramas",
    "Vista anidada con details.",
    "tree-view.tsx",
  ),
  entry(
    "network-graph",
    "Network Graph",
    "Diagramas",
    "Grafo con fuerzas deterministas.",
    "network-graph.tsx",
  ),
  entry(
    "network-topology",
    "Network Topology",
    "Diagramas",
    "Roles con estado de enlace.",
    "network-topology.tsx",
  ),
  entry(
    "venn-diagram",
    "Venn Diagram",
    "Diagramas",
    "Intersecciones de 2 o 3 conjuntos.",
    "venn-diagram.tsx",
  ),
  entry(
    "wardley-map",
    "Wardley Map",
    "Diagramas",
    "Cadena de valor vs evolución.",
    "wardley-map.tsx",
  ),
  entry(
    "gantt-chart",
    "Gantt Chart",
    "Diagramas",
    "Tareas en el tiempo con avance.",
    "gantt-chart.tsx",
  ),
  entry(
    "circle-pack-chart",
    "Circle Pack Chart",
    "Diagramas",
    "Jerarquía en burbujas.",
    "circle-pack-chart.tsx",
  ),
  entry(
    "dendrogram-chart",
    "Dendrogram Chart",
    "Diagramas",
    "Árbol cluster vertical.",
    "dendrogram-chart.tsx",
  ),
  entry(
    "icicle-chart",
    "Icicle Chart",
    "Diagramas",
    "Partición rectangular.",
    "icicle-chart.tsx",
  ),
  entry(
    "fishbone-diagram",
    "Fishbone Diagram",
    "Diagramas",
    "Espina causa-efecto.",
    "fishbone-diagram.tsx",
  ),
  entry(
    "chart-legend",
    "Chart Legend",
    "Utilidades",
    "Leyenda HTML SSR.",
    "legend.tsx",
  ),
  entry(
    "chart-empty",
    "Chart Empty",
    "Utilidades",
    "Estado homogéneo sin datos.",
    "empty.tsx",
  ),
  entry(
    "tooltip-portal",
    "Tooltip Portal",
    "Utilidades",
    "Tooltip rico, único cliente.",
    "tooltip-portal.tsx",
  ),
];

export const DEMO_COUNT = DEMOS.length;

export const DEMO_SLUGS = DEMOS.map((d) => d.slug);

/** Secciones del catálogo en orden de sidebar (única fuente). */
export const DEMO_SECTIONS: DemoSection[] = [
  "Gráficas",
  "Diagramas",
  "Utilidades",
];

/** Destacados del overview (título/descripción salen de DEMOS). */
export const FEATURED_SLUGS = ["bar-chart", "donut-chart", "sankey-diagram"];

export function getDemo(slug: string): DemoEntry | undefined {
  return DEMOS.find((d) => d.slug === slug);
}
