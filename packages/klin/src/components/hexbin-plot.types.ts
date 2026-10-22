/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Punto del agregado hexagonal (coordenadas de datos). */
export type HexPoint = {
  x: number;
  y: number;
};

/** Celda hexagonal agregada (centro en píxeles + conteo). */
export type HexCell = {
  x: number;
  y: number;
  count: number;
};

/** Props de HexbinPlot. */
export type HexbinPlotProps = {
  points: HexPoint[];
  ariaLabel: string;
  radius?: number;
  height?: number;
  formatValue?: ValueFormatter;
  locale?: string;
  /** Color base de las celdas (por defecto serie 0). */
  color?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Muestra etiquetas de ticks de los ejes. */
  showLabels?: boolean;
  /** Muestra el conteo de puntos en el tip de cada celda. */
  showCounts?: boolean;
  /** Ticks del grid de los ejes. */
  gridTicks?: number;
  /** Tope de puntos de la muestra (SSR acotado). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};
