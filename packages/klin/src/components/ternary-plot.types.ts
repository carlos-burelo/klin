/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Punto ternario (a + b + c se normaliza a 1; suma <= 0 se filtra). */
export type TernaryPoint = {
  a: number;
  b: number;
  c: number;
  label?: string;
  color?: string;
};

/** Props de TernaryPlot. */
export type TernaryPlotProps = {
  points: TernaryPoint[];
  ariaLabel: string;
  aLabel?: string;
  bLabel?: string;
  cLabel?: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Muestra las etiquetas de vértices (A/B/C). */
  showLabels?: boolean;
  /** Niveles de rejilla por lado (por defecto GRID_TICKS). */
  gridLevels?: number;
  /** Tope de puntos (SSR acotado). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};
