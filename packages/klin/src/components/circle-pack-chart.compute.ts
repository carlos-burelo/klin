/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { type HierarchyCircularNode, hierarchy, pack } from "d3-hierarchy";
import { DEFAULT_MAX_NODES } from "../core/limits";
import { toNumber } from "../core/number";
import type { CirclePackNode } from "./circle-pack-chart.types";

/** Cap de nodos (alias de DEFAULT_MAX_NODES, compat). */
export const MAX_PACK_NODES = DEFAULT_MAX_NODES;

export const PACK_H = 420;
export const PACK_PAD = 4;
export const PACK_FILL_OPACITY = 0.45;
export const PACK_LABEL_MIN_D = 48;
export const PACK_LABEL_MAX_DEPTH = 2;
export const PACK_LABEL_CHAR_PX = 7;
/** Profundidad visible por defecto (sin límite). */
export const PACK_DEPTH_DEFAULT = Number.POSITIVE_INFINITY;

export type PackBubble = HierarchyCircularNode<CirclePackNode>;

/**
 * Cómputo puro del layout circle-pack (empaquetado de círculos).
 * Trunca a los N primeros nodos para SSR.
 */
export function computeCirclePackLayout(
  root: CirclePackNode,
  width: number,
  height: number,
  padding: number = PACK_PAD,
): { bubbles: PackBubble[]; total: number } {
  const rawPad = toNumber(padding, PACK_PAD);
  const safePad = Number.isFinite(rawPad) && rawPad >= 0 ? rawPad : PACK_PAD;
  const packed: PackBubble = pack<CirclePackNode>()
    .size([width, height])
    .padding(safePad)(
    hierarchy<CirclePackNode>(root)
      .sum((d) => toNumber(d.value))
      .sort((a, b) => toNumber(b.value) - toNumber(a.value)),
  );
  const bubbles = packed
    .descendants()
    .filter((d) => (d.r ?? 0) > 0)
    .slice(0, MAX_PACK_NODES);
  return { bubbles, total: toNumber(packed.value) };
}

/** Cadena de etiquetas raíz→nodo (verbatim de la vista). */
export function circlePackChainOf(node: PackBubble): string[] {
  return node
    .ancestors()
    .reverse()
    .map((a) => a.data.label);
}
