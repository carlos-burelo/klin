/**
 * Registro de demos del sitio (no se publica en el bundle de la lib).
 * Cada demo vive en `./<slug>.tsx` y exporta el componente por defecto.
 */
import type { ComponentType } from "react";

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
    "Áreas",
    "Gráficas",
    "Superpuestas o apiladas, con modo 100 %.",
    "area-chart.tsx",
  ),
  entry(
    "bar-chart",
    "Barras verticales",
    "Gráficas",
    "Una o varias series agrupadas, con negativos.",
    "bar-chart.tsx",
  ),
  entry(
    "box-plot",
    "Cajas y bigotes",
    "Gráficas",
    "Cuartiles, mediana y atípicos.",
    "box-plot.tsx",
  ),
  entry(
    "bullet-chart",
    "Bala",
    "Gráficas",
    "Valor vs meta sobre bandas.",
    "bullet-chart.tsx",
  ),
  entry(
    "calendar-heatmap",
    "Calor de calendario",
    "Gráficas",
    "Actividad diaria estilo contribuciones.",
    "calendar-heatmap.tsx",
  ),
  entry(
    "diverging-bar",
    "Barras divergentes",
    "Gráficas",
    "Encuestas a favor y en contra.",
    "diverging-bar.tsx",
  ),
  entry(
    "donut-chart",
    "Dona",
    "Gráficas",
    "Partes con total al centro y % del total.",
    "donut-chart.tsx",
  ),
  entry(
    "pie-chart",
    "Torta",
    "Gráficas",
    "Dona sin agujero.",
    "donut-chart.tsx",
  ),
  entry(
    "funnel-chart",
    "Embudo",
    "Gráficas",
    "Conversión por etapas con caída.",
    "funnel-chart.tsx",
  ),
  entry(
    "gauge-chart",
    "Velocímetro",
    "Gráficas",
    "Indicador con zonas.",
    "gauge-chart.tsx",
  ),
  entry(
    "horizontal-bar-chart",
    "Barras horizontales",
    "Gráficas",
    "Comparativas con valor tabular.",
    "horizontal-bar-chart.tsx",
  ),
  entry(
    "matrix-heatmap",
    "Mapa de calor",
    "Gráficas",
    "Intensidad filas × columnas.",
    "matrix-heatmap.tsx",
  ),
  entry(
    "histogram",
    "Histograma",
    "Gráficas",
    "Distribución con bins y %.",
    "histogram.tsx",
  ),
  entry(
    "line-chart",
    "Líneas",
    "Gráficas",
    "Series con curvas y anotaciones.",
    "line-chart.tsx",
  ),
  entry(
    "lollipop-chart",
    "Lollipop",
    "Gráficas",
    "Puntos sobre palos.",
    "lollipop-chart.tsx",
  ),
  entry(
    "pareto-chart",
    "Pareto",
    "Gráficas",
    "Causas ordenadas con % acumulado.",
    "pareto-chart.tsx",
  ),
  entry(
    "progress-list",
    "Lista de progreso",
    "Gráficas",
    "Medidores lineales con valor tabular.",
    "progress-list.tsx",
  ),
  entry(
    "pyramid-chart",
    "Pirámide",
    "Gráficas",
    "Dos series espejadas.",
    "pyramid-chart.tsx",
  ),
  entry(
    "quadrant-chart",
    "Cuadrantes",
    "Gráficas",
    "Matriz esfuerzo-impacto.",
    "quadrant-chart.tsx",
  ),
  entry(
    "radar-chart",
    "Radar",
    "Gráficas",
    "Telaraña multivariada.",
    "radar-chart.tsx",
  ),
  entry(
    "radial-progress",
    "Progreso radial",
    "Gráficas",
    "Anillo 0–100 para avances.",
    "radial-progress.tsx",
  ),
  entry(
    "sankey-diagram",
    "Sankey",
    "Gráficas",
    "Flujos ponderados entre etapas.",
    "sankey-diagram.tsx",
  ),
  entry(
    "scatter-plot",
    "Dispersión",
    "Gráficas",
    "Puntos XY con negativos.",
    "scatter-plot.tsx",
  ),
  entry(
    "sparkline",
    "Minigráfica",
    "Gráficas",
    "KPI de tabla sin ejes.",
    "sparkline.tsx",
  ),
  entry(
    "stacked-bar",
    "Barras apiladas",
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
    "Sunburst",
    "Gráficas",
    "Jerarquía en anillos.",
    "sunburst-chart.tsx",
  ),
  entry(
    "treemap-chart",
    "Treemap",
    "Gráficas",
    "Jerarquía por área.",
    "treemap-chart.tsx",
  ),
  entry(
    "vertical-stacked-bar",
    "Apiladas verticales",
    "Gráficas",
    "Apilado clásico o 100 %.",
    "vertical-stacked-bar.tsx",
  ),
  entry(
    "waterfall-chart",
    "Cascada",
    "Gráficas",
    "Deltas acumulados con total.",
    "waterfall-chart.tsx",
  ),
  entry(
    "waffle-chart",
    "Waffle",
    "Gráficas",
    "100 cuadros de composición.",
    "waffle-chart.tsx",
  ),
  entry(
    "arc-diagram",
    "Arcos",
    "Diagramas",
    "Relaciones sobre un eje.",
    "arc-diagram.tsx",
  ),
  entry(
    "architecture-diagram",
    "Arquitectura",
    "Diagramas",
    "Servicios, datos, colas y actores.",
    "architecture-diagram.tsx",
  ),
  entry(
    "class-diagram",
    "Clases UML",
    "Diagramas",
    "Herencia y composición.",
    "class-diagram.tsx",
  ),
  entry(
    "er-diagram",
    "Entidad-relación",
    "Diagramas",
    "Entidades y cardinalidad.",
    "er-diagram.tsx",
  ),
  entry(
    "flow-chart",
    "Flujo",
    "Diagramas",
    "Procesos y decisiones.",
    "flow-chart.tsx",
  ),
  entry(
    "state-diagram",
    "Estados",
    "Diagramas",
    "Máquina de estados.",
    "state-diagram.tsx",
  ),
  entry(
    "usecase-diagram",
    "Casos de uso",
    "Diagramas",
    "Actores e include/extend.",
    "usecase-diagram.tsx",
  ),
  entry(
    "sequence-diagram",
    "Secuencia",
    "Diagramas",
    "Participantes y mensajes.",
    "sequence-diagram.tsx",
  ),
  entry(
    "mindmap-diagram",
    "Mapa mental",
    "Diagramas",
    "Árbol horizontal.",
    "mindmap-diagram.tsx",
  ),
  entry(
    "org-chart",
    "Organigrama",
    "Diagramas",
    "Jerarquía vertical.",
    "org-chart.tsx",
  ),
  entry(
    "kanban-board",
    "Kanban",
    "Diagramas",
    "Columnas con límite WIP.",
    "kanban-board.tsx",
  ),
  entry(
    "timeline-chart",
    "Línea de tiempo",
    "Diagramas",
    "Hitos alternados.",
    "timeline-chart.tsx",
  ),
  entry(
    "tree-view",
    "Árbol",
    "Diagramas",
    "Vista anidada con details.",
    "tree-view.tsx",
  ),
  entry(
    "network-graph",
    "Red",
    "Diagramas",
    "Grafo con fuerzas deterministas.",
    "network-graph.tsx",
  ),
  entry(
    "network-topology",
    "Topología",
    "Diagramas",
    "Roles con estado de enlace.",
    "network-topology.tsx",
  ),
  entry(
    "venn-diagram",
    "Venn",
    "Diagramas",
    "Intersecciones de 2 o 3 conjuntos.",
    "venn-diagram.tsx",
  ),
  entry(
    "wardley-map",
    "Mapa Wardley",
    "Diagramas",
    "Cadena de valor vs evolución.",
    "wardley-map.tsx",
  ),
  entry(
    "gantt-chart",
    "Gantt",
    "Diagramas",
    "Tareas en el tiempo con avance.",
    "gantt-chart.tsx",
  ),
  entry(
    "chart-legend",
    "Leyenda",
    "Utilidades",
    "Leyenda HTML SSR.",
    "legend.tsx",
  ),
  entry(
    "chart-empty",
    "Vacío",
    "Utilidades",
    "Estado homogéneo sin datos.",
    "empty.tsx",
  ),
  entry(
    "tooltip-portal",
    "Tooltip portal",
    "Utilidades",
    "Tooltip rico, único cliente.",
    "tooltip-portal.tsx",
  ),
];

