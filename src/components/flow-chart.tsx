/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type FlowNode = {
  id: string;
  label: string;
  sub?: string;
  kind?: "start" | "end" | "process" | "decision";
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
};

/**
 * Flujo SSR (procesos y decisiones). Layout en capas top-down o left-right.
 */
export function FlowChart({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  nodes: FlowNode[];
  edges: FlowEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const W = fitNodeWidth(
    nodes.flatMap((n) => (n.sub ? [n.label, n.sub] : [n.label])),
    { min: 150, max: 230, size: 12, pad: 36 },
  );
  const H = 56;
  const layout = layoutDag(
    nodes.map((n) => n.id),
    edges,
    { direction, nodeW: W, nodeH: H, gapX: 44, gapY: 64, minW: 560 },
  );
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const width = Math.max(1, layout.width);
  const height = Math.max(1, layout.height);

  const fillFor = (kind: FlowNode["kind"]) =>
    kind === "start"
      ? "var(--color-primary)"
      : kind === "end"
        ? "var(--muted)"
        : "var(--card)";

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        style={{ minWidth: width }}
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        <defs>
          <marker
            id="charts-flow-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 1 L 9 5 L 0 9 z"
              fill="var(--color-muted-foreground)"
            />
          </marker>
        </defs>
        {layout.edges.map((e, i) => (
          <g key={`${e.from}-${e.to}-${i}`}>
            <path
              d={e.d}
              fill="none"
              stroke="var(--color-muted-foreground)"
              strokeWidth={1.5}
              markerEnd="url(#charts-flow-arrow)"
            />
          </g>
        ))}
        {[...layout.nodes.values()].map((p) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const kind = n.kind ?? "process";
          const tip = n.sub ? `${n.label} · ${n.sub}` : n.label;
          const fg =
            kind === "start"
              ? "var(--color-primary-foreground)"
              : "var(--color-foreground)";
          return (
            <g key={p.id}>
              <title>{tip}</title>
              {kind === "decision" ? (
                <polygon
                  points={`${p.cx},${p.y} ${p.x + p.w},${p.cy} ${p.cx},${p.y + p.h} ${p.x},${p.cy}`}
                  fill={fillFor(kind)}
                  stroke="var(--color-chart-2)"
                  strokeWidth={1.5}
                  data-chart-tip={tip}
                />
              ) : (
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={kind === "start" || kind === "end" ? p.h / 2 : 8}
                  fill={fillFor(kind)}
                  stroke={
                    kind === "start" || kind === "end"
                      ? "transparent"
                      : "var(--border)"
                  }
                  strokeWidth={1.5}
                  data-chart-tip={tip}
                />
              )}
              <text
                x={p.cx}
                y={p.cy + (n.sub ? -3 : 4)}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill={fg}
              >
                {truncateLabel(n.label, 20)}
              </text>
              {n.sub ? (
                <text
                  x={p.cx}
                  y={p.cy + 12}
                  textAnchor="middle"
                  fontSize={10}
                  fill={kind === "start" ? fg : "var(--color-muted-foreground)"}
                  opacity={kind === "start" ? 0.85 : 1}
                >
                  {truncateLabel(n.sub, 24)}
                </text>
              ) : null}
            </g>
          );
        })}
        {layout.edges.map((e) => {
          const edge = edges.find((x) => x.from === e.from && x.to === e.to);
          return edge?.label ? (
            <EdgeLabel
              key={`${e.from}-${e.to}-${edge.label}`}
              mx={e.mx}
              my={e.my}
              text={edge.label}
            />
          ) : null;
        })}
      </svg>
    </div>
  );
}
