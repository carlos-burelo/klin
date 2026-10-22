/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { DEFAULT_MAX_LINKS, DEFAULT_MAX_NODES } from "../core/limits";
import type { ArcEdge, ArcNode } from "./arc-diagram.types";

export const ARC_W = 680;
export const BASE_Y = 120;
export const R = 7;
export const MAX_STEP = 150;
export const AXIS_PAD_X = 48;
export const VIEW_PAD_BOTTOM = 48;
export const LABEL_DY = 22;
export const ARC_MIN_H = 24;
export const ARC_JITTER = 37;
export const ARC_SPREAD = 90;
export const MAX_GROWTH = 5;
export const ARC_OPACITY = 0.8;

/** Caps SSR (alias de los límites centrales, compat). */
export const MAX_ARC_NODES = DEFAULT_MAX_NODES;
export const MAX_ARC_LINKS = DEFAULT_MAX_LINKS;

/**
 * Cómputo puro del layout de arcos (eje de nodos + grado + orden).
 * Trunca determinista para SSR.
 */
export function computeArcLayout(
  nodes: ArcNode[],
  edges: ArcEdge[],
  sortBy: "degree" | "label" | "order" = "degree",
) {
  const base = nodes.slice(0, MAX_ARC_NODES);
  const known = new Set(base.map((n) => n.id));
  const clean = edges
    .filter((e) => known.has(e.from) && known.has(e.to))
    .slice(0, MAX_ARC_LINKS);
  const degree = new Map<string, number>(base.map((n) => [n.id, 0]));
  for (const e of clean) {
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
    degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
  }
  const baseIndex = new Map(base.map((n, i) => [n.id, i]));
  const cappedNodes = [...base].sort((a, b) => {
    if (sortBy === "label") {
      if (a.label !== b.label) return a.label < b.label ? -1 : 1;
    } else if (sortBy === "degree") {
      const diff = (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0);
      if (diff !== 0) return diff;
    }
    return (baseIndex.get(a.id) ?? 0) - (baseIndex.get(b.id) ?? 0);
  });
  const step = Math.min(
    MAX_STEP,
    (ARC_W - AXIS_PAD_X) / Math.max(1, cappedNodes.length),
  );
  const totalW = step * Math.max(0, cappedNodes.length - 1);
  const ox = (ARC_W - totalW) / 2;
  const H = BASE_Y + VIEW_PAD_BOTTOM;
  const order = new Map(cappedNodes.map((n, i) => [n.id, i]));
  return { cappedNodes, clean, step, totalW, ox, H, degree, order };
}
