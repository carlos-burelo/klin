/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";
import type { ValueScaleKind } from "../core/scale";
import type { ChartSeries } from "../core/series";

/** Props de LineChart. */
export type LineChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  /** monotone (suave), linear (recta) o step (escalón). */
  curve?: "monotone" | "linear" | "step";
  /** Muestra los puntos sobre cada dato (series densas: ocultar). */
  showPoints?: boolean;
  /** Rellena el área bajo cada línea. */
  showArea?: boolean;
  /**
   * Une vecinos saltando nulos (usa `defined` de d3-shape en el path;
   * sin puntos en nulos). Por defecto `false` (nulos como 0, intacto).
   */
  connectNulls?: boolean;
  /** Mínimo fijo del eje Y (por defecto se deriva de los datos). */
  yMin?: number;
  /** Máximo fijo del eje Y (por defecto se deriva de los datos). */
  yMax?: number;
  /** Ticks del grid Y (por defecto GRID_TICKS). */
  gridTicks?: number;
  /**
   * Escala del eje Y (`log` para magnitudes; ignora no-positivos en
   * geometría, el tip conserva el valor crudo). Se ignora `yMin`/`yMax`
   * (dominio log desde los datos).
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
