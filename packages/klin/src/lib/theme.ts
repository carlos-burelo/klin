/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 *
 * Tokens de la línea de estilo (una sola fuente; ver README).
 * Nada de hex ni números sueltos en los componentes: todo sale de aquí
 * o de una const local con nombre de intención.
 */

/** Ancho base del viewBox cartesiano. */
export const CHART_WIDTH = 640;
/** Ticks del grid por defecto. */
export const GRID_TICKS = 4;
/** Grosor del grid. */
export const GRID_WIDTH = 1;

/** Radio de barras/buckets/celdas/columnas. */
export const BAR_RADIUS = 4;
/** Ancho de línea de series. */
export const LINE_WIDTH = 2;
/** Radio de punto estándar (+borde fondo). */
export const POINT_RADIUS = 3.5;
export const POINT_BORDER = 1.5;
export const POINT_RADIUS_SCATTER = 4.5;
export const POINT_RADIUS_RADAR = 3;

/** Tipografía de ejes/ticks. */
export const TICK_FONT_SIZE = 11;
/** Separación etiqueta-eje y ajuste vertical de texto. */
export const TICK_GAP_PX = 8;
export const TICK_DY = 4;
/** Separación etiqueta-nodo y grosor de borde de nodo. */
export const LABEL_GAP_PX = 4;
export const NODE_BORDER_WIDTH = 2;
export const FONT_SEMIBOLD = 600;
/** Tipografía de etiqueta de arista. */
export const EDGE_LABEL_FONT_SIZE = 10;
/** Ancho aprox por carácter en EdgeLabel. */
export const EDGE_LABEL_CHAR_WIDTH = 6.5;
export const EDGE_LABEL_MIN_WIDTH = 28;
export const EDGE_LABEL_MAX_CHARS = 24;
export const EDGE_LABEL_PAD_X = 12;
export const EDGE_LABEL_HEIGHT = 18;
export const EDGE_LABEL_DY = 3.5;

/** Grosor de flecha de diagrama. */
export const EDGE_WIDTH = 1.5;
/** Alto mínimo visible de forma (px). */
export const MIN_SHAPE_PX = 1;
/** Alto de marca cero (px). */
export const ZERO_MARK_PX = 2;

/** Opacidades. */
export const AREA_FILL_OPACITY = 0.22;
export const LINK_OPACITY = 0.35;

/** Proporciones de measureText (mono vs sans). */
export const TEXT_MONO_RATIO = 0.6;
export const TEXT_SANS_RATIO = 0.58;

/** Tooltip portal. */
export const TOOLTIP_WIDTH = 240;
export const TOOLTIP_HEIGHT = 80;
export const TOOLTIP_OFFSET = 12;
export const TOOLTIP_MARGIN_PX = 8;

/** Tokens CSS del tema (nunca hex). Solo vars base del tema (shadcn):
 * `--foreground`, `--muted-*`, `--chart-1…5`, `--primary-*`, etc.
 * Nada de alias `--color-*`: Tailwind v4 (`@theme inline`) no los emite
 * como variables runtime y el SVG caería a negro. */
export const CHART_TOKEN = {
  border: "var(--border)",
  muted: "var(--muted-foreground)",
  foreground: "var(--foreground)",
  background: "var(--background)",
  track: "var(--muted)",
  accent: "var(--chart-2)",
  chart1: "var(--chart-1)",
  chart2: "var(--chart-2)",
  chart3: "var(--chart-3)",
  chart4: "var(--chart-4)",
  chart5: "var(--chart-5)",
  destructive: "var(--destructive)",
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  card: "var(--card)",
} as const;

/** Fuente monoespaciada del tema (con fallback). */
export const FONT_MONO = "var(--font-mono, monospace)";

/** Truncado de etiquetas de eje. */
export const LABEL_MAX_DEFAULT = 14;
/** Símbolos. */
export const ELLIPSIS = "…";
export const MISSING_VALUE = "—";

/** Radio de nodo de mapa/diagrama (cuadrante, Wardley). */
export const NODE_RADIUS = 9;
/** Opacidad de celda vacía en mapas de calor. */
export const EMPTY_CELL_OPACITY = 0.08;

/** Factor de porcentaje y círculo completo. */
export const PERCENT_FACTOR = 100;

/** Línea de referencia (anotación). */
export const ANNOTATION_DASH = "4 3";
export const ANNOTATION_WIDTH = 1.5;

/** Física de red determinista. */
export const NETWORK_SEED = 42;
export const NETWORK_TICKS = 300;
export const NETWORK_LINK_DISTANCE = 110;
export const NETWORK_CHARGE = -160;
export const NETWORK_COLLIDE = 30;
export const NETWORK_NODE_MIN_R = 8;
export const NETWORK_NODE_GROWTH = 1.5;
export const NETWORK_NODE_MAX_GROWTH = 8;

/** Sankey. */
export const SANKEY_NODE_WIDTH = 14;
export const SANKEY_NODE_PADDING = 14;

/** Ancho mínimo con scroll horizontal en diagramas anchos. */
export const DIAGRAM_MIN_SCROLL = 560;
