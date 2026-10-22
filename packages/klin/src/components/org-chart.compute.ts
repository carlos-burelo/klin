/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { hierarchy, tree } from "d3-hierarchy";
import type { OrgNode } from "./org-chart.types";

export const BOX_W = 150;
export const BOX_H = 52;
export const GAP_X = 24;
export const GAP_Y = 64;
export const VIEW_PAD_X = 48;
export const VIEW_PAD_Y = 24;
export const ORIGIN_PAD_X = 24;
export const ORIGIN_PAD_Y = 12;
export const NODE_RX = 8;
export const NODE_FONT_SIZE = 12;
export const LABEL_DY = 4;
export const LABEL_DY_WITH_ROLE = -3;
export const ROLE_DY = 12;
/** Avatar de iniciales: radio, sangría izquierda y desplazamiento del texto. */
export const ORG_AVATAR_R = 12;
export const ORG_AVATAR_PAD_X = 10;
export const ORG_AVATAR_TEXT_SHIFT = 14;
export const ORG_AVATAR_FONT_SIZE = 11;

/** Iniciales del nombre (primera letra de las dos primeras palabras). */
export function orgInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return words
    .slice(0, 2)
    .map((w) => Array.from(w)[0] ?? "")
    .join("")
    .toUpperCase();
}

/** Poda el árbol a una profundidad máxima (la raíz vive en 0). */
export function pruneOrgDepth(node: OrgNode, depth: number, at = 0): OrgNode {
  const out: OrgNode = {
    name: node.name,
    role: node.role,
    color: node.color,
  };
  if (at < depth && node.children) {
    out.children = node.children.map((c) => pruneOrgDepth(c, depth, at + 1));
  }
  return out;
}

/** Opciones del layout del organigrama (defaults = comportamiento actual). */
export type OrgLayoutOptions = {
  /** Orden de hijos (`label` alfabético, `order`/ausente entrada). */
  sortBy?: "label" | "order";
  /** Ancho de cada caja (por defecto `BOX_W`). */
  nodeWidth?: number;
};

/** Ordena hijos por nombre (copia; entrada intacta cuando no es `label`). */
export function sortOrgChildren(
  node: OrgNode,
  sortBy?: "label" | "order",
): OrgNode {
  const out: OrgNode = {
    name: node.name,
    role: node.role,
    color: node.color,
  };
  const kids = node.children;
  if (!kids) return out;
  const ordered =
    sortBy === "label"
      ? [...kids].sort((a, b) => a.name.localeCompare(b.name))
      : kids;
  out.children = ordered.map((c) => sortOrgChildren(c, sortBy));
  return out;
}

/**
 * Cómputo puro del layout del organigrama (árbol vertical + viewport).
 */
export function computeOrgLayout(
  root: OrgNode,
  collapseDepth?: number,
  opts?: OrgLayoutOptions,
) {
  const sorted =
    opts?.sortBy === "label" ? sortOrgChildren(root, "label") : root;
  const shown =
    collapseDepth === undefined ? sorted : pruneOrgDepth(sorted, collapseDepth);
  const boxW =
    opts?.nodeWidth === undefined
      ? BOX_W
      : Math.max(1, Math.floor(opts.nodeWidth));
  const laid = tree<OrgNode>().nodeSize([boxW + GAP_X, BOX_H + GAP_Y])(
    hierarchy<OrgNode>(shown),
  );
  const nodes = laid.descendants();
  const links = laid.links();
  const xs = nodes.map((n) => n.x ?? 0);
  const ys = nodes.map((n) => n.y ?? 0);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const W = maxX - minX + boxW + VIEW_PAD_X;
  const H = maxY + BOX_H + VIEW_PAD_Y;
  const ox = boxW / 2 + ORIGIN_PAD_X - minX;
  const oy = BOX_H / 2 + ORIGIN_PAD_Y;
  return { nodes, links, W, H, ox, oy, boxW };
}
