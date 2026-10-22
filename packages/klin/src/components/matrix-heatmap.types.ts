/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Props del mapa de calor matricial SSR (filas × columnas). */
export type MatrixHeatmapProps = {
  rows: string[];
  cols: string[];
  /** values[fila][columna]. */
  values: number[][];
  ariaLabel: string;
  /** Control del texto de valor en celda (`auto` según tamaño). */
  showValues?: "auto" | "always" | "never";
  /** Etiqueta de celdas sin dato (`NaN`/ausente). */
  missingLabel?: string;
  /** Dominio explícito de la escala (por defecto auto: 0 → tope). */
  min?: number;
  max?: number;
  /** Muestra la leyenda min → max (por defecto oculta). */
  showLegend?: boolean;
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
