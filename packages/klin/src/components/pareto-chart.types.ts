/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Props de Pareto SSR (barras ordenadas + % acumulado). */
export type ParetoChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  color?: string;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /**
   * Conserva las N primeras causas y agrega el resto en "Otros".
   * @default undefined
   */
  topN?: number;
  /**
   * Línea de umbral sobre el % acumulado (80/20; `null` = sin línea).
   * @default 80
   */
  threshold?: number | null;
  /**
   * Muestra el % acumulado sobre cada punto.
   * @default false
   */
  showCumLabels?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};
