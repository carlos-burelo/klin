/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type CirclePackNode = {
  label: string;
  value?: number;
  color?: string;
  children?: CirclePackNode[];
};

/** Props del circle-pack. */
export type CirclePackChartProps = {
  root: CirclePackNode;
  ariaLabel: string;
  height?: number;
  format?: (value: number) => string;
  locale?: string;
  /** Profundidad máxima visible (por defecto sin límite). */
  depth?: number;
  /** Relleno entre burbujas (por defecto `PACK_PAD`). */
  padding?: number;
  /** Muestra las etiquetas dentro de cada burbuja. */
  showLabels?: boolean;
  /** Agrega el valor a la etiqueta de cada burbuja. */
  showValues?: boolean;
  /** Diámetro mínimo de burbuja para rotular. */
  minLabelDiameter?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
