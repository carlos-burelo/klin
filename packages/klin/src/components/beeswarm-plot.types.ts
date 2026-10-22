/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

export type BeeswarmPoint = {
  value: number;
  label?: string;
  color?: string;
};

/** Props de BeeswarmPlot. */
export type BeeswarmPlotProps = {
  points: BeeswarmPoint[];
  ariaLabel: string;
  radius?: number;
  height?: number;
  formatX?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  /** Recorte fijo del dominio X [min, max] (indefinido = automático con cero). */
  domain?: [number, number];
  /** Ticks del eje X (por defecto BEESWARM_X_TICKS). */
  gridTicks?: number;
  /** Muestra el valor sobre cada punto. */
  showValues?: boolean;
  /** Muestra el tamaño de muestra (n) junto al eje. */
  showSampleSize?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export type PositionedBeeswarmPoint = BeeswarmPoint & {
  x: number;
  y: number;
};
