/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type HBarSeries = {
  key: string;
  label: string;
  color?: string;
};

const W = 640;
const MARGIN = { top: 8, right: 48, bottom: 28, left: 132 };

/**
 * Barras horizontales agrupadas SSR. Altura automática según filas.
 */
export function HorizontalBarChart({
  data,
  yKey,
  series,
  ariaLabel,
  formatX = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: Array<Record<string, string | number>>;
  yKey: string;
  series: HBarSeries[];
  ariaLabel: string;
  formatX?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const rowH = 30 + series.length * 4;
  const height = Math.max(140, MARGIN.top + MARGIN.bottom + data.length * rowH);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const top =
    max(data, (d) => Math.max(...series.map((s) => Number(d[s.key] ?? 0)))) ??
    0;

  const x = scaleLinear()
    .domain([0, Math.max(1, top)])
    .nice(4)
    .range([0, innerW]);
  const y0 = scaleBand()
    .domain(data.map((d) => String(d[yKey] ?? "")))
    .range([0, innerH])
    .padding(0.25);
  const y1 = scaleBand()
    .domain(series.map((s) => s.key))
    .range([0, y0.bandwidth()])
    .padding(0.15);

  const ticks = x.ticks(4);
  const colors = series.map((s, i) => seriesColor(i, s.color));

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
              x1={MARGIN.left + x(t)}
              x2={MARGIN.left + x(t)}
              y1={MARGIN.top}
              y2={height - MARGIN.bottom}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={MARGIN.left + x(t)}
              y={height - 10}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-muted-foreground)"
            >
              {formatX(t)}
            </text>
          </g>
        ))}
        {data.map((d) => {
          const group = String(d[yKey] ?? "");
          return (
            <g key={group}>
              <text
                x={MARGIN.left - 8}
                y={MARGIN.top + (y0(group) ?? 0) + y0.bandwidth() / 2}
                dy={4}
                textAnchor="end"
                fontSize={11}
                fill="var(--color-muted-foreground)"
              >
                <title>{group}</title>
                {truncateLabel(group, 18)}
              </text>
              {series.map((s, si) => {
                const value = Number(d[s.key] ?? 0);
                const bw = Math.max(1, x(value));
                const by = MARGIN.top + (y0(group) ?? 0) + (y1(s.key) ?? 0);
                const tip = `${group} · ${s.label}: ${formatX(value)}`;
                return (
                  <g key={s.key}>
                    <title>{tip}</title>
                    <rect
                      x={MARGIN.left}
                      y={by}
                      width={value === 0 ? 2 : bw}
                      height={Math.max(2, y1.bandwidth())}
                      rx={4}
                      fill={colors[si]}
                      data-chart-tip={tip}
                    />
                    <text
                      x={MARGIN.left + bw + 5}
                      y={by + y1.bandwidth() / 2}
                      dy={4}
                      fontSize={11}
                      fill="var(--color-muted-foreground)"
                    >
                      {formatX(value)}
                    </text>
                  </g>
                );
              })}
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
