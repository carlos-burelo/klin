import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type ClassNode = {
  id: string;
  name: string;
  attributes?: string[];
  methods?: string[];
};

export type ClassEdge = {
  from: string;
  to: string;
  kind?: "inheritance" | "association" | "composition" | "dependency";
  label?: string;
};

const TITLE_H = 30;
const ROW = 20;

/**
 * Diagrama de clases UML SSR (herencia, asociación, composición, dependencia).
 */
export function ClassDiagram({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  nodes: ClassNode[];
  edges: ClassEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const heights = new Map(
    nodes.map((n) => [
      n.id,
      TITLE_H +
        (n.attributes?.length ?? 0) * ROW +
        (n.methods?.length ?? 0) * ROW +
        10,
    ]),
  );
  const H = Math.max(64, ...heights.values());
  const W = fitNodeWidth(
    nodes.flatMap((n) => [
      n.name,
      ...(n.attributes ?? []),
      ...(n.methods ?? []),
    ]),
    { min: 180, max: 280, size: 11, pad: 40 },
  );
  const layout = layoutDag(
    nodes.map((n) => n.id),
    edges,
    { direction, nodeW: W, nodeH: H, gapX: 64, gapY: 72, minW: 560 },
  );
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const width = Math.max(1, layout.width);
  const height = Math.max(1, layout.height);

  const markerFor = (kind: ClassEdge["kind"]) =>
    kind === "inheritance"
      ? "url(#charts-class-inherit)"
      : kind === "composition"
        ? "url(#charts-class-composite)"
        : "url(#charts-class-arrow)";

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
            id="charts-class-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 1 L 9 5 L 0 9"
              fill="none"
              stroke="var(--color-muted-foreground)"
              strokeWidth={1.5}
            />
          </marker>
          <marker
            id="charts-class-inherit"
            viewBox="0 0 12 12"
            refX="10"
            refY="6"
            markerWidth="9"
            markerHeight="9"
            orient="auto-start-reverse"
          >
            <path
              d="M 1 1 L 11 6 L 1 11 z"
              fill="var(--background)"
              stroke="var(--color-muted-foreground)"
              strokeWidth={1.5}
            />
          </marker>
          <marker
            id="charts-class-composite"
            viewBox="0 0 12 12"
            refX="10"
            refY="6"
            markerWidth="9"
            markerHeight="9"
            orient="auto-start-reverse"
          >
            <path
              d="M 1 6 L 6 1 L 11 6 L 6 11 z"
              fill="var(--color-muted-foreground)"
            />
          </marker>
        </defs>
        {layout.edges.map((e, i) => {
          const edge = edges.find((x) => x.from === e.from && x.to === e.to);
          const kind = edge?.kind ?? "association";
          return (
            <path
              key={`${e.from}-${e.to}-${i}`}
              d={e.d}
              fill="none"
              stroke="var(--color-muted-foreground)"
              strokeWidth={1.5}
              strokeDasharray={kind === "dependency" ? "5 4" : undefined}
              markerEnd={markerFor(kind)}
            />
          );
        })}
        {[...layout.nodes.values()].map((p) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const h = heights.get(p.id) ?? H;
          const y0 = p.cy - h / 2;
          const attrs = n.attributes ?? [];
          const methods = n.methods ?? [];
          return (
            <g key={p.id}>
              <title>{n.name}</title>
              <rect
                x={p.x}
                y={y0}
                width={p.w}
                height={h}
                rx={8}
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth={1.5}
                data-chart-tip={n.name}
              />
              <line
                x1={p.x}
                y1={y0 + TITLE_H}
                x2={p.x + p.w}
                y2={y0 + TITLE_H}
                stroke="var(--border)"
                strokeWidth={1}
              />
              {methods.length > 0 ? (
                <line
                  x1={p.x}
                  y1={y0 + TITLE_H + attrs.length * ROW + 4}
                  x2={p.x + p.w}
                  y2={y0 + TITLE_H + attrs.length * ROW + 4}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
              ) : null}
              <text
                x={p.cx}
                y={y0 + 20}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="var(--color-foreground)"
              >
                {truncateLabel(n.name, 22)}
              </text>
              {attrs.map((a) => (
                <text
                  key={`a-${a}`}
                  x={p.x + 10}
                  y={y0 + TITLE_H + 15 + attrs.indexOf(a) * ROW}
                  fontSize={11}
                  fontFamily="var(--font-mono, monospace)"
                  fill="var(--color-muted-foreground)"
                >
                  {truncateLabel(a, 24)}
                </text>
              ))}
              {methods.map((m) => (
                <text
                  key={`m-${m}`}
                  x={p.x + 10}
                  y={
                    y0 +
                    TITLE_H +
                    attrs.length * ROW +
                    19 +
                    methods.indexOf(m) * ROW
                  }
                  fontSize={11}
                  fontFamily="var(--font-mono, monospace)"
                  fill="var(--color-muted-foreground)"
                >
                  {truncateLabel(m, 24)}
                </text>
              ))}
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
