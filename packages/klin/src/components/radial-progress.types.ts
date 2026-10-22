/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Props del progreso radial SSR (anillo 0–100 %). */
export type RadialProgressProps = {
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
   * Estilo de la pista: anillo continuo o segmentos.
   * @default "full"
   */
  trackStyle?: "full" | "ticks";
  /**
   * Ángulo inicial del anillo en radianes (0 = arriba, sentido horario).
   * @default START (-Math.PI / 2)
   */
  startAngle?: number;
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  format?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  /** Descripción del estado vacío. */
  emptyDescription?: string;
};
