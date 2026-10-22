/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Fila de bala (valor, meta y bandas cualitativas). */
export type BulletRow = {
  label: string;
  /** Valor alcanzado. */
  value: number;
  /** Meta. */
  target: number;
  /** Cortes de las bandas cualitativas [bajo, medio, alto]. */
  ranges: [number, number, number];
  detail?: string;
  /** Color de la barra de valor (override del global). */
  color?: string;
  /** Color de la marca de meta (override del token foreground). */
  targetColor?: string;
};

/** Props de bala SSR (valor vs. meta sobre bandas). */
export type BulletChartProps = {
  rows: BulletRow[];
  ariaLabel: string;
  /**
   * Colores de las bandas cualitativas [baja, media, alta].
   * @default tonos de track
   */
  bands?: [string, string, string];
  /**
   * Muestra el valor de la meta junto al valor alcanzado.
   * @default true
   */
  showTargetLabel?: boolean;
  /**
   * Muestra las etiquetas de valor (valor alcanzado y meta).
   * @default true
   */
  showValues?: boolean;
  /**
   * Tope fijo de la escala para comparar varias balas ("auto" = máximo de los datos).
   * @default "auto"
   */
  scaleMax?: "auto" | number;
  /**
   * Alto en px de cada pista (por defecto, el de la hoja de estilo).
   * @default undefined
   */
  height?: number;
  /**
   * Prefijo de los `clipPath` (por defecto, `useId`; útil en multi-instancia).
   * @default undefined
   */
  id?: string;
  format?: ValueFormatter;
  /** Formato de las etiquetas de valor (por defecto el del eje). */
  formatValues?: ValueFormatter;
  locale?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
