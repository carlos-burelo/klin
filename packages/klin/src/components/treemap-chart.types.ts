/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type TreemapNode = {
  label: string;
  value?: number;
  color?: string;
  children?: TreemapNode[];
};

/** Props del treemap. */
export type TreemapChartProps = {
  data: TreemapNode[];
  ariaLabel: string;
  /** Alto del mapa (layout y viewBox). */
  height?: number;
  format?: (value: number) => string;
  locale?: string;
  /** Algoritmo de partición del rectángulo. */
  tiling?: "squarify" | "slice" | "dice";
  /** Muestra el valor bajo la etiqueta cuando hay espacio. */
  showValues?: boolean;
  /** Área mínima (px²) para pintar etiqueta; si se omite usa el umbral clásico ancho/alto. */
  minLabelArea?: number;
  /** Colores por profundidad (índice `depth % longitud`); si se omite colorea por grupo superior. */
  depthColors?: string[];
  /**
   * Muestra la leyenda bajo el gráfico (grupos superiores).
   * @default false
   */
  showLegend?: boolean;
  /**
   * Separación entre celdas en px.
   * @default TREEMAP_GAP
   */
  gap?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
