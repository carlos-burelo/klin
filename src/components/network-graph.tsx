import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import { seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type NetworkNode = {
  id: string;
  label?: string;
  color?: string;
};

export type NetworkLink = {
  from: string;
  to: string;
};

/** LCG determinista: mismo grafo, mismo dibujo (SSR estable). */
function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const W = 640;
const H = 420;

/**
 * Red SSR (simulación de fuerzas con semilla fija, 300 ticks en servidor).
 */
export function NetworkGraph({
  nodes,
  links,
  ariaLabel,
  seed = 42,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  nodes: NetworkNode[];
  links: NetworkLink[];
  ariaLabel: string;
  seed?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const known = new Set(nodes.map((n) => n.id));
  type SimNode = NetworkNode & { x?: number; y?: number };
  const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
  const simLinks = links
    .filter((l) => known.has(l.from) && known.has(l.to))
    .map((l) => ({ source: l.from, target: l.to }));

  const sim = forceSimulation(simNodes)
    .randomSource(seededRandom(seed))
    .force(
      "link",
      forceLink<SimNode, { source: string; target: string }>(simLinks)
        .id((d) => d.id)
        .distance(110),
    )
    .force("charge", forceManyBody().strength(-160))
    .force("center", forceCenter(W / 2, H / 2))
    .force("collide", forceCollide(30))
    .stop();
  for (let i = 0; i < 300; i++) sim.tick();

  const pos = new Map(simNodes.map((n) => [n.id, n]));
  const degree = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  for (const l of links) {
    if (!known.has(l.from) || !known.has(l.to)) continue;
    degree.set(l.from, (degree.get(l.from) ?? 0) + 1);
    degree.set(l.to, (degree.get(l.to) ?? 0) + 1);
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      {links
        .filter((l) => known.has(l.from) && known.has(l.to))
        .map((l, i) => {
          const a = pos.get(l.from);
          const b = pos.get(l.to);
          if (!a || !b) return null;
          return (
            <line
              key={`${l.from}-${l.to}-${i}`}
              x1={a.x ?? 0}
              y1={a.y ?? 0}
              x2={b.x ?? 0}
              y2={b.y ?? 0}
              stroke="var(--border)"
              strokeWidth={1.5}
            />
          );
        })}
      {simNodes.map((n, i) => {
        const color = seriesColor(i, n.color);
        const deg = degree.get(n.id) ?? 0;
        const r = 8 + Math.min(8, deg * 1.5);
        const label = n.label ?? n.id;
        const tip = `${label} (${deg} conexiones)`;
        return (
          <g key={n.id}>
            <title>{tip}</title>
            <circle
              cx={n.x ?? 0}
              cy={n.y ?? 0}
              r={r}
              fill={color}
              stroke="var(--background)"
              strokeWidth={2}
              data-chart-tip={tip}
            />
            <text
              x={(n.x ?? 0) + r + 4}
              y={(n.y ?? 0) + 4}
              fontSize={11}
              fontWeight={600}
              fill="var(--color-foreground)"
            >
              {truncateLabel(label, 16)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
