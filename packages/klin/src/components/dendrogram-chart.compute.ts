/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { cluster, hierarchy } from "d3-hierarchy";
import { DEFAULT_MAX_NODES } from "../core/limits";
import type {
  DendrogramLink,
  DendrogramNode,
  DendrogramOrientation,
  DendrogramPoint,
} from "./dendrogram-chart.types";

/** Cap de nodos (alias de DEFAULT_MAX_NODES, compat). */
export const MAX_DENDROGRAM_NODES = DEFAULT_MAX_NODES;

export const DENDRO_H = 400;
export const DENDRO_MARGIN = {
  top: 16,
  right: 120,
  bottom: 16,
  left: 16,
} as const;
export const LABEL_MAX_CHARS = 18;
export const NODE_LABEL_DY = 4;
/** Alto de fila para detectar colisiones y aire al final de la etiqueta. */
export const LABEL_ROW_H = 14;
export const LABEL_END_PAD = 4;
/** Profundidad visible por defecto (sin límite). */
export const DENDRO_DEPTH_DEFAULT = Number.POSITIVE_INFINITY;

/**
 * Cómputo puro del layout dendrograma (cluster + posiciones y codos).
 * Trunca a los N primeros nodos (recorrido en anchura) para SSR.
 */
export function computeDendrogramLayout(
  root: DendrogramNode,
  width: number,
  height: number,
  orientation: DendrogramOrientation = "vertical",
): { nodes: DendrogramPoint[]; links: DendrogramLink[] } {
  const innerW = Math.max(1, width - DENDRO_MARGIN.left - DENDRO_MARGIN.right);
  const innerH = Math.max(1, height - DENDRO_MARGIN.top - DENDRO_MARGIN.bottom);
  const size: [number, number] =
    orientation === "vertical" ? [innerW, innerH] : [innerH, innerW];
  const laid = cluster<DendrogramNode>().size(size)(
    hierarchy<DendrogramNode>(root).sort((a, b) =>
      a.data.label.localeCompare(b.data.label),
    ),
  );
  const nodes = laid.descendants().slice(0, MAX_DENDROGRAM_NODES);
  const visible = new Set(nodes);
  const links = laid
    .links()
    .filter((l) => visible.has(l.source) && visible.has(l.target));
  return { nodes, links };
}
