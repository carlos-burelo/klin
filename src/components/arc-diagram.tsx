import { seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type ArcNode = {
  id: string;
  label: string;
  color?: string;
};

export type ArcLink = {
  from: string;
  to: string;
  label?: string;
};

const W = 680;
const BASE_Y = 120;
const R = 7;

/**
 * Diagrama de arcos SSR (relaciones sobre un eje de nodos).
 */
export function ArcDiagram({
  nodes,
  links,
  ariaLabel,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  nodes: ArcNode[];
  links: ArcLink[];
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const known = new Set(nodes.map((n) => n.id));
  const clean = links.filter((l) => known.has(l.from) && known.has(l.to));
  const step = Math.min(150, (W - 48) / Math.max(1, nodes.length));
  const totalW = step * Math.max(0, nodes.length - 1);
  const ox = (W - totalW) / 2;
  const H = BASE_Y + 48;
  const degree = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  for (const l of clean) {
    degree.set(l.from, (degree.get(l.from) ?? 0) + 1);
    degree.set(l.to, (degree.get(l.to) ?? 0) + 1);
  }
  const order = new Map(nodes.map((n, i) => [n.id, i]));
  const xOf = (id: string) => ox + (order.get(id) ?? 0) * step;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto"
        style={{ minWidth: Math.min(W, 560) }}
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        {clean.map((l, i) => {
          const a = xOf(l.from);
          const b = xOf(l.to);
          const left = Math.min(a, b);
          const right = Math.max(a, b);
          const h = 24 + ((i * 37) % 90);
          const tip = l.label
            ? `${l.from} ↔ ${l.to}: ${l.label}`
            : `${l.from} ↔ ${l.to}`;
          return (
            <g key={`${l.from}-${l.to}-${i}`}>
              <title>{tip}</title>
              <path
                d={`M ${left} ${BASE_Y} C ${left} ${BASE_Y - h}, ${right} ${BASE_Y - h}, ${right} ${BASE_Y}`}
                fill="none"
                stroke="var(--color-chart-2)"
                strokeWidth={1.5}
                strokeOpacity={0.8}
                data-chart-tip={tip}
              />
            </g>
          );
        })}
        {nodes.map((n, i) => {
          const deg = degree.get(n.id) ?? 0;
          const color = seriesColor(i, n.color);
          const tip = `${n.label} (${deg} relaciones)`;
          return (
            <g key={n.id}>
              <title>{tip}</title>
              <circle
                cx={xOf(n.id)}
                cy={BASE_Y}
                r={R + Math.min(5, deg)}
                fill={color}
                stroke="var(--background)"
                strokeWidth={2}
                data-chart-tip={tip}
              />
              <text
                x={xOf(n.id)}
                y={BASE_Y + 22}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-muted-foreground)"
              >
                {truncateLabel(n.label, 14)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
