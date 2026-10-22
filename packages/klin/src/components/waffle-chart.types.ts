/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Parte del waffle (etiqueta, valor 0–100 y color opcional). */
export type WafflePart = {
  label: string;
  /** 0–100 (se normaliza si la suma difiere). */
  value: number;
  color?: string;
};

/** Props del waffle SSR (100 cuadros 10×10). */
export type WaffleChartProps = {
  parts: WafflePart[];
  ariaLabel: string;
  size?: number;
  /**
   * Columnas de la retícula (las 100 celdas se reparten en filas).
   * @default 10
   */
  columns?: number;
  /**
   * Separación entre celdas en px.
   * @default 3
   */
  gap?: number;
  /**
   * Radio de esquina de la celda (por defecto BAR_RADIUS).
   * @default BAR_RADIUS
   */
  cellRadius?: number;
  format?: ValueFormatter;
  locale?: string;
  /**
   * Color por parte. Si retorna `undefined` se usa el color de serie.
   * Se respeta `part.color` primero.
   */
  itemColor?: (part: WafflePart, index: number) => string | undefined;
  showLegend?: boolean;
  /**
   * Muestra el valor de cada parte en la leyenda.
   * @default true
   */
  showLegendValues?: boolean;
  /**
   * Color de las celdas sobrantes de la retícula (cuando `columns`
   * no divide 100). Si se omite no se pintan (comportamiento actual).
   */
  emptyColor?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
