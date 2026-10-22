/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Serie del radar (etiqueta, valores por eje y color opcional). */
export type RadarSeries = {
  label: string;
  values: number[];
  color?: string;
};

/** Props del radar SSR para perfiles multivariados. */
export type RadarChartProps = {
  axes: string[];
  series: RadarSeries[];
  ariaLabel: string;
  size?: number;
  levels?: number;
  maxValue?: number;
  /**
   * Opacidad del relleno: un valor para todas o uno por serie.
   * @default 0.18
   */
  fillOpacity?: number | number[];
  /**
   * Muestra los vértices de cada serie.
   * @default true
   */
  showVertices?: boolean;
  /**
   * Escala radial (sqrt comprime los valores altos).
   * @default "linear"
   */
  scale?: "linear" | "sqrt";
  /**
   * Forma de la retícula de niveles.
   * @default "polygon"
   */
  gridShape?: "polygon" | "circle";
  /**
   * Grosor de línea de cada serie.
   * @default LINE_WIDTH
   */
  strokeWidth?: number;
  /**
   * Radio de los vértices de cada serie.
   * @default POINT_RADIUS_RADAR
   */
  pointRadius?: number;
  format?: ValueFormatter;
  locale?: string;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
