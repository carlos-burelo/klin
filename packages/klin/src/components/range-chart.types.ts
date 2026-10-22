/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Grupo de rango: intervalo low–high con valor opcional. */
export type RangeGroup = {
  label: string;
  low: number;
  high: number;
  value?: number;
  color?: string;
};

/** Orden de los grupos por valor (none conserva el orden de entrada). */
export type RangeSort = "none" | "asc" | "desc";

/** Props de RangeChart. */
export type RangeChartProps = {
  groups: RangeGroup[];
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /** Mínimo fijo del dominio Y (indefinido = automático con cero). */
  yMin?: number;
  /** Máximo fijo del dominio Y (indefinido = automático). */
  yMax?: number;
  /** Ticks del grid horizontal (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Muestra el valor junto a cada punto. */
  showValues?: boolean;
  /** Muestra el punto de valor (o medio) sobre el rango. */
  showPoints?: boolean;
  /** Orden de los grupos por su valor. */
  sortGroups?: RangeSort;
  /** Radio del punto de valor (por defecto POINT_RADIUS). */
  pointRadius?: number;
  /** Ancho de los remates (por defecto automático hasta CAP_MAX_WIDTH). */
  capWidth?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};
