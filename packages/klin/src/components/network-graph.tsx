/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_LINKS, DEFAULT_MAX_NODES } from "../lib/limits";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
  LABEL_GAP_PX,
  NETWORK_CHARGE,
  NETWORK_COLLIDE,
  NETWORK_LINK_DISTANCE,
  NETWORK_NODE_GROWTH,
  NETWORK_NODE_MAX_GROWTH,
  NETWORK_NODE_MIN_R,
  NETWORK_SEED,
  NETWORK_TICKS,
  NODE_BORDER_WIDTH,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type NetworkNode = {
  id: string;
  label?: string;
  color?: string;
};

export type NetworkEdge = {
  from: string;
  to: string;
};

/** Props del grafo de red. */
export type NetworkGraphProps = {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  ariaLabel: string;
  seed?: number;
  /** Ajustes de la simulación de fuerzas (por defecto, constantes `NETWORK_*`). */
  forces?: {
    distance?: number;
    charge?: number;
    collide?: number;
  };
  /** Tamaño del nodo: por grado de conexión (`degree`) o fijo (`fixed`). */
  nodeSize?: "degree" | "fixed";
  /** Muestra atenuados los nodos sin conexiones. */
  showIsolated?: boolean;
  /** Iteraciones de la simulación (calidad frente a costo SSR). */
  ticks?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

export type PositionedNetworkNode = NetworkNode & { x?: number; y?: number };

/** Caps SSR (alias de los límites centrales, compat). */
export const MAX_NETWORK_NODES = DEFAULT_MAX_NODES;
export const MAX_NETWORK_LINKS = DEFAULT_MAX_LINKS;

/** LCG determinista: mismo grafo, mismo dibujo (SSR estable). */
function seededRandom(seed: number): () => number {
  const LCG_MULT = 1664525;
  const LCG_INCR = 1013904223;
  const LCG_MOD = 4294967296;
  let s = seed >>> 0;
  return () => {
    s = (s * LCG_MULT + LCG_INCR) >>> 0;
    return s / LCG_MOD;
  };
}

const NETWORK_W = 640;
const NETWORK_H = 420;
/** Opacidad de los nodos sin conexiones cuando `showIsolated` está activo. */
const NETWORK_ISOLATED_OPACITY = 0.45;

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
  },
): {
  positioned: PositionedNetworkNode[];
  renderedEdges: NetworkEdge[];
  degree: Map<string, number>;
} {
  const capped = nodes.slice(0, MAX_NETWORK_NODES);
  const known = new Set(capped.map((n) => n.id));
  const renderedEdges = edges
    .filter((e) => known.has(e.from) && known.has(e.to))
    .slice(0, MAX_NETWORK_LINKS);

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

/**
 * Red SSR (simulación de fuerzas con semilla fija, 300 ticks en servidor).
 */
export function NetworkGraph({
  nodes,
  edges,
  ariaLabel,
  seed = 42,
  forces,
  nodeSize = "degree",
  showIsolated = true,
  ticks = NETWORK_TICKS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: NetworkGraphProps) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { positioned, renderedEdges, degree } = computeNetworkPositions(
    nodes,
    edges,
    seed,
    { forces, ticks },
  );
  const visible = showIsolated
    ? positioned
    : positioned.filter((n) => (degree.get(n.id) ?? 0) > 0);
  const pos = new Map(positioned.map((n) => [n.id, n]));

  return (
    <svg
      viewBox={`0 0 ${NETWORK_W} ${NETWORK_H}`}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{ariaLabel}</title>
      {renderedEdges.map((e, i) => {
        const a = pos.get(e.from);
        const b = pos.get(e.to);
        if (!a || !b) return null;
        return (
          <line
            key={stableKey([e.from, e.to], i)}
            x1={a.x ?? 0}
            y1={a.y ?? 0}
            x2={b.x ?? 0}
            y2={b.y ?? 0}
            stroke={CHART_TOKEN.border}
            strokeWidth={EDGE_WIDTH}
          />
        );
      })}
      {visible.map((n, i) => {
        const color = seriesColor(i, n.color);
        const deg = degree.get(n.id) ?? 0;
        const r =
          nodeSize === "degree"
            ? NETWORK_NODE_MIN_R +
              Math.min(NETWORK_NODE_MAX_GROWTH, deg * NETWORK_NODE_GROWTH)
            : NETWORK_NODE_MIN_R;
        const label = n.label ?? n.id;
        const tip = `${label} (${deg} conexiones)`;
        return (
          <g key={stableKey([n.id], i)}>
            <title>{tip}</title>
            <circle
              cx={n.x ?? 0}
              cy={n.y ?? 0}
              r={r}
              fill={color}
              stroke={CHART_TOKEN.background}
              strokeWidth={NODE_BORDER_WIDTH}
              opacity={
                showIsolated && deg === 0 ? NETWORK_ISOLATED_OPACITY : undefined
              }
              data-chart-tip={tip}
            />
            <text
              x={(n.x ?? 0) + r + LABEL_GAP_PX}
              y={(n.y ?? 0) + LABEL_GAP_PX}
              fontSize={TICK_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.foreground}
            >
              {truncateLabel(label, 16)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
