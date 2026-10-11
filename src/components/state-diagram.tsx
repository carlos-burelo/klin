/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type StateNode = {
  id: string;
  label: string;
  kind?: "state" | "initial" | "final";
};

export type StateEdge = {
  from: string;
  to: string;
  /** Evento que dispara la transición. */
  label?: string;
};

/**
 * Máquina de estados SSR (inicial, estados, final, transiciones con evento).
 */
export function StateDiagram({
  nodes,
  edges,
  ariaLabel,
  direction = "LR",
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  nodes: StateNode[];
  edges: StateEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const W = fitNodeWidth(
    nodes.map((n) => n.label),
    { min: 150, max: 230, size: 12, pad: 36 },
  );
  const H = 52;
  const DOT = 28;
  const layout = layoutDag(
    nodes.map((n) => n.id),
    edges,
    { direction, nodeW: W, nodeH: H, gapX: 56, gapY: 72, minW: 560 },
  );
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const width = Math.max(1, layout.width);
  const height = Math.max(1, layout.height);

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
            id="charts-state-arrow"
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
          <path
            key={`${e.from}-${e.to}-${i}`}
            d={e.d}
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeWidth={1.5}
            markerEnd="url(#charts-state-arrow)"
          />
        ))}
        {[...layout.nodes.values()].map((p) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const kind = n.kind ?? "state";
          if (kind === "initial") {
            return (
              <g key={p.id}>
                <title>Inicial</title>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={DOT / 2}
                  fill="var(--color-foreground)"
                />
              </g>
            );
          }
          if (kind === "final") {
            return (
              <g key={p.id}>
                <title>{n.label || "Final"}</title>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={DOT / 2 + 4}
                  fill="none"
                  stroke="var(--color-foreground)"
                  strokeWidth={1.5}
                />
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={DOT / 2}
                  fill="var(--color-foreground)"
                />
              </g>
            );
          }
          const tip = n.label;
          return (
            <g key={p.id}>
              <title>{tip}</title>
              <rect
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                rx={12}
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth={1.5}
                data-chart-tip={tip}
              />
              <text
                x={p.cx}
                y={p.cy}
                dy={4}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="var(--color-foreground)"
              >
                {truncateLabel(n.label, 20)}
              </text>
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
