/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

export type BoxGroup = {
  label: string;
  values: number[];
  color?: string;
};

/** Props de BoxPlot. */
export type BoxPlotProps = {
  groups: BoxGroup[];
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Muestra los puntos atípicos fuera de los bigotes. */
  showOutliers?: boolean;
  /** Bigotes por rango intercuartílico (1.5) o por mínimo/máximo reales. */
  whisker?: 1.5 | "minmax";
  /** Muestra el tamaño de muestra (`n`) bajo cada etiqueta. */
  showSampleSize?: boolean;
  /** Dibuja una muesca en la mediana. */
  notch?: boolean;
  annotations?: ValueAnnotation[];
  /** Ticks del grid horizontal (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Mínimo fijo del dominio Y (indefinido = automático con cero). */
  yMin?: number;
  /** Máximo fijo del dominio Y (indefinido = automático). */
  yMax?: number;
  /** Marca la media de cada grupo con un rombo. */
  showMean?: boolean;
  /** Radio de los puntos atípicos (por defecto OUTLIER_RADIUS). */
  pointRadius?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};
