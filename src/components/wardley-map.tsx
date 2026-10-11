import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type WardleyNode = {
  id: string;
  label: string;
  /** 0 (génesis) – 1 (commodity). */
  x: number;
  /** 0 (base) – 1 (visible/usuario). */
  y: number;
  color?: string;
};

export type WardleyLink = {
  from: string;
  to: string;
};

const W = 640;
const H = 420;
const MARGIN = { top: 16, right: 16, bottom: 44, left: 16 };
const STAGES = ["Génesis", "Custom", "Producto", "Commodity"];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Mapa de Wardley SSR (cadena de valor vs. evolución).
 */
export function WardleyMap({
  nodes,
  links,
  ariaLabel,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  nodes: WardleyNode[];
  links: WardleyLink[];
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = H - MARGIN.top - MARGIN.bottom;
  const px = (v: number) => MARGIN.left + clamp01(v) * innerW;
  const py = (v: number) => MARGIN.top + (1 - clamp01(v)) * innerH;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const known = new Set(nodes.map((n) => n.id));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={MARGIN.left + f * innerW}
          x2={MARGIN.left + f * innerW}
          y1={MARGIN.top}
          y2={MARGIN.top + innerH}
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      ))}
      {STAGES.map((s, i) => (
        <text
          key={s}
          x={MARGIN.left + (i / (STAGES.length - 1)) * innerW}
          y={H - 24}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-muted-foreground)"
        >
          {s}
        </text>
      ))}
      <text
        x={MARGIN.left + innerW / 2}
        y={H - 8}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-muted-foreground)"
      >
        Evolución →
      </text>
      <text
        x={12}
        y={MARGIN.top + innerH / 2}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-muted-foreground)"
        transform={`rotate(-90, 12, ${MARGIN.top + innerH / 2})`}
      >
        Cadena de valor →
      </text>
      {links
        .filter((l) => known.has(l.from) && known.has(l.to))
        .map((l, i) => {
          const a = byId.get(l.from);
          const b = byId.get(l.to);
          if (!a || !b) return null;
          return (
            <line
              key={`${l.from}-${l.to}-${i}`}
              x1={px(a.x)}
              y1={py(a.y)}
              x2={px(b.x)}
              y2={py(b.y)}
              stroke="var(--color-muted-foreground)"
              strokeWidth={1.5}
            />
          );
        })}
      {nodes.map((n, i) => {
        const color = seriesColor(i, n.color);
        const tip = `${n.label} (${STAGES[Math.round(clamp01(n.x) * (STAGES.length - 1))]})`;
        return (
          <g key={n.id}>
            <title>{tip}</title>
            <circle
              cx={px(n.x)}
              cy={py(n.y)}
              r={9}
              fill={color}
              stroke="var(--background)"
              strokeWidth={2}
              data-chart-tip={tip}
            />
            <text
              x={px(n.x) + 13}
              y={py(n.y) + 4}
              fontSize={11}
              fontWeight={600}
              fill="var(--color-foreground)"
            >
              {truncateLabel(n.label, 20)}
            </text>
            <text
              x={px(n.x)}
              y={py(n.y) + 22}
              textAnchor="middle"
              fontSize={10}
              fontFamily="var(--font-mono, monospace)"
              fill="var(--color-muted-foreground)"
            >
              {`${formatDefault(Math.round(clamp01(n.x) * 100))}%`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
