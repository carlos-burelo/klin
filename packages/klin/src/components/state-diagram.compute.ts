/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { layoutDag } from "../core/dag/layout";
import type { DagLayout } from "../core/dag/types";
import { DIAGRAM_MIN_SCROLL } from "../core/theme";
import { fitNodeWidth } from "../render/measure";
import type { StateEdge, StateNode } from "./state-diagram.types";

export const NODE_FONT_SIZE = 12;
export const NODE_RX_STATE = 12;
export const NODE_FIT = { min: 150, max: 230, size: 12, pad: 36 } as const;
export const LAYOUT = {
  NODE_H: 52,
  GAP_X: 56,
  GAP_Y: 72,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
export const DOT = 28;
export const FINAL_RING_PAD = 4;
export const LABEL_DY = 4;
/** Id del pseudoinicio que se inyecta cuando ningún nodo lo declara. */
export const STATE_PSEUDO_INITIAL_ID = "__klin-inicio__";

/**
 * Cómputo puro del layout de estados (ancho auto + DAG con cap SSR).
 */
export function computeStateLayout(
  nodes: StateNode[],
  edges: StateEdge[],
  direction: "TB" | "LR" = "LR",
): {
  layout: DagLayout;
  byId: Map<string, StateNode>;
  width: number;
  height: number;
} {
  const W = fitNodeWidth(
    nodes.map((n) => n.label),
    {
      min: NODE_FIT.min,
      max: NODE_FIT.max,
      size: NODE_FIT.size,
      pad: NODE_FIT.pad,
    },
  );
  const H = LAYOUT.NODE_H;
  const layout = layoutDag(
    nodes.map((n) => n.id),
    edges,
    {
      direction,
      nodeW: W,
      nodeH: H,
      gapX: LAYOUT.GAP_X,
      gapY: LAYOUT.GAP_Y,
      minW: LAYOUT.MIN_W,
      maxNodes: LAYOUT.MAX_NODES,
    },
  );
  return {
    layout,
    byId: new Map(nodes.map((n) => [n.id, n])),
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height),
  };
}
