/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Serie de la cresta (etiqueta, muestra y color opcional). */
export type RidgelineSeries = {
  label: string;
  values: number[];
  color?: string;
};

/** Orden de las filas por pico de densidad (none conserva el orden de entrada). */
export type RidgelineSort = "none" | "asc" | "desc";

/** Props de RidgelinePlot. */
export type RidgelinePlotProps = {
  series: RidgelineSeries[];
  ariaLabel: string;
  height?: number;
  overlap?: number;
  formatX?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Ticks del eje X común (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Orden de las filas por su pico de densidad. */
  sortGroups?: RidgelineSort;
  /** Radio del punto del pico (por defecto POINT_RADIUS). */
  pointRadius?: number;
  /** Muestra el tamaño de muestra (n) junto a cada etiqueta. */
  showSampleSize?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};
