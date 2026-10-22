/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Estrategia de cubetas del histograma (`count` = conteo vía `bins`). */
export type HistogramBinStrategy =
  | "count"
  | "sturges"
  | "scott"
  | "freedman"
  | "width";

/** Props de Histogram. */
export type HistogramProps = {
  values: number[];
  ariaLabel: string;
  bins?: number;
  height?: number;
  format?: ValueFormatter;
  color?: string;
  locale?: string;
  /** Dibuja la línea de la media con su valor. */
  showMean?: boolean;
  /** Dibuja la línea de la mediana con su valor. */
  showMedian?: boolean;
  /** Curva de densidad KDE sobre las cubetas (reusa la KDE de ViolinPlot). */
  showCurve?: boolean;
  /** Ancho de banda KDE (`auto` = Silverman). */
  bandwidth?: "auto" | number;
  /** Recorta los valores a [mínimo, máximo] (outliers fuera). */
  domain?: [number, number];
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  annotations?: ValueAnnotation[];
  /** Ticks del grid horizontal (por defecto GRID_TICKS). */
  gridTicks?: number;
  /**
   * Estrategia de cubetas (por defecto `count`: conteo vía `bins`).
   * `width` interpreta `bins` como ancho de cubeta deseado.
   */
  binStrategy?: HistogramBinStrategy;
  /** Eje Y en % en vez de conteos (por defecto conteos). */
  normalize?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};
