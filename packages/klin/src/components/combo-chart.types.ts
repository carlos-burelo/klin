/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

import type { ChartSeries } from "../core/series";

/** Props de ComboChart. */
export type ComboChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  /** Series de barras (agrupadas, eje Y izquierdo). */
  bars: ChartSeries[];
  /** Series de línea (puntos en el centro de cada grupo). */
  lines: ChartSeries[];
  /** Las líneas usan escala propia con ticks a la derecha. */
  yAxisRight?: boolean;
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  /** monotone (suave), linear (recta) o step (escalón). */
  curve?: "monotone" | "linear" | "step";
  /** Muestra los puntos sobre cada dato de línea. */
  showPoints?: boolean;
  /** Etiqueta de valor sobre cada barra. */
  showValues?: boolean;
  /** Orden de grupos por total (suma de barras + líneas). */
  sortGroups?: "none" | "asc" | "desc";
  /** Radio de esquina de barra (`0` para estilo denso). */
  barRadius?: number;
  /** Mínimo fijo del eje Y izquierdo (barras). */
  yMin?: number;
  /** Máximo fijo del eje Y izquierdo (barras). */
  yMax?: number;
  /** Mínimo fijo del eje Y derecho (series con `axis: "right"`). */
  yMinR?: number;
  /** Máximo fijo del eje Y derecho (series con `axis: "right"`). */
  yMaxR?: number;
  /** Formato de ticks del eje Y derecho (por defecto `formatY`). */
  formatYR?: ValueFormatter;
  /** Ticks del grid Y (por defecto GRID_TICKS). */
  gridTicks?: number;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /**
   * Override de color por barra (p. ej. una serie con un color por categoría).
   * Devuelve un color (token/var) o undefined para usar el de la serie.
   */
  barColor?: (
    datum: Record<string, string | number>,
    datumIndex: number,
    serie: ChartSeries,
    serieIndex: number,
  ) => string | undefined;
  emptyTitle?: string;
  emptyDescription?: string;
};
