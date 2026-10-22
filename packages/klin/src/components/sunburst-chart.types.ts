/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type SunburstNode = {
  label: string;
  value?: number;
  color?: string;
  children?: SunburstNode[];
};

/** Props del sunburst. */
export type SunburstChartProps = {
  data: SunburstNode[];
  ariaLabel: string;
  size?: number;
  format?: (value: number) => string;
  locale?: string;
  /** Profundidad máxima de anillos (se podan los más profundos); si se omite no poda. */
  depth?: number;
  /** Muestra la etiqueta central con el total. */
  showRootLabel?: boolean;
  /** Radio de esquina de los arcos. */
  cornerRadius?: number;
  /** Separación angular entre arcos (radianes). */
  padAngle?: number;
  /** Muestra la leyenda bajo el gráfico. */
  showLegend?: boolean;
  /**
   * Muestra las etiquetas de arco (cuando el arco es grande).
   * @default true
   */
  showLabels?: boolean;
  /**
   * Color por anillo. Si retorna `undefined` se usa el color del grupo.
   * Se respeta `node.color` primero.
   */
  itemColor?: (node: SunburstNode, depth: number) => string | undefined;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
