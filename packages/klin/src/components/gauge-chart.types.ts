/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Tramo de color del velocímetro (en unidades de la escala). */
export type GaugeZone = {
  from: number;
  to: number;
  color: string;
};

/** Props del velocímetro SSR (semicírculo 0–100). */
export type GaugeChartProps = {
  /** Valor en unidades de la escala. */
  value: number;
  ariaLabel: string;
  label?: string;
  /**
   * Mínimo de la escala.
   * @default 0
   */
  min?: number;
  /**
   * Máximo de la escala (si no supera a `min`, se usa `min + 100`).
   * @default 100
   */
  max?: number;
  /**
   * Muestra aguja en lugar del arco de valor.
   * @default false
   */
  showNeedle?: boolean;
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  /**
   * Tramos de color sobre la escala (de `min` a `max`).
   * Si se omite, pista de un solo color (comportamiento actual).
   */
  zones?: GaugeZone[];
  /**
   * Marcas de escala equidistantes (incluye extremos).
   * Si se omite, las fracciones clásicas (comportamiento actual).
   */
  tickCount?: number;
  format?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  /** Descripción del estado vacío. */
  emptyDescription?: string;
};
