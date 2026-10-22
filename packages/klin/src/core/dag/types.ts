/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

export type DagNode = {
  id: string;
};

export type DagEdge = {
  from: string;
  to: string;
};

export type PlacedNode = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  layer: number;
};

export type RoutedEdge = {
  from: string;
  to: string;
  /** Camino SVG listo para `d`. */
  d: string;
  /** Punto medio para la etiqueta. */
  mx: number;
  my: number;
  /** Lazo sobre sí mismo. */
  self: boolean;
};

export type DagLayout = {
  nodes: Map<string, PlacedNode>;
  edges: RoutedEdge[];
  width: number;
  height: number;
};

export type DagDirection = "TB" | "LR";

export type DagOptions = {
  direction?: DagDirection;
  nodeW?: number;
  nodeH?: number;
  gapX?: number;
  gapY?: number;
  /** Ancho/alto mínimos del lienzo (evita diagramas gigantes). */
  minW?: number;
  minH?: number;
  /** Capas de seguridad SSR: trunca determinista si se exceden. */
  maxNodes?: number;
  maxEdges?: number;
};
