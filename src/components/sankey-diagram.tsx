import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type SankeyNode = {
  id: string;
  label: string;
  color?: string;
};

export type SankeyFlow = {
  from: string;
  to: string;
  value: number;
};

const W = 680;
const H = 360;

/**
 * Sankey SSR (flujos ponderados entre etapas).
 */
export function SankeyDiagram({
  nodes,
  flows,
  ariaLabel,
  formatValue = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  nodes: SankeyNode[];
  flows: SankeyFlow[];
  ariaLabel: string;
  formatValue?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (nodes.length === 0 || flows.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const known = new Set(nodes.map((n) => n.id));
  type NodeDatum = { id: string; label: string; color?: string };
  type LinkDatum = { value: number };
  const graph = sankey<NodeDatum, LinkDatum>()
    .nodeId((d) => d.id)
    .nodeWidth(14)
    .nodePadding(14)
    .extent([
      [120, 8],
      [W - 8, H - 8],
    ])({
    nodes: nodes.map((n) => ({ ...n })),
    links: flows
      .filter((f) => known.has(f.from) && known.has(f.to) && f.value > 0)
      .map((f) => ({ source: f.from, target: f.to, value: f.value })),
  });

  if (graph.links.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const colorOf = (id: string, i: number) => {
    const n = nodes.find((x) => x.id === id);
    return seriesColor(i, n?.color);
  };
  const order = new Map(nodes.map((n, i) => [n.id, i]));

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          style={{ minWidth: Math.min(W, 560) }}
          role="img"
          aria-label={ariaLabel}
        >
          <title>{ariaLabel}</title>
          {graph.links.map((l) => {
            const s = l.source as { id: string; label: string };
            const t = l.target as { id: string; label: string };
            const tip = `${s.label} → ${t.label}: ${formatValue(l.value ?? 0)}`;
            return (
              <g key={`${s.id}-${t.id}`}>
                <title>{tip}</title>
                <path
                  d={sankeyLinkHorizontal()(l) ?? ""}
                  fill="none"
                  stroke={colorOf(s.id, order.get(s.id) ?? 0)}
                  strokeOpacity={0.35}
                  strokeWidth={Math.max(1, l.width ?? 1)}
                  data-chart-tip={tip}
                />
              </g>
            );
          })}
          {graph.nodes.map((n, i) => {
            const tip = `${n.label}: ${formatValue(n.value ?? 0)}`;
            const left = (n.x0 ?? 0) < W / 2;
            return (
              <g key={n.id ?? i}>
                <title>{tip}</title>
                <rect
                  x={n.x0 ?? 0}
                  y={n.y0 ?? 0}
                  width={Math.max(2, (n.x1 ?? 0) - (n.x0 ?? 0))}
                  height={Math.max(2, (n.y1 ?? 0) - (n.y0 ?? 0))}
                  rx={3}
                  fill={colorOf(n.id ?? "", i)}
                  data-chart-tip={tip}
                />
                <text
                  x={left ? (n.x0 ?? 0) - 6 : (n.x1 ?? 0) + 6}
                  y={((n.y0 ?? 0) + (n.y1 ?? 0)) / 2}
                  dy={4}
                  textAnchor={left ? "end" : "start"}
                  fontSize={11}
                  fill="var(--color-muted-foreground)"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <ChartLegend
        items={nodes.map((n, i) => ({
          label: n.label,
          color: colorOf(n.id, i),
        }))}
      />
    </div>
  );
}
