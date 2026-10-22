/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Segmento apilado (clave, etiqueta y color opcional). */
export type StackSegment = {
  key: string;
  label: string;
  color?: string;
};

/** Fila apilada (etiqueta, detalle y valores por segmento). */
export type StackRow = {
  label: string;
  detail?: string;
  values: Record<string, number>;
};

/** Props de barras apiladas SSR (progreso y comparativas). */
export type StackedBarProps = {
  rows: StackRow[];
  segments: StackSegment[];
  ariaLabel: string;
  format?: ValueFormatter;
  /** Formato de las etiquetas de valor (por defecto el del eje). En modo percent las etiquetas muestran %. */
  formatValues?: ValueFormatter;
  /** Clave del segmento para el % (por defecto, el primero). */
  percentOf?: string;
  locale?: string;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  /**
   * Escala de la pista: `global` compara filas entre sí (tope común),
   * `row` llena cada fila al 100 % de su propio total.
   */
  scale?: "row" | "global";
  /** Insignia con el % del segmento principal (hoy siempre visible). */
  showPercent?: boolean;
  /** Etiqueta con el total absoluto de la fila. */
  showValues?: boolean;
  /** Alto de la pista de barra. */
  barHeight?: number;
  /** Alto fijo del contenedor (por defecto, automático según filas). */
  height?: number;
  /** Prefijo de `clipPath` (multi-instancia); por defecto useId. */
  id?: string;
};
