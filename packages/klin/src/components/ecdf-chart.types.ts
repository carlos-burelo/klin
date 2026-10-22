/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Grupo de la ECDF (etiqueta, muestra y color opcional). */
export type EcdfGroup = {
  label: string;
  values: number[];
  color?: string;
};

/** Props de ECDFChart. */
export type ECDFChartProps = {
  groups: EcdfGroup[];
  ariaLabel: string;
  height?: number;
  formatX?: ValueFormatter;
  /** Formato del eje Y, probabilidad 0–1 (por defecto % entero). */
  formatY?: ValueFormatter;
  locale?: string;
  /** Marca cada escalón con punto y tip. */
  showPoints?: boolean;
  /** Ticks del grid (por defecto GRID_TICKS). */
  gridTicks?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /** Línea de mediana en p=0.5 (probabilidad 50 %). */
  showMedian?: boolean;
  /** Mínimo fijo del dominio X (indefinido = automático). */
  xMin?: number;
  /** Máximo fijo del dominio X (indefinido = automático). */
  xMax?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};
