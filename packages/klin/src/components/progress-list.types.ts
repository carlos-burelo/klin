/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Fila de progreso (etiqueta, valor, total y detalle opcionales). */
export type ProgressRow = {
  label: string;
  value: number;
  total?: number;
  detail?: string;
};

/** Estado de umbral de una fila (pct de 0 a 100). */
export type ProgressStatus = "ok" | "warn" | "bad";

/** Orden de la lista (por defecto orden de entrada). */
export type ProgressSortBy = "label" | "value" | "none";

/** Props de la lista de medidores lineales SSR. */
export type ProgressListProps = {
  rows: ProgressRow[];
  ariaLabel: string;
  /**
   * Grosor de la barra.
   * @default "md"
   */
  barHeight?: "sm" | "md";
  /**
   * Muestra el % junto al valor.
   * @default true
   */
  showPercent?: boolean;
  /**
   * Color de la barra por umbral (recibe el pct de 0 a 100).
   * Por defecto, el color de serie.
   * @default undefined
   */
  status?: (pct: number) => ProgressStatus;
  /** Orden de las filas (por defecto orden de entrada). */
  sortBy?: ProgressSortBy;
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
