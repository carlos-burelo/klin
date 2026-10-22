/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type IcicleNode = {
  label: string;
  value?: number;
  color?: string;
  children?: IcicleNode[];
};

/** Props del icicle. */
export type IcicleChartProps = {
  root: IcicleNode;
  ariaLabel: string;
  height?: number;
  format?: (value: number) => string;
  locale?: string;
  /** Profundidad máxima visible (por defecto sin límite). */
  depth?: number;
  /** Muestra las etiquetas dentro de cada banda. */
  showLabels?: boolean;
  /** Agrega el valor a la etiqueta de cada banda. */
  showValues?: boolean;
  /** Ancho mínimo de banda para rotular. */
  minLabelWidth?: number;
  /**
   * Separación entre bandas en px.
   * @default PARTITION_PAD
   */
  gap?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
