/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type ArcNode = {
  id: string;
  label: string;
  color?: string;
};

export type ArcEdge = {
  from: string;
  to: string;
  label?: string;
};

/** Props del diagrama de arcos. */
export type ArcDiagramProps = {
  nodes: ArcNode[];
  edges: ArcEdge[];
  ariaLabel: string;
  /** Tamaño del nodo: fijo (`auto`) o por grado de conexión (`degree`). */
  nodeSize?: "auto" | "degree";
  /** Orden de los nodos sobre el eje: por grado, alfabético o de entrada. */
  sortBy?: "degree" | "label" | "order";
  /** Qué etiquetas de nodo mostrar (`ends` solo pinta la primera y la última). */
  showLabels?: "all" | "ends" | "none";
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
