/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";
import type { ValueScaleKind } from "../core/scale";

export type ScatterPoint = {
  x: number;
  y: number;
  label?: string;
};

/** Props de ScatterPlot. */
export type ScatterPlotProps = {
  points: ScatterPoint[];
  ariaLabel: string;
  xLabel?: string;
  yLabel?: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  /**
   * Color por punto. Si retorna `undefined` se usa el color base (`color`).
   */
  itemColor?: (point: ScatterPoint, index: number) => string | undefined;
  /** Dibuja una cruz en las medias de X e Y (cuadrantes). */
  quadrants?: boolean;
  /**
   * Escala del eje X (`log` para magnitudes; no-positivos se fijan al piso
   * del dominio en geometría, el tip conserva el valor crudo).
   */
  xScale?: ValueScaleKind;
  /**
   * Escala del eje Y (`log` para magnitudes; no-positivos se fijan al piso
   * del dominio en geometría, el tip conserva el valor crudo).
   */
  yScale?: ValueScaleKind;
  /** Líneas/bandas de referencia sobre el eje Y (patrón AnnotationLayer). */
  annotations?: ValueAnnotation[];
  /** Ticks del grid horizontal (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Radio de los puntos (por defecto POINT_RADIUS_SCATTER). */
  pointRadius?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
