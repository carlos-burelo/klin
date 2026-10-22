/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Serie del isotipo (valor absoluto; pictograma siempre círculo). */
export type IsotypeDatum = {
  label: string;
  value: number;
  color?: string;
};

/** Props de IsotypeChart. */
export type IsotypeChartProps = {
  series: IsotypeDatum[];
  /** Valor que representa cada pictograma. */
  unit: number;
  ariaLabel: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  /** Pictogramas por fila (se ajusta al ancho disponible). */
  maxPerRow?: number;
  /** Muestra la etiqueta de cada fila. */
  showLabels?: boolean;
  /** Muestra el conteo formateado de cada fila. */
  showCounts?: boolean;
  /** Orden por valor (`none` respeta el orden de entrada). */
  sortBy?: "none" | "asc" | "desc";
  /** Tope de filas (SSR acotado). */
  maxItems?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
