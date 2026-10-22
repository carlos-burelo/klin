/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { layoutDag } from "../core/dag/layout";
import type { DagLayout } from "../core/dag/types";
import { DIAGRAM_MIN_SCROLL } from "../core/theme";
import { fitNodeWidth } from "../render/measure";
import type { FlowEdge, FlowNode } from "./flow-chart.types";

export const NODE_FONT_SIZE = 12;
export const NODE_RX_PROCESS = 8;
export const NODE_FIT = { min: 150, max: 230, size: 12, pad: 36 } as const;
export const LAYOUT = {
  NODE_H: 56,
  GAP_X: 44,
  GAP_Y: 64,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
export const LABEL_DY = 4;
export const LABEL_DY_WITH_SUB = -3;
export const SUB_DY = 12;
export const SUB_OPACITY = 0.85;

/**
 * Cómputo puro del layout de flujo (ancho auto + DAG con cap SSR).
 */
export function computeFlowLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction: "TB" | "LR" = "TB",
  maxItems: number = LAYOUT.MAX_NODES,
): {
  layout: DagLayout;
  byId: Map<string, FlowNode>;
  width: number;
  height: number;
} {
  const W = fitNodeWidth(
    nodes.flatMap((n) => (n.sub ? [n.label, n.sub] : [n.label])),
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
      maxNodes:
        Number.isFinite(maxItems) && maxItems > 0
          ? Math.floor(maxItems)
          : LAYOUT.MAX_NODES,
    },
  );
  return {
    layout,
    byId: new Map(nodes.map((n) => [n.id, n])),
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height),
  };
}
