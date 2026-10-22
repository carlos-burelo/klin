/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { clamp01, toNumber } from "../core/number";
import { NODE_RADIUS } from "../core/theme";
import type { WardleyEdge, WardleyNode } from "./wardley-map.types";

export const W = 640;
export const H = 420;
export const MARGIN = { top: 16, right: 16, bottom: 44, left: 16 };
/** Etapas por defecto (las actuales Génesis → Commodity). */
export const DEFAULT_WARDLEY_STAGES: [string, string, string, string] = [
  "Génesis",
  "Custom",
  "Producto",
  "Commodity",
];
/** Muestra etiquetas de grid por defecto (comportamiento actual). */
export const DEFAULT_WARDLEY_SHOW_GRID_LABELS = true;
/** Radio fijo por defecto (comportamiento actual). */
export const DEFAULT_WARDLEY_NODE_SIZE = "fixed" as const;
/** Crecimiento de radio por enlace en modo `edges`. */
export const WARDLEY_EDGE_SIZE_STEP = 2;
/** Fracciones de grid vertical, trazo punteado y geometría de etiquetas. */
export const GRID_FRACTIONS = [0.25, 0.5, 0.75];
export const GRID_DASHARRAY = "4 4";
export const STAGE_LABEL_BOTTOM_PAD = 24;
export const AXIS_LABEL_BOTTOM_PAD = 8;
export const Y_LABEL_X = 12;
export const NODE_LABEL_DX = 13;
export const NODE_VALUE_DY = 22;
/** Máximo de truncado de etiqueta de nodo. */
export const LABEL_MAX_NODE = 20;

/** Punto Wardley normalizado (nx/ny 0–1). */
export type WardleyPoint = WardleyNode & { nx: number; ny: number };

/**
 * Cómputo puro de posiciones Wardley (normaliza con toNumber + clamp01).
 */
export function computeWardleyLayout(
  nodes: WardleyNode[],
  edges: WardleyEdge[],
): {
  points: WardleyPoint[];
  cleanEdges: WardleyEdge[];
  byId: Map<string, WardleyNode>;
} {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const known = new Set(nodes.map((n) => n.id));
  const cleanEdges = edges.filter((e) => known.has(e.from) && known.has(e.to));
  const points = nodes.map((n) => ({
    ...n,
    nx: clamp01(toNumber(n.x)),
    ny: clamp01(toNumber(n.y)),
  }));
  return { points, cleanEdges, byId };
}

/** Dimensiones internas del lienzo (verbatim de la vista). */
export function wardleyInner(): { innerW: number; innerH: number } {
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = H - MARGIN.top - MARGIN.bottom;
  return { innerW, innerH };
}

/** Proyección x/y normalizada a px (verbatim de la vista). */
export function wardleyPx(v: number, innerW: number): number {
  return MARGIN.left + clamp01(v) * innerW;
}

/** Proyección x/y normalizada a px (verbatim de la vista). */
export function wardleyPy(v: number, innerH: number): number {
  return MARGIN.top + (1 - clamp01(v)) * innerH;
}

/** Grado por nodo (nº de enlaces) en modo `edges` (verbatim de la vista). */
export function buildWardleyDegrees(
  cleanEdges: WardleyEdge[],
  nodeSize: "fixed" | "edges",
): Map<string, number> {
  const degreeById = new Map<string, number>();
  if (nodeSize === "edges") {
    for (const e of cleanEdges) {
      degreeById.set(e.from, (degreeById.get(e.from) ?? 0) + 1);
      degreeById.set(e.to, (degreeById.get(e.to) ?? 0) + 1);
    }
  }
  return degreeById;
}

/** Radio fijo o proporcional al grado (verbatim de la vista). */
export function wardleyNodeRadius(
  nodeSize: "fixed" | "edges",
  degreeById: Map<string, number>,
  id: string,
): number {
  return nodeSize === "edges"
    ? NODE_RADIUS + (degreeById.get(id) ?? 0) * WARDLEY_EDGE_SIZE_STEP
    : NODE_RADIUS;
}

/** Índice de etapa por posición de evolución (verbatim de la vista). */
export function wardleyStageIndex(nx: number, stageCount: number): number {
  return Math.round(nx * (stageCount - 1));
}
