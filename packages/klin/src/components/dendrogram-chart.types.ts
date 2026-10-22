/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { HierarchyPointNode } from "d3-hierarchy";
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

export type DendrogramNode = {
  label: string;
  value?: number;
  color?: string;
  children?: DendrogramNode[];
};

export type DendrogramOrientation = "vertical" | "horizontal";

/** Props del dendrograma. */
export type DendrogramChartProps = {
  root: DendrogramNode;
  ariaLabel: string;
  orientation?: DendrogramOrientation;
  height?: number;
  /** Profundidad máxima visible (por defecto sin límite). */
  depth?: number;
  /** Muestra las etiquetas de cada nodo. */
  showLabels?: boolean;
  /** Agrega el conteo de descendientes a la etiqueta de cada rama. */
  showCounts?: boolean;
  /** Formato del valor del nodo en el tip (sin formato → solo ruta, como hasta ahora). */
  format?: ValueFormatter;
  locale?: string;
  /** Radio del nodo (por defecto `POINT_RADIUS`). */
  nodeRadius?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

export type DendrogramPoint = HierarchyPointNode<DendrogramNode>;
export type DendrogramLink = {
  source: DendrogramPoint;
  target: DendrogramPoint;
};
