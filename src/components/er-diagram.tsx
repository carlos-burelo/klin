import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type ErAttribute = {
  name: string;
  key?: "PK" | "FK";
};

export type ErEntity = {
  id: string;
  name: string;
  attributes: ErAttribute[];
};

export type ErRelation = {
  from: string;
  to: string;
  /** Cardinalidad (`1:N`, `N:M`, `1:1`). */
  label?: string;
};

const HEADER = 30;
const ROW = 22;

/**
 * Entidad-relación SSR (entidades con atributos + cardinalidades).
 */
export function ErDiagram({
  entities,
  relations,
  ariaLabel,
  direction = "LR",
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  entities: ErEntity[];
  relations: ErRelation[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (entities.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const heights = new Map(
    entities.map((e) => [e.id, HEADER + e.attributes.length * ROW + 6]),
  );
  const H = Math.max(60, ...heights.values());
  const W = fitNodeWidth(
    entities.flatMap((e) => [
      e.name,
      ...e.attributes.map((a) => `${a.key ? `${a.key} ` : ""}${a.name}`),
    ]),
    { min: 170, max: 280, size: 11, pad: 40 },
  );
  const layout = layoutDag(
    entities.map((e) => e.id),
    relations,
    { direction, nodeW: W, nodeH: H, gapX: 60, gapY: 72, minW: 560 },
  );
  const byId = new Map(entities.map((e) => [e.id, e]));
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
        {layout.edges.map((e, i) => (
          <path
            key={`${e.from}-${e.to}-${i}`}
            d={e.d}
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeWidth={1.5}
          />
        ))}
        {[...layout.nodes.values()].map((p) => {
          const entity = byId.get(p.id);
          if (!entity) return null;
          const h = heights.get(p.id) ?? H;
          const y0 = p.cy - h / 2;
          const tip = `${entity.name} (${entity.attributes.length} atributos)`;
          return (
            <g key={p.id}>
              <title>{tip}</title>
              <rect
                x={p.x}
                y={y0}
                width={p.w}
                height={h}
                rx={8}
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth={1.5}
                data-chart-tip={tip}
              />
              <line
                x1={p.x}
                y1={y0 + HEADER}
                x2={p.x + p.w}
                y2={y0 + HEADER}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={p.cx}
                y={y0 + 20}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="var(--color-foreground)"
              >
                {truncateLabel(entity.name, 22)}
              </text>
              {entity.attributes.map((a, i) => (
                <text
                  key={a.name}
                  x={p.x + 10}
                  y={y0 + HEADER + 16 + i * ROW}
                  fontSize={11}
                  fontFamily="var(--font-mono, monospace)"
                  fontWeight={a.key === "PK" ? 600 : 400}
                  textDecoration={a.key === "PK" ? "underline" : "none"}
                  fill="var(--color-muted-foreground)"
                >
                  {`${a.key ? `${a.key} ` : ""}${truncateLabel(a.name, 24)}`}
                </text>
              ))}
            </g>
          );
        })}
        {layout.edges.map((e) => {
          const rel = relations.find((x) => x.from === e.from && x.to === e.to);
          return rel?.label ? (
            <EdgeLabel
              key={`${e.from}-${e.to}-${rel.label}`}
              mx={e.mx}
              my={e.my}
              text={rel.label}
            />
          ) : null;
        })}
      </svg>
    </div>
  );
}
