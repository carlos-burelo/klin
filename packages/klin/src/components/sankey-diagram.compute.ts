/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { SankeyLink } from "d3-sankey";
import {
  sankey,
  sankeyCenter,
  sankeyJustify,
  sankeyLeft,
  sankeyLinkHorizontal,
  sankeyRight,
} from "d3-sankey";
import { DEFAULT_MAX_LINKS, DEFAULT_MAX_NODES } from "../core/limits";
import { toNumber } from "../core/number";
import { SANKEY_NODE_PADDING, SANKEY_NODE_WIDTH } from "../core/theme";
import type {
  SankeyFlow,
  SankeyLayoutOptions,
  SankeyNode,
  SankeyNodeAlign,
} from "./sankey-diagram.types";

/** Caps SSR (alias de los límites centrales, compat). */
export const MAX_SANKEY_NODES = DEFAULT_MAX_NODES;
export const MAX_SANKEY_LINKS = DEFAULT_MAX_LINKS;

export const SANKEY_W = 680;
export const SANKEY_H = 360;
export const LABEL_GUTTER = 120;
export const PAD = 8;
export const NODE_RX = 3;
export const LABEL_DX = 6;
export const LABEL_DY = 4;

export type SankeyNodeDatum = { id: string; label: string; color?: string };
export type SankeyLinkDatum = { value: number };

/** Nodo sankey con nombre (id + etiqueta) tras el layout. */
export type NamedSankeyNode = { id: string; label: string };

/** Guarda: el extremo del enlace ya es un nodo posicionado con nombre. */
export function isNamedSankeyNode(node: unknown): node is NamedSankeyNode {
  if (typeof node !== "object" || node === null) return false;
  const record = node as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.label === "string";
}

/** Resuelve la función de alineación d3-sankey (justify por defecto). */
export function resolveSankeyAlign(align: SankeyNodeAlign | undefined) {
  if (align === "left") return sankeyLeft;
  if (align === "right") return sankeyRight;
  if (align === "center") return sankeyCenter;
  return sankeyJustify;
}

/**
 * Cómputo puro del layout sankey (trunca determinista + precachea color).
 * Retorna el grafo ya posicionado y el mapa id → {color, index}.
 */
export function computeSankeyLayout(
  nodes: SankeyNode[],
  flows: SankeyFlow[],
  opts?: SankeyLayoutOptions,
) {
  const rawMax = Math.floor(toNumber(opts?.maxItems, Number.NaN));
  const hasMax = Number.isFinite(rawMax) && rawMax > 0;
  const safeNodes = hasMax ? rawMax : MAX_SANKEY_NODES;
  const safeLinks = hasMax ? rawMax : MAX_SANKEY_LINKS;
  const capped = nodes.slice(0, safeNodes);
  const known = new Set(capped.map((n) => n.id));
  const cleanFlows = flows
    .filter(
      (f) => known.has(f.from) && known.has(f.to) && toNumber(f.value) > 0,
    )
    .slice(0, safeLinks);

  const rawH = toNumber(opts?.height, SANKEY_H);
  const safeH = Number.isFinite(rawH) && rawH > 0 ? rawH : SANKEY_H;
  const rawW = toNumber(opts?.nodeWidth, SANKEY_NODE_WIDTH);
  const safeW = Number.isFinite(rawW) && rawW > 0 ? rawW : SANKEY_NODE_WIDTH;
  const rawP = toNumber(opts?.nodePadding, SANKEY_NODE_PADDING);
  const safeP = Number.isFinite(rawP) && rawP >= 0 ? rawP : SANKEY_NODE_PADDING;

  const graph = sankey<SankeyNodeDatum, SankeyLinkDatum>()
    .nodeId((d) => d.id)
    .nodeWidth(safeW)
    .nodePadding(safeP)
    .nodeAlign(resolveSankeyAlign(opts?.nodeAlign))
    .extent([
      [LABEL_GUTTER, PAD],
      [SANKEY_W - PAD, safeH - PAD],
    ])({
    nodes: capped.map((n) => ({ ...n })),
    links: cleanFlows.map((f) => ({
      source: f.from,
      target: f.to,
      value: toNumber(f.value),
    })),
  });

  const colorById = new Map<string, { color?: string; index: number }>();
  for (const [i, n] of capped.entries()) {
    colorById.set(n.id, { color: n.color, index: i });
  }

  return { graph, capped, colorById };
}

/** Path horizontal del enlace sankey (curva d3-sankey). */
export function sankeyLinkPath(
  link: SankeyLink<SankeyNodeDatum, SankeyLinkDatum>,
): string {
  return sankeyLinkHorizontal()(link) ?? "";
}
