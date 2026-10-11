import { max } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type VStackSeries = {
  key: string;
  label: string;
  color?: string;
};

const W = 640;
const MARGIN = { top: 12, right: 12, bottom: 32, left: 44 };

/**
 * Barras verticales apiladas SSR, con modo `normalize` (100 %).
 */
export function VerticalStackedBar({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY = formatDefault,
  normalize = false,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: VStackSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: (value: number) => string;
  normalize?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const totals = data.map((d) =>
    series.reduce((acc, s) => acc + Number(d[s.key] ?? 0), 0),
  );
  const top = normalize ? 1 : Math.max(1, max(totals) ?? 0);

  const y = scaleLinear().domain([0, top]).nice(4).range([innerH, 0]);
  const x = scaleBand()
    .domain(data.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(0.3);

  const ticks = y.ticks(4);
  const colors = series.map((s, i) => seriesColor(i, s.color));
  const fmt = normalize ? (v: number) => `${Math.round(v * 100)}%` : formatY;

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
              {fmt(t)}
            </text>
          </g>
        ))}
        {data.map((d, di) => {
          const group = String(d[xKey] ?? "");
          const total = totals[di] ?? 0;
          const full = normalize ? 1 : total;
          let base = 0;
          const colX = MARGIN.left + (x(group) ?? 0);
          const clipId = `vs-${di}`;
          return (
            <g key={group}>
              <text
                x={colX + x.bandwidth() / 2}
                y={height - 10}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-muted-foreground)"
              >
                <title>{group}</title>
                {truncateLabel(group)}
              </text>
              <defs>
                <clipPath id={clipId}>
                  <rect
                    x={colX}
                    y={MARGIN.top + y(full)}
                    width={x.bandwidth()}
                    height={Math.max(1, innerH - y(full))}
                    rx={4}
                  />
                </clipPath>
              </defs>
              <g clipPath={`url(#${clipId})`}>
                {series.map((s, si) => {
                  const raw = Number(d[s.key] ?? 0);
                  const frac = normalize && total > 0 ? raw / total : raw;
                  const yTop = y(base + frac);
                  const yBase = y(base);
                  base += frac;
                  const tip = normalize
                    ? `${group} · ${s.label}: ${formatY(raw)} (${Math.round((total > 0 ? raw / total : 0) * 100)}%)`
                    : `${group} · ${s.label}: ${formatY(raw)}`;
                  if (frac <= 0) return <g key={s.key} />;
                  return (
                    <g key={s.key}>
                      <title>{tip}</title>
                      <rect
                        x={colX}
                        y={MARGIN.top + yTop}
                        width={x.bandwidth()}
                        height={Math.max(1, yBase - yTop)}
                        fill={colors[si]}
                        data-chart-tip={tip}
                      />
                    </g>
                  );
                })}
              </g>
            </g>
          );
        })}
      </svg>
      <ChartLegend
        items={series.map((s, i) => ({
          label: s.label,
          color: colors[i] ?? "var(--chart-1)",
        }))}
      />
    </div>
  );
}
