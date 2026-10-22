/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

export type BumpSeries = {
  label: string;
  ranks: number[];
  color?: string;
};

/** Props de BumpChart. */
export type BumpChartProps = {
  periods: string[];
  series: BumpSeries[];
  ariaLabel: string;
  height?: number;
  locale?: string;
  /** Formato de los puestos (por defecto locale). */
  formatRank?: ValueFormatter;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  /** Muestra la leyenda de series (por defecto oculta: ya hay etiquetas laterales). */
  showLegend?: boolean;
  /** Ticks del grid de puestos (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Muestra los puntos de cada periodo. */
  showPoints?: boolean;
  /** Muestra el puesto sobre cada punto. */
  showValues?: boolean;
  /** Radio de los puntos (por defecto POINT_RADIUS). */
  pointRadius?: number;
  /** Conserva las N series con mejor puesto final (resto fuera). */
  topN?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};
