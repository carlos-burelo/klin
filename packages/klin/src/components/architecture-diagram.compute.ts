/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { layoutDag } from "../core/dag/layout";
import type { DagLayout } from "../core/dag/types";
import { DIAGRAM_MIN_SCROLL } from "../core/theme";
import { fitNodeWidth } from "../render/measure";
import type { ArchEdge, ArchNode } from "./architecture-diagram.types";

export const NODE_FONT_SIZE = 12;
export const NODE_RX_PROCESS = 8;
export const NODE_FIT = { min: 150, max: 230, size: 12, pad: 40 } as const;
export const LAYOUT = {
  NODE_H: 60,
  GAP_X: 48,
  GAP_Y: 68,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
export const DB_CAP_RY = 10;
export const DB_CAP_DY = 10;
export const DB_BOTTOM_PAD = 4;
export const ACTOR_AVATAR_X = 22;
export const ACTOR_AVATAR_R = 8;
export const ACTOR_TEXT_X = 40;
export const LABEL_DY = 4;
export const LABEL_DY_WITH_SUB = -3;
export const SUB_DY = 12;
export const DASH_EXTERNAL = "5 4";
/** Alto de nodo en modo compacto (mapas grandes). */
export const ARCH_NODE_H_COMPACT = 40;
/** Insignia de tipo: desplazamiento desde la esquina superior derecha. */
export const ARCH_BADGE_PAD_X = 8;
export const ARCH_BADGE_DY = 14;
/** Etiqueta corta de la insignia por tipo de nodo. */
export const ARCH_KIND_BADGE = {
  service: "servicio",
  database: "base",
  queue: "cola",
  actor: "actor",
  external: "externo",
} as const;

/**
 * Cómputo puro del layout de arquitectura (ancho auto + DAG con cap SSR).
 */
export function computeArchitectureLayout(
  nodes: ArchNode[],
  edges: ArchEdge[],
  direction: "TB" | "LR" = "TB",
  compact = false,
  maxItems: number = LAYOUT.MAX_NODES,
): {
  layout: DagLayout;
  byId: Map<string, ArchNode>;
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
  const H = compact ? ARCH_NODE_H_COMPACT : LAYOUT.NODE_H;
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
