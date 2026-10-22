/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";
import type { ValueScaleKind } from "../core/scale";
import type { ChartSeries } from "../core/series";

/** Props de AreaChart. */
export type AreaChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  stacked?: boolean;
  /** Apila a 100 % (implica `stacked`). */
  normalize?: boolean;
  /** monotone (suave), linear (recta) o step (escalón). */
  curve?: "monotone" | "linear" | "step";
  /** Muestra los puntos sobre cada dato (series densas: ocultar). */
  showPoints?: boolean;
  /**
   * Une vecinos saltando nulos (usa `defined` de d3-shape en los paths;
   * sin puntos en nulos). Por defecto `false` (nulos como 0, intacto).
   */
  connectNulls?: boolean;
  /** Opacidad del relleno del área. */
  fillOpacity?: number;
  /** Mínimo fijo del eje Y (se ignora con `normalize`). */
  yMin?: number;
  /** Máximo fijo del eje Y (se ignora con `normalize`). */
  yMax?: number;
  /** Ticks del grid Y (por defecto GRID_TICKS). */
  gridTicks?: number;
  /**
   * Escala del eje Y (`log` para magnitudes; ignora no-positivos en
   * geometría, el tip conserva el valor crudo). Se ignora con `normalize`
   * y con `yMin`/`yMax` (dominio log desde los datos).
   */
  yScale?: ValueScaleKind;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
};
