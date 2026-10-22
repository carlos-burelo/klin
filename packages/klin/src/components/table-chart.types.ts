/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Columna numérica de la tabla (clave + etiqueta + alineación). */
export type TableColumn = {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
};

/** Fila de la tabla (etiqueta + valores por clave de columna). */
export type TableRow = {
  label: string;
  values: Record<string, number>;
};

/** Barra inline por columna (clave + etiqueta de tip + máximo explícito). */
export type TableBar = {
  key: string;
  label?: string;
  max?: number;
};

/** Orden de la tabla por columna (por defecto orden de entrada). */
export type TableSortBy = {
  key: string;
  dir?: "asc" | "desc";
};

/** Props de la tabla-chart (HTML puro, sin SVG). */
export type TableChartProps = {
  columns: TableColumn[];
  rows: TableRow[];
  bars?: TableBar[];
  ariaLabel: string;
  format?: ValueFormatter;
  locale?: string;
  /** Ordena filas por columna (por defecto orden de entrada). */
  sortBy?: TableSortBy;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  /**
   * Altura de la barra inline.
   * @default "md"
   */
  barHeight?: "sm" | "md";
  /**
   * Muestra el % junto al valor.
   * @default true
   */
  showPercent?: boolean;
  /**
   * Color de barra por umbral de % (si no, color de serie).
   * @default undefined
   */
  status?: (pct: number) => "ok" | "warn" | "bad";
  /**
   * Densidad de filas.
   * @default "comfortable"
   */
  density?: "comfortable" | "compact";
  /**
   * Tope de filas (SSR acotado).
   * @default MAX_TABLE_ROWS
   */
  maxRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

export type TableCellLayout = {
  key: string;
  label: string;
  align: "left" | "center" | "right";
  value: number;
  bar: { pct: number; tip: string; color: string } | null;
};

export type TableRowLayout = {
  label: string;
  cells: TableCellLayout[];
};

export type TableLayout = {
  columns: TableColumn[];
  rows: TableRowLayout[];
};
