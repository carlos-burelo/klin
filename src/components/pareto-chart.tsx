/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max, sum } from "d3-array";
import { scaleBand, scaleLinear, scalePoint } from "d3-scale";
import { curveMonotoneX, line } from "d3-shape";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

const W = 640;
const MARGIN = { top: 12, right: 48, bottom: 32, left: 44 };

/**
 * Pareto SSR (barras ordenadas + % acumulado en segundo eje).
 */
export function ParetoChart({
  data,
  xKey,
  yKey,
  ariaLabel,
  height = 280,
  formatY = formatDefault,
  color,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  ariaLabel: string;
  height?: number;
  formatY?: (value: number) => string;
  color?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (data.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const ordered = [...data].sort(
    (a, b) => Number(b[yKey] ?? 0) - Number(a[yKey] ?? 0),
  );
  const total = sum(ordered, (d) => Number(d[yKey] ?? 0));
  const top = Math.max(1, max(ordered, (d) => Number(d[yKey] ?? 0)) ?? 1);

  const y = scaleLinear().domain([0, top]).nice(4).range([innerH, 0]);
  const yp = scaleLinear().domain([0, 100]).range([innerH, 0]);
  const x = scaleBand()
    .domain(ordered.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(0.25);
  const ticks = y.ticks(4);
  const fill = seriesColor(0, color);
  const lineColor = seriesColor(1, undefined);

  let acc = 0;
  const cum = ordered.map((d) => {
    acc += total === 0 ? 0 : (Number(d[yKey] ?? 0) / total) * 100;
    return { label: String(d[xKey] ?? ""), pct: acc };
  });
  const xp = scalePoint()
    .domain(cum.map((c) => c.label))
    .range([0, innerW])
    .padding(0.5);
  const path =
    line<{ label: string; pct: number }>()
      .x((p) => (xp(p.label) ?? 0) + x.bandwidth() / 2)
      .y((p) => yp(p.pct))
      .curve(curveMonotoneX)(cum) ?? "";

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
            <text
              x={W - MARGIN.right + 8}
              y={MARGIN.top + yp((t / top) * 100)}
              dy={4}
              textAnchor="start"
              fontSize={11}
              fill="var(--color-muted-foreground)"
            >
              {`${Math.round((t / top) * 100)}%`}
            </text>
          </g>
        ))}
        {ordered.map((d) => {
          const group = String(d[xKey] ?? "");
          const value = Number(d[yKey] ?? 0);
          const pct = total === 0 ? 0 : Math.round((value / total) * 100);
          const tip = `${group}: ${formatY(value)} (${pct}% · acumulado)`;
          return (
            <g key={group}>
              <title>{tip}</title>
              <rect
                x={MARGIN.left + (x(group) ?? 0)}
                y={MARGIN.top + y(value)}
                width={x.bandwidth()}
                height={Math.max(1, innerH - y(value))}
                rx={4}
                fill={fill}
                data-chart-tip={tip}
              />
              <text
                x={MARGIN.left + (x(group) ?? 0) + x.bandwidth() / 2}
                y={height - 10}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-muted-foreground)"
              >
                <title>{group}</title>
                {truncateLabel(group)}
              </text>
            </g>
          );
        })}
        <path
          d={path}
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {cum.map((c) => (
          <g key={c.label}>
            <title>{`${c.label}: ${Math.round(c.pct)}% acumulado`}</title>
            <circle
              cx={MARGIN.left + (xp(c.label) ?? 0) + x.bandwidth() / 2}
              cy={MARGIN.top + yp(c.pct)}
              r={3.5}
              fill={lineColor}
              stroke="var(--background)"
              strokeWidth={1.5}
              data-chart-tip={`${c.label}: ${Math.round(c.pct)}% acumulado`}
            />
          </g>
        ))}
      </svg>
      <ChartLegend
        items={[
          { label: "Valor", color: fill },
          { label: "% acumulado", color: lineColor },
        ]}
      />
    </div>
  );
}
