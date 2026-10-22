/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Orden de las filas por diferencia b−a (none conserva el orden de entrada). */
export type DumbbellSort = "none" | "asc" | "desc";

/** Props de DumbbellChart. */
export type DumbbellChartProps = {
  data: Array<Record<string, string | number>>;
  categoryKey: string;
  aKey: string;
  bKey: string;
  aLabel: string;
  bLabel: string;
  ariaLabel: string;
  height?: number;
  formatX?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /** Recorte fijo del dominio X [min, max] (indefinido = automático con cero). */
  domain?: [number, number];
  /** Ticks del grid vertical (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Muestra los valores junto a cada punto. */
  showValues?: boolean;
  /** Orden de las filas por diferencia entre b y a. */
  sortGroups?: DumbbellSort;
  /** Radio de los puntos (por defecto POINT_RADIUS_SCATTER). */
  pointRadius?: number;
  /** Color del lado `a` (por defecto chart1). */
  aColor?: string;
  /** Color del lado `b` (por defecto chart2). */
  bColor?: string;
  /** Rotula la diferencia b−a con el formato del eje. */
  showDiff?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};