export const DEMO_COUNT = DEMOS.length;

export const DEMO_SLUGS = DEMOS.map((d) => d.slug);

export function getDemo(slug: string): DemoEntry | undefined {
  return DEMOS.find((d) => d.slug === slug);
}

/** Carga perezosa por ruta (cada página solo empaqueta su demo). */
export function loadDemo(slug: string): Promise<{ default: ComponentType }> {
  switch (slug) {
    case "arc-diagram":
      return import("./arc-diagram");
    case "architecture-diagram":
      return import("./architecture-diagram");
    case "area-chart":
      return import("./area-chart");
    case "bar-chart":
      return import("./bar-chart");
    case "box-plot":
      return import("./box-plot");
    case "bullet-chart":
      return import("./bullet-chart");
    case "calendar-heatmap":
      return import("./calendar-heatmap");
    case "chart-empty":
      return import("./chart-empty");
    case "chart-legend":
      return import("./chart-legend");
    case "class-diagram":
      return import("./class-diagram");
    case "diverging-bar":
      return import("./diverging-bar");
    case "donut-chart":
      return import("./donut-chart");
    case "er-diagram":
      return import("./er-diagram");
    case "flow-chart":
      return import("./flow-chart");
    case "funnel-chart":
      return import("./funnel-chart");
    case "gantt-chart":
      return import("./gantt-chart");
    case "gauge-chart":
      return import("./gauge-chart");
    case "histogram":
      return import("./histogram");
    case "horizontal-bar-chart":
      return import("./horizontal-bar-chart");
    case "kanban-board":
      return import("./kanban-board");
    case "line-chart":
      return import("./line-chart");
    case "lollipop-chart":
      return import("./lollipop-chart");
    case "matrix-heatmap":
      return import("./matrix-heatmap");
    case "mindmap-diagram":
      return import("./mindmap-diagram");
    case "network-graph":
      return import("./network-graph");
    case "network-topology":
      return import("./network-topology");
    case "org-chart":
      return import("./org-chart");
    case "pareto-chart":
      return import("./pareto-chart");
    case "pie-chart":
      return import("./pie-chart");
    case "progress-list":
      return import("./progress-list");
    case "pyramid-chart":
      return import("./pyramid-chart");
    case "quadrant-chart":
      return import("./quadrant-chart");
    case "radar-chart":
      return import("./radar-chart");
    case "radial-progress":
      return import("./radial-progress");
    case "sankey-diagram":
      return import("./sankey-diagram");
    case "scatter-plot":
      return import("./scatter-plot");
    case "sequence-diagram":
      return import("./sequence-diagram");
    case "sparkline":
      return import("./sparkline");
    case "stacked-bar":
      return import("./stacked-bar");
    case "state-diagram":
      return import("./state-diagram");
    case "streamgraph":
      return import("./streamgraph");
    case "sunburst-chart":
      return import("./sunburst-chart");
    case "timeline-chart":
      return import("./timeline-chart");
    case "tooltip-portal":
      return import("./tooltip-portal");
    case "tree-view":
      return import("./tree-view");
    case "treemap-chart":
      return import("./treemap-chart");
    case "usecase-diagram":
      return import("./usecase-diagram");
    case "venn-diagram":
      return import("./venn-diagram");
    case "vertical-stacked-bar":
      return import("./vertical-stacked-bar");
    case "waffle-chart":
      return import("./waffle-chart");
    case "wardley-map":
      return import("./wardley-map");
    case "waterfall-chart":
      return import("./waterfall-chart");
    default:
      return import("./bar-chart");
  }
}
