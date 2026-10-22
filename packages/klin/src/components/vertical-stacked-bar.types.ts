/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";
import type { ChartSeries } from "../core/series";

/** Props de VerticalStackedBar. */
export type VerticalStackedBarProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  /** Formato de las etiquetas de valor (por defecto el del eje). En modo percent las etiquetas muestran %. */
  formatValues?: ValueFormatter;
  normalize?: boolean;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
  /** Radio de esquina de la columna apilada (hoy clip fijo). */
  barRadius?: number;
  /** Etiqueta de valor dentro de cada segmento (si cabe). */
  showValues?: boolean;
  /** Ticks del grid horizontal. */
  gridTicks?: number;
  /** Orden de grupos por total (suma de series). */
  sortGroups?: "none" | "asc" | "desc";
  /** Prefijo de `defs`/`clipPath` (multi-instancia); por defecto useId. */
  id?: string;
};
