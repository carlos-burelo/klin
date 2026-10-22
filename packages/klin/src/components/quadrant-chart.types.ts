/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Punto del cuadrante (x/y en 0–100 con etiqueta). */
export type QuadrantPoint = {
  x: number;
  y: number;
  label: string;
  /** Color del punto (por defecto `primary` del tema). */
  color?: string;
};

/** Props de cuadrantes SSR (matriz 2×2 con puntos). */
export type QuadrantChartProps = {
  points: QuadrantPoint[];
  ariaLabel: string;
  xLabel?: string;
  yLabel?: string;
  /** [arriba-izq, arriba-der, abajo-izq, abajo-der]. */
  quads?: [string, string, string, string];
  /** Muestra el nº de puntos junto a cada etiqueta de cuadrante. */
  showCounts?: boolean;
  /** Posición de la cruz en escala 0–100 (por defecto centrada, como hasta ahora). */
  thresholds?: { x: number; y: number };
  /** Formato de los valores del tip (por defecto `formatDefault` con locale). */
  format?: ValueFormatter;
  /** Alto del lienzo (por defecto 460). */
  height?: number;
  locale?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
