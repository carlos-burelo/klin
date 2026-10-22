/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { hierarchy, tree } from "d3-hierarchy";
import type { MindNode } from "./mindmap-diagram.types";

export const NODE_W = 150;
export const NODE_H = 32;
export const DEPTH_X = 190;
export const LEAF_GAP = 44;
export const VIEW_PAD_X = 48;
export const VIEW_PAD_Y = 32;
export const ORIGIN_PAD_X = 24;
export const ORIGIN_PAD_Y = 16;
export const NODE_RX = 8;
export const LABEL_DY = 4;

export const MAX_MINDMAP_DEPTH = 6;
export const MAX_MINDMAP_NODES = 300;

/** Vista mínima estructural de un nodo jerárquico (compatible con d3-hierarchy). */
export type Climb = {
  data: { label: string; color?: string };
  parent?: Climb | null;
};

/** Etiquetas de los ancestros (raíz primero). */
export function labelsUp(node: Climb): string[] {
  const out: string[] = [];
  let cur = node.parent;
  while (cur) {
    out.unshift(cur.data.label);
    cur = cur.parent;
  }
  return out;
}

/** Opciones de poda del mindmap (defaults = caps actuales). */
export type MindmapCapOptions = {
  /** Profundidad máxima (por defecto `MAX_MINDMAP_DEPTH`). */
  depth?: number;
  collapseDepth?: number;
  /** Tope de nodos (por defecto `MAX_MINDMAP_NODES`). */
  maxItems?: number;
};

/**
 * Trunca determinista: poda a profundidad 6 y a 300 nodos (corta
 * children en exceso, primeros N). Pura y testable.
 */
export function capMindmapTree(
  root: MindNode,
  opts?: MindmapCapOptions,
): MindNode {
  const maxDepth = opts?.collapseDepth ?? opts?.depth ?? MAX_MINDMAP_DEPTH;
  const safeDepth =
    Number.isFinite(maxDepth) && maxDepth >= 0
      ? Math.floor(maxDepth)
      : MAX_MINDMAP_DEPTH;
  const cap =
    opts?.maxItems === undefined
      ? MAX_MINDMAP_NODES
      : Math.max(0, Math.floor(opts.maxItems));
  let count = 0;
  const clone = (node: MindNode, depth: number): MindNode => {
    count += 1;
    if (depth >= safeDepth)
      return node.color
        ? { label: node.label, color: node.color }
        : { label: node.label };
    const kids = node.children ?? [];
    const out: MindNode[] = [];
    for (const k of kids) {
      if (count >= cap) break;
      out.push(clone(k, depth + 1));
    }
    const base: MindNode = node.color
      ? { label: node.label, color: node.color }
      : { label: node.label };
    return out.length > 0 ? { ...base, children: out } : base;
  };
  return clone(root, 0);
}

/**
 * Cómputo puro del layout mindmap (árbol horizontal + viewport).
 */
export function computeMindmapLayout(
  root: MindNode,
  nodeWidth: number = NODE_W,
  opts?: MindmapCapOptions,
) {
  const capped = capMindmapTree(root, opts);
  const laid = tree<MindNode>().nodeSize([LEAF_GAP, DEPTH_X])(
    hierarchy<MindNode>(capped),
  );
  const nodes = laid.descendants();
  const links = laid.links();

  const xs = nodes.map((n) => n.y);
  const ys = nodes.map((n) => n.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const W = maxX - minX + nodeWidth + VIEW_PAD_X;
  const H = maxY - minY + NODE_H + VIEW_PAD_Y;
  const ox = nodeWidth / 2 + ORIGIN_PAD_X - minX;
  const oy = NODE_H / 2 + ORIGIN_PAD_Y - minY;
  const branches = (capped.children ?? []).map((c) => c.label);
  const branchIndex = new Map(branches.map((b, i) => [b, i]));

  return { nodes, links, W, H, ox, oy, branches, branchIndex, capped };
}
