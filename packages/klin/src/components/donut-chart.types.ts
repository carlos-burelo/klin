/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Dato de dona/torta (etiqueta, valor y color opcional). */
export type DonutDatum = {
  label: string;
  value: number;
  color?: string;
};

/** Contenido de etiqueta de rebanada: dentro (`innerLabels`) o fuera (`outerLabels`). */
export type DonutLabelMode = "none" | "percent" | "value" | "label";

/** Props de la dona SSR (arcos, total al centro y leyenda). */
export type DonutChartProps = {
  data: DonutDatum[];
  ariaLabel: string;
  size?: number;
  thickness?: number;
  format?: ValueFormatter;
  locale?: string;
  /**
   * Color por rebanada. Si retorna `undefined` se usa el color de serie.
   * Se respeta `datum.color` primero.
   */
  itemColor?: (datum: DonutDatum, index: number) => string | undefined;
  totalLabel?: string;
  showTotal?: boolean;
  /**
   * Ángulo inicial de la primera rebanada en radianes (0 = arriba).
   * @default 0
   */
  startAngle?: number;
  /**
   * Separación entre rebanadas en radianes.
   * @default 0
   */
  padAngle?: number;
  /**
   * Ordena las rebanadas de mayor a menor (por defecto respeta la entrada).
   * @default false
   */
  sortSlices?: boolean;
  /**
   * Radio de esquina de los arcos (0 = bordes rectos).
   * @default 0
   */
  cornerRadius?: number;
  /**
   * Etiqueta dentro de la rebanada: contenido solo si el arco es grande.
   * @default "none"
   */
  innerLabels?: DonutLabelMode;
  /**
   * Etiqueta fuera de la rebanada con conector: contenido anclado al lado.
   * @default "none"
   */
  outerLabels?: DonutLabelMode;
  showLegend?: boolean;
  /**
   * Agrega el valor a cada item de la leyenda (comportamiento actual).
   * @default true
   */
  showLegendValues?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/** Props de la torta SSR (dona sin agujero). */
export type PieChartProps = {
  data: DonutDatum[];
  ariaLabel: string;
  size?: number;
  format?: ValueFormatter;
  locale?: string;
  /**
   * Color por rebanada. Si retorna `undefined` se usa el color de serie.
   * Se respeta `datum.color` primero.
   */
  itemColor?: (datum: DonutDatum, index: number) => string | undefined;
  totalLabel?: string;
  /** Total al centro (sin agujero colisiona: con píldora de fondo; por defecto oculto). */
  showTotal?: boolean;
  /**
   * Ángulo inicial de la primera rebanada en radianes (0 = arriba).
   * @default 0
   */
  startAngle?: number;
  /**
   * Separación entre rebanadas en radianes.
   * @default 0
   */
  padAngle?: number;
  /**
   * Ordena las rebanadas de mayor a menor (por defecto respeta la entrada).
   * @default false
   */
  sortSlices?: boolean;
  /**
   * Radio de esquina de los arcos (0 = bordes rectos).
   * @default 0
   */
  cornerRadius?: number;
  /**
   * Etiqueta dentro de la rebanada: contenido solo si el arco es grande.
   * @default "none"
   */
  innerLabels?: DonutLabelMode;
  /**
   * Etiqueta fuera de la rebanada con conector: contenido anclado al lado.
   * @default "none"
   */
  outerLabels?: DonutLabelMode;
  showLegend?: boolean;
  /**
   * Agrega el valor a cada item de la leyenda (comportamiento actual).
   * @default true
   */
  showLegendValues?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
