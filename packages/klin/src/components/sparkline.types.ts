/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

/** Props de la minigráfica SSR para celdas y KPIs. */
export type SparklineProps = {
  values: number[];
  ariaLabel: string;
  /**
   * Tipo de trazo: línea, área o barras (con BAR_RADIUS).
   * @default "line"
   */
  kind?: "line" | "area" | "bar";
  /**
   * Muestra el punto del último valor.
   * @default true
   */
  showLastDot?: boolean;
  /**
   * Marca los puntos mínimo y máximo.
   * @default false
   */
  showMinMax?: boolean;
  /**
   * Línea de meta en unidades de los valores (se omite si no es finita).
   * @default undefined
   */
  reference?: number;
  width?: number;
  height?: number;
  color?: string;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
