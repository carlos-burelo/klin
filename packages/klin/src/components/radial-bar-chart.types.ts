/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Serie radial (etiqueta, valor, máximo opcional y color opcional). */
export type RadialBarDatum = {
  label: string;
  value: number;
  max?: number;
  color?: string;
};

/** Props de barras radiales SSR (anillos concéntricos 0–max). */
export type RadialBarChartProps = {
  series: RadialBarDatum[];
  ariaLabel: string;
  height?: number;
  formatValue?: ValueFormatter;
  locale?: string;
  /** Muestra las etiquetas de serie a la izquierda. */
  showLabels?: boolean;
  /** Muestra los valores tabulares a la izquierda. */
  showValues?: boolean;
  /** Ordena los anillos por fracción descendente (por defecto respeta la entrada). */
  sortSlices?: boolean;
  /** Ángulo inicial de cada arco (radianes). */
  startAngle?: number;
  /** Radio de esquina del arco de valor. */
  cornerRadius?: number;
  /** Muestra la suma de valores al centro de los anillos. */
  showTotal?: boolean;
  /** Etiqueta bajo el total central. */
  totalLabel?: string;
  /**
   * Color por anillo. Si retorna `undefined` se usa el color de serie.
   * Se respeta `datum.color` primero.
   */
  itemColor?: (datum: RadialBarDatum, index: number) => string | undefined;
  /**
   * Color de la pista de vuelta completa.
   * @default CHART_TOKEN.track
   */
  trackColor?: string;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
