/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { layoutDag } from "../core/dag/layout";
import type { DagLayout } from "../core/dag/types";
import { DIAGRAM_MIN_SCROLL } from "../core/theme";
import { fitNodeWidth } from "../render/measure";
import type {
  ActorNode,
  UseCaseEdge,
  UseCaseNode,
} from "./usecase-diagram.types";

export const NODE_FIT = { min: 150, max: 210, size: 11, pad: 48 } as const;
export const LAYOUT = {
  NODE_H: 56,
  GAP_X: 72,
  GAP_Y: 36,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
export const ACTOR_STROKE = 1.75;
export const ACTOR_HEAD_R = 7;
export const ACTOR_HEAD_DY = 9;
export const ACTOR_NECK_DY = 16;
export const ACTOR_TORSO_DY = 34;
export const ACTOR_ARM_DY = 22;
export const ACTOR_ARM_HALF = 10;
export const ACTOR_LEG_DY = 48;
export const ACTOR_LEG_HALF = 9;
export const ACTOR_LABEL_DY = -2;
export const USECASE_LABEL_DY = 4;
export const EDGE_TAG_DY = -4;
export const DASH_RELATION = "5 4";
/** Marco del sistema: relleno, radio, guion y posición de la etiqueta. */
export const USECASE_BOUNDARY_PAD = 20;
export const USECASE_BOUNDARY_RX = 10;
export const USECASE_BOUNDARY_DASH = "6 4";
export const USECASE_BOUNDARY_LABEL_X = 12;
export const USECASE_BOUNDARY_LABEL_DY = 18;

/**
 * Cómputo puro del layout de casos de uso (DAG con cap SSR).
 */
export function computeUseCaseLayout(
  actors: ActorNode[],
  usecases: UseCaseNode[],
  edges: UseCaseEdge[],
  direction: "TB" | "LR" = "LR",
): {
  layout: DagLayout;
  actorIds: Set<string>;
  names: Map<string, string>;
  width: number;
  height: number;
} {
  const W = fitNodeWidth(
    [...actors.map((a) => a.label), ...usecases.map((u) => u.label)],
    {
      min: NODE_FIT.min,
      max: NODE_FIT.max,
      size: NODE_FIT.size,
      pad: NODE_FIT.pad,
    },
  );
  const H = LAYOUT.NODE_H;
  const all = [...actors.map((a) => a.id), ...usecases.map((u) => u.id)];
  const layout = layoutDag(all, edges, {
    direction,
    nodeW: W,
    nodeH: H,
    gapX: LAYOUT.GAP_X,
    gapY: LAYOUT.GAP_Y,
    minW: LAYOUT.MIN_W,
    maxNodes: LAYOUT.MAX_NODES,
  });
  return {
    layout,
    actorIds: new Set(actors.map((a) => a.id)),
    names: new Map([
      ...actors.map((a) => [a.id, a.label] as const),
      ...usecases.map((u) => [u.id, u.label] as const),
    ]),
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height),
  };
}
