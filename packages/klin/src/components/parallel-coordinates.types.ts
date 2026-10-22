/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Dimensión del paralelo (clave + etiqueta opcional). */
export type ParallelAxis = {
  key: string;
  label?: string;
};

/** Fila del paralelo (etiqueta + valor por dimensión + color opcional). */
export type ParallelRow = {
  label?: string;
  values: Record<string, number>;
  color?: string;
};

/** Props de ParallelCoordinates. */
export type ParallelCoordinatesProps = {
  axes: ParallelAxis[];
  rows: ParallelRow[];
  height?: number;
  ariaLabel: string;
  format?: ValueFormatter;
  locale?: string;
  /** Marca cada cruce eje-fila con punto y tip. */
  showPoints?: boolean;
  /** Tope de filas (por defecto `DEFAULT_MAX_ROWS`). */
  maxItems?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};
