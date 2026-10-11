import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type ActorNode = {
  id: string;
  label: string;
};

export type UseCaseNode = {
  id: string;
  label: string;
};

export type UseCaseEdge = {
  from: string;
  to: string;
  /** `include` / `extend` (punteada) o asociación simple. */
  kind?: "association" | "include" | "extend";
};

/**
 * Casos de uso UML SSR (actores + elipses + include/extend).
 */
export function UseCaseDiagram({
  actors,
  usecases,
  edges,
  ariaLabel,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  actors: ActorNode[];
  usecases: UseCaseNode[];
  edges: UseCaseEdge[];
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (actors.length === 0 && usecases.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const W = fitNodeWidth(
    [...actors.map((a) => a.label), ...usecases.map((u) => u.label)],
    { min: 150, max: 210, size: 11, pad: 48 },
  );
  const H = 56;
  const all = [...actors.map((a) => a.id), ...usecases.map((u) => u.id)];
  const layout = layoutDag(all, edges, {
    direction: "LR",
    nodeW: W,
    nodeH: H,
    gapX: 72,
    gapY: 36,
    minW: 560,
  });
  const actorIds = new Set(actors.map((a) => a.id));
  const names = new Map([
    ...actors.map((a) => [a.id, a.label] as const),
    ...usecases.map((u) => [u.id, u.label] as const),
  ]);
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
        {layout.edges.map((e, i) => {
          const edge = edges.find((x) => x.from === e.from && x.to === e.to);
          const dashed = edge?.kind === "include" || edge?.kind === "extend";
          return (
            <line
              key={`${e.from}-${e.to}-${i}`}
              x1={layout.nodes.get(e.from)?.cx ?? 0}
              y1={layout.nodes.get(e.from)?.cy ?? 0}
              x2={layout.nodes.get(e.to)?.cx ?? 0}
              y2={layout.nodes.get(e.to)?.cy ?? 0}
              stroke="var(--color-muted-foreground)"
              strokeWidth={1.5}
              strokeDasharray={dashed ? "5 4" : undefined}
            />
          );
        })}
        {[...layout.nodes.values()].map((p) => {
          const label = names.get(p.id) ?? p.id;
          const tip = label;
          if (actorIds.has(p.id)) {
            return (
              <g key={p.id}>
                <title>{tip}</title>
                <g
                  stroke="var(--color-foreground)"
                  strokeWidth={1.75}
                  fill="none"
                  data-chart-tip={tip}
                >
                  <circle cx={p.cx} cy={p.y + 9} r={7} />
                  <line x1={p.cx} y1={p.y + 16} x2={p.cx} y2={p.y + 34} />
                  <line
                    x1={p.cx - 10}
                    y1={p.y + 22}
                    x2={p.cx + 10}
                    y2={p.y + 22}
                  />
                  <line x1={p.cx} y1={p.y + 34} x2={p.cx - 9} y2={p.y + 48} />
                  <line x1={p.cx} y1={p.y + 34} x2={p.cx + 9} y2={p.y + 48} />
                </g>
                <text
                  x={p.cx}
                  y={p.y + p.h - 2}
                  textAnchor="middle"
                  fontSize={11}
                  fill="var(--color-muted-foreground)"
                >
                  {truncateLabel(label, 20)}
                </text>
              </g>
            );
          }
          return (
            <g key={p.id}>
              <title>{tip}</title>
              <ellipse
                cx={p.cx}
                cy={p.cy}
                rx={p.w / 2}
                ry={p.h / 2}
                fill="var(--card)"
                stroke="var(--color-chart-2)"
                strokeWidth={1.5}
                data-chart-tip={tip}
              />
              <text
                x={p.cx}
                y={p.cy}
                dy={4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--color-foreground)"
              >
                {truncateLabel(label, 22)}
              </text>
            </g>
          );
        })}
        {layout.edges.map((e) => {
          const edge = edges.find((x) => x.from === e.from && x.to === e.to);
          const tag =
            edge?.kind === "include" || edge?.kind === "extend"
              ? `«${edge.kind}»`
              : null;
          return tag ? (
            <EdgeLabel
              key={`${e.from}-${e.to}-${tag}`}
              mx={e.mx}
              my={e.my - 4}
              text={tag}
            />
          ) : null;
        })}
      </svg>
    </div>
  );
}
