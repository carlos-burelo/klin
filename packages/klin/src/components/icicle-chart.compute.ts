/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import {
  type HierarchyRectangularNode,
  hierarchy,
  partition,
} from "d3-hierarchy";
import { DEFAULT_MAX_NODES } from "../core/limits";
import { toNumber } from "../core/number";
import type { IcicleNode } from "./icicle-chart.types";

/** Cap de nodos (alias de DEFAULT_MAX_NODES, compat). */
export const MAX_ICICLE_NODES = DEFAULT_MAX_NODES;

export const ICICLE_H = 360;
export const PARTITION_PAD = 2;
export const LABEL_MIN_PX = 40;
export const NODE_FONT_SIZE = 12;
export const LABEL_DX = 6;
export const NODE_LABEL_DY = 4;
export const LABEL_CHAR_PX = 7;
/** Profundidad visible por defecto (sin límite). */
export const ICICLE_DEPTH_DEFAULT = Number.POSITIVE_INFINITY;

export type IcicleBand = HierarchyRectangularNode<IcicleNode>;

/**
 * Cómputo puro del layout icicle (partición cartesiana).
 * Ordena bandas por valor desc y trunca a las primeras N para SSR.
 */
export function computeIcicleLayout(
  root: IcicleNode,
  width: number,
  height: number,
  gap: number = PARTITION_PAD,
): { bands: IcicleBand[]; total: number } {
  const pad = Math.max(0, toNumber(gap, PARTITION_PAD));
  const proot: IcicleBand = partition<IcicleNode>()
    .size([width, height])
    .padding(pad)
    .round(true)(
    hierarchy<IcicleNode>(root)
      .sum((d) => toNumber(d.value))
      .sort((a, b) => toNumber(b.value) - toNumber(a.value)),
  );
  const bands = proot
    .descendants()
    .filter((d) => d.depth > 0 && toNumber(d.value) > 0)
    .sort((a, b) => toNumber(b.value) - toNumber(a.value))
    .slice(0, MAX_ICICLE_NODES);
  return { bands, total: toNumber(proot.value) };
}

/** Cadena de etiquetas raíz→nodo (verbatim de la vista). */
export function icicleChainOf(node: IcicleBand): string[] {
  return node
    .ancestors()
    .reverse()
    .map((a) => a.data.label);
}

/** Separación entre bandas normalizada (PARTITION_PAD actual). */
export function normalizeIcicleGap(gap: unknown): number {
  return Math.max(0, toNumber(gap, PARTITION_PAD));
}
