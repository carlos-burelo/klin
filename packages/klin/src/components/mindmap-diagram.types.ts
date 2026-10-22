/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type MindNode = {
  label: string;
  /** Color propio (token); por defecto, color de la rama. */
  color?: string;
  children?: MindNode[];
};

/** Props del mapa mental. */
export type MindmapDiagramProps = {
  root: MindNode;
  ariaLabel: string;
  /** Color por profundidad (índice = `depth`); por defecto, color de rama. */
  depthColors?: string[];
  /** Ancho de cada caja de nodo. */
  nodeWidth?: number;
  /** Muestra la leyenda bajo el gráfico. */
  showLegend?: boolean;
  /** Profundidad máxima visible (sin colapso por defecto). */
  collapseDepth?: number;
  /** Tope de nodos (por defecto `MAX_MINDMAP_NODES`). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
