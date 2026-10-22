/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";
import type { ChartSeries } from "../core/series";

/** Props del marimekko SSR (ancho ∝ widthKey, apilado 100 %). */
export type MarimekkoChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  widthKey: string;
  series: ChartSeries[];
  ariaLabel: string;
  height?: number;
  formatX?: ValueFormatter;
  /** Formato de los valores de segmento (por defecto igual que el eje). */
  format?: ValueFormatter;
  locale?: string;
  /** Muestra las etiquetas de grupo bajo cada columna. */
  showLabels?: boolean;
  /** Muestra el % dentro de cada segmento que quepa. */
  showValues?: boolean;
  /** Agrega el valor crudo junto al % dentro del segmento. */
  showCounts?: boolean;
  /** Ordena las columnas por ancho descendente (por defecto respeta la entrada). */
  sortGroups?: boolean;
  /** % mínimo de columna para rotular dentro del segmento. */
  minLabelPct?: number;
  /** Tope de grupos (por defecto `DEFAULT_MAX_ROWS`). */
  maxItems?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};
