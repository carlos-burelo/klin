/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import { DEFAULT_MAX_LINKS, DEFAULT_MAX_NODES } from "../core/limits";
import {
  NETWORK_CHARGE,
  NETWORK_COLLIDE,
  NETWORK_LINK_DISTANCE,
  NETWORK_SEED,
  NETWORK_TICKS,
} from "../core/theme";
import type {
  NetworkEdge,
  NetworkNode,
  PositionedNetworkNode,
} from "./network-graph.types";

/** Caps SSR (alias de los límites centrales, compat). */
export const MAX_NETWORK_NODES = DEFAULT_MAX_NODES;
export const MAX_NETWORK_LINKS = DEFAULT_MAX_LINKS;

export const NETWORK_W = 640;
export const NETWORK_H = 420;
/** Opacidad de los nodos sin conexiones cuando `showIsolated` está activo. */
export const NETWORK_ISOLATED_OPACITY = 0.45;

/** LCG determinista: mismo grafo, mismo dibujo (SSR estable). */
export function seededRandom(seed: number): () => number {
  const LCG_MULT = 1664525;
  const LCG_INCR = 1013904223;
  const LCG_MOD = 4294967296;
  let s = seed >>> 0;
  return () => {
    s = (s * LCG_MULT + LCG_INCR) >>> 0;
    return s / LCG_MOD;
  };
}

/**
 * Cómputo puro de posiciones (fuerzas con semilla fija, NETWORK_TICKS ticks).
 * Trunca determinista a los primeros N nodos/edges para SSR.
 */
export function computeNetworkPositions(
  nodes: NetworkNode[],
  edges: NetworkEdge[],
  seed = NETWORK_SEED,
  options?: {
    forces?: {
      distance?: number;
      charge?: number;
      collide?: number;
    };
    ticks?: number;
    maxItems?: number;
  },
): {
  positioned: PositionedNetworkNode[];
  renderedEdges: NetworkEdge[];
  degree: Map<string, number>;
} {
  const capNodes =
    options?.maxItems === undefined
      ? MAX_NETWORK_NODES
      : Math.max(0, Math.floor(options.maxItems));
  const capLinks =
    options?.maxItems === undefined
      ? MAX_NETWORK_LINKS
      : Math.max(0, Math.floor(options.maxItems));
  const capped = nodes.slice(0, capNodes);
  const known = new Set(capped.map((n) => n.id));
  const renderedEdges = edges
    .filter((e) => known.has(e.from) && known.has(e.to))
    .slice(0, capLinks);

  type SimNode = PositionedNetworkNode;
  const simNodes: SimNode[] = capped.map((n) => ({ ...n }));
  const simEdges = renderedEdges.map((e) => ({
    source: e.from,
    target: e.to,
  }));
  const distance = options?.forces?.distance ?? NETWORK_LINK_DISTANCE;
  const charge = options?.forces?.charge ?? NETWORK_CHARGE;
  const collide = options?.forces?.collide ?? NETWORK_COLLIDE;
  const ticks = options?.ticks ?? NETWORK_TICKS;

  const sim = forceSimulation(simNodes)
    .randomSource(seededRandom(seed))
    .force(
      "link",
      forceLink<SimNode, { source: string; target: string }>(simEdges)
        .id((d) => d.id)
        .distance(distance),
    )
    .force("charge", forceManyBody().strength(charge))
    .force("center", forceCenter(NETWORK_W / 2, NETWORK_H / 2))
    .force("collide", forceCollide(collide))
    .stop();
  for (let i = 0; i < ticks; i++) sim.tick();

  const degree = new Map<string, number>(capped.map((n) => [n.id, 0]));
  for (const e of renderedEdges) {
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
    degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
  }

  return { positioned: simNodes, renderedEdges, degree };
}
