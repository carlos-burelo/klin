import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type ArchNode = {
  id: string;
  label: string;
  sub?: string;
  kind?: "service" | "database" | "queue" | "actor" | "external";
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
};

/**
 * Arquitectura SSR (servicios, bases, colas, actores, externos).
 */
export function ArchitectureDiagram({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  nodes: ArchNode[];
  edges: ArchEdge[];
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
    { min: 150, max: 230, size: 12, pad: 40 },
  );
  const H = 60;
  const layout = layoutDag(
    nodes.map((n) => n.id),
    edges,
    { direction, nodeW: W, nodeH: H, gapX: 48, gapY: 68, minW: 560 },
  );
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const width = Math.max(1, layout.width);
  const height = Math.max(1, layout.height);

  const strokeFor = (kind: ArchNode["kind"]) =>
    kind === "external"
      ? "var(--color-muted-foreground)"
      : kind === "database"
        ? "var(--color-chart-3)"
        : kind === "queue"
          ? "var(--color-chart-4)"
          : "var(--color-chart-1)";

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
            id="charts-arch-arrow"
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
            markerEnd="url(#charts-arch-arrow)"
          />
        ))}
        {[...layout.nodes.values()].map((p) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const kind = n.kind ?? "service";
          const tip = n.sub ? `${n.label} · ${n.sub}` : n.label;
          const stroke = strokeFor(kind);
          const dashed = kind === "external" ? "5 4" : undefined;
          return (
            <g key={p.id}>
              <title>{tip}</title>
              {kind === "database" ? (
                <g data-chart-tip={tip}>
                  <path
                    d={`M ${p.x} ${p.y + 10} A ${p.w / 2} 10 0 0 1 ${p.x + p.w} ${p.y + 10} L ${p.x + p.w} ${p.y + p.h - 4} A ${p.w / 2} 10 0 0 1 ${p.x} ${p.y + p.h - 4} Z`}
                    fill="var(--card)"
                    stroke={stroke}
                    strokeWidth={1.5}
                  />
                  <ellipse
                    cx={p.cx}
                    cy={p.y + 10}
                    rx={p.w / 2}
                    ry={10}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={1.5}
                  />
                </g>
              ) : kind === "actor" ? (
                <g data-chart-tip={tip}>
                  <rect
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height={p.h}
                    rx={p.h / 2}
                    fill="var(--card)"
                    stroke={stroke}
                    strokeWidth={1.5}
                    strokeDasharray={dashed}
                  />
                  <circle cx={p.x + 22} cy={p.cy} r={8} fill={stroke} />
                </g>
              ) : (
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={8}
                  fill="var(--card)"
                  stroke={stroke}
                  strokeWidth={1.5}
                  strokeDasharray={dashed}
                  data-chart-tip={tip}
                />
              )}
              <text
                x={kind === "actor" ? p.x + 40 : p.cx}
                y={p.cy + (n.sub ? -3 : 4)}
                textAnchor={kind === "actor" ? "start" : "middle"}
                fontSize={12}
                fontWeight={600}
                fill="var(--color-foreground)"
              >
                {truncateLabel(n.label, kind === "actor" ? 16 : 20)}
              </text>
              {n.sub ? (
                <text
                  x={kind === "actor" ? p.x + 40 : p.cx}
                  y={p.cy + 12}
                  textAnchor={kind === "actor" ? "start" : "middle"}
                  fontSize={10}
                  fill="var(--color-muted-foreground)"
                >
                  {truncateLabel(n.sub, kind === "actor" ? 18 : 24)}
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
