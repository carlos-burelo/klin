/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Punto de densidad (coordenadas de datos + etiqueta opcional). */
export type DensityPoint = {
  x: number;
  y: number;
  label?: string;
};

/** Punto limpio posicionado en píxeles del área interna. */
export type PositionedDensityPoint = DensityPoint & {
  px: number;
  py: number;
};

/** Props de DensityContourPlot. */
export type DensityContourPlotProps = {
  points: DensityPoint[];
  ariaLabel: string;
  bandwidth?: number;
  thresholds?: number;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  /** Color base de contornos y puntos (por defecto serie 0). */
  color?: string;
  /** Muestra los puntos de la muestra (por defecto sí). */
  showPoints?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Muestra etiquetas de ticks de los ejes. */
  showLabels?: boolean;
  /** Ticks del grid de los ejes. */
  gridTicks?: number;
  /** Tope de puntos de la muestra (SSR acotado). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};
