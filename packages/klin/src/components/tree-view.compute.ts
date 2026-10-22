/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { TreeItem } from "./tree-view.types";

export const CHEVRON_SIZE = 12;
export const CHEVRON_STROKE = 1.75;

export const MAX_TREE_DEPTH = 6;
export const MAX_TREE_NODES = 300;

/**
 * Trunca determinista del árbol (profundidad + total de nodos).
 * Pura y testable; el componente la llama antes de renderizar.
 */
export function capTreeItems(
  items: TreeItem[],
  opts?: { depth?: number; maxItems?: number },
): TreeItem[] {
  const maxDepth =
    opts?.depth === undefined
      ? MAX_TREE_DEPTH
      : Math.max(0, Math.floor(opts.depth));
  const cap =
    opts?.maxItems === undefined
      ? MAX_TREE_NODES
      : Math.max(0, Math.floor(opts.maxItems));
  let count = 0;
  const clone = (node: TreeItem, depth: number): TreeItem | null => {
    if (count >= cap) return null;
    count += 1;
    if (depth >= maxDepth || !node.children?.length) {
      return { ...node, children: undefined };
    }
    const kids: TreeItem[] = [];
    for (const k of node.children) {
      if (count >= cap) break;
      const c = clone(k, depth + 1);
      if (c) kids.push(c);
    }
    return kids.length > 0
      ? { ...node, children: kids }
      : { ...node, children: undefined };
  };
  const out: TreeItem[] = [];
  for (const item of items) {
    if (count >= cap) break;
    const c = clone(item, 0);
    if (c) out.push(c);
  }
  return out;
}

/** Ordena el árbol por etiqueta (copia; entrada intacta por defecto). */
export function sortTreeItems(
  items: TreeItem[],
  sortBy?: "label" | "order",
): TreeItem[] {
  if (sortBy !== "label") return items;
  const sortNode = (node: TreeItem): TreeItem => ({
    ...node,
    children: node.children
      ? [...node.children]
          .sort((a, b) => a.label.localeCompare(b.label))
          .map(sortNode)
      : undefined,
  });
  return [...items]
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(sortNode);
}
