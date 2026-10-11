/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max, min, quantileSorted } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type BoxGroup = {
  label: string;
  values: number[];
  color?: string;
};

const W = 640;
const MARGIN = { top: 12, right: 12, bottom: 32, left: 44 };

type Stats = {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
};

function statsOf(values: number[]): Stats | null {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const q1 = quantileSorted(sorted, 0.25) ?? sorted[0] ?? 0;
  const median = quantileSorted(sorted, 0.5) ?? sorted[0] ?? 0;
  const q3 = quantileSorted(sorted, 0.75) ?? sorted[0] ?? 0;
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr;
  const hi = q3 + 1.5 * iqr;
  const inside = sorted.filter((v) => v >= lo && v <= hi);
  return {
    min: inside[0] ?? sorted[0] ?? 0,
    q1,
    median,
    q3,
    max: inside[inside.length - 1] ?? sorted[sorted.length - 1] ?? 0,
    outliers: sorted.filter((v) => v < lo || v > hi),
  };
}

/**
 * Cajas y bigotes SSR (distribución por grupo: min, Q1, mediana, Q3, max).
 */
export function BoxPlot({
  groups,
  ariaLabel,
  height = 260,
  formatY = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  groups: BoxGroup[];
  ariaLabel: string;
  height?: number;
  formatY?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const computed = groups
    .map((g) => ({ group: g, stats: statsOf(g.values) }))
    .filter((c) => c.stats !== null);
  if (computed.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const all = computed.flatMap((c) => [
    c.stats?.min ?? 0,
    c.stats?.max ?? 0,
    ...(c.stats?.outliers ?? []),
  ]);
  const y = scaleLinear()
    .domain([Math.min(0, min(all) ?? 0), max(all) ?? 1])
    .nice(4)
    .range([innerH, 0]);
  const x = scaleBand()
    .domain(computed.map((c) => c.group.label))
    .range([0, innerW])
    .padding(0.45);
  const ticks = y.ticks(4);
  const boxW = Math.min(56, x.bandwidth());

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={MARGIN.left}
              x2={W - MARGIN.right}
              y1={MARGIN.top + y(t)}
              y2={MARGIN.top + y(t)}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={MARGIN.left - 8}
              y={MARGIN.top + y(t)}
              dy={4}
              textAnchor="end"
              fontSize={11}
              fill="var(--color-muted-foreground)"
            >
              {formatY(t)}
            </text>
          </g>
        ))}
        {computed.map(({ group, stats }, gi) => {
          const s = stats;
          if (!s) return null;
          const cx = MARGIN.left + (x(group.label) ?? 0) + x.bandwidth() / 2;
          const color = seriesColor(gi, group.color);
          const tip =
            `${group.label}: min ${formatY(s.min)} · Q1 ${formatY(s.q1)} · ` +
            `mediana ${formatY(s.median)} · Q3 ${formatY(s.q3)} · max ${formatY(s.max)}` +
            (s.outliers.length > 0
              ? ` · atípicos ${s.outliers.map(formatY).join(", ")}`
              : "");
          return (
            <g key={group.label}>
              <title>{tip}</title>
              <text
                x={cx}
                y={height - 10}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-muted-foreground)"
              >
                <title>{group.label}</title>
                {truncateLabel(group.label)}
              </text>
              <line
                x1={cx}
                x2={cx}
                y1={MARGIN.top + y(s.max)}
                y2={MARGIN.top + y(s.min)}
                stroke={color}
                strokeWidth={1.5}
              />
              <line
                x1={cx - boxW / 2}
                x2={cx + boxW / 2}
                y1={MARGIN.top + y(s.max)}
                y2={MARGIN.top + y(s.max)}
                stroke={color}
                strokeWidth={1.5}
              />
              <line
                x1={cx - boxW / 2}
                x2={cx + boxW / 2}
                y1={MARGIN.top + y(s.min)}
                y2={MARGIN.top + y(s.min)}
                stroke={color}
                strokeWidth={1.5}
              />
              <rect
                x={cx - boxW / 2}
                y={MARGIN.top + y(s.q3)}
                width={boxW}
                height={Math.max(2, y(s.q1) - y(s.q3))}
                rx={4}
                fill={color}
                fillOpacity={0.35}
                stroke={color}
                strokeWidth={1.5}
                data-chart-tip={tip}
              />
              <line
                x1={cx - boxW / 2}
                x2={cx + boxW / 2}
                y1={MARGIN.top + y(s.median)}
                y2={MARGIN.top + y(s.median)}
                stroke={color}
                strokeWidth={2}
              />
              {s.outliers.map((o) => (
                <circle
                  key={o}
                  cx={cx}
                  cy={MARGIN.top + y(o)}
                  r={3}
                  fill="var(--background)"
                  stroke={color}
                  strokeWidth={1.5}
                />
              ))}
            </g>
          );
        })}
      </svg>
      <ChartLegend
        items={[
          { label: "Q1 – Q3", color: "var(--chart-1)" },
          { label: "Mediana", color: "var(--chart-2)" },
        ]}
      />
    </div>
  );
}
