/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type FlowNode = {
  id: string;
  label: string;
  sub?: string;
  kind?: "start" | "end" | "process" | "decision";
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
};

/** Props del diagrama de flujo. */
export type FlowChartProps = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Muestra la leyenda de kinds (formas/colores). */
  showLegend?: boolean;
  /** Muestra las etiquetas de arista. */
  showEdgeLabels?: boolean;
  /** Muestra el subtítulo de cada nodo. */
  showSub?: boolean;
  /** Sobrescribe el color de relleno por kind. */
  statusColors?: Partial<Record<Exclude<FlowNode["kind"], undefined>, string>>;
  /** Tope de nodos (SSR acotado; por defecto `LAYOUT.MAX_NODES`). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
