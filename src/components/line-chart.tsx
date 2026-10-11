/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max } from "d3-array";
import { scaleLinear, scalePoint } from "d3-scale";
import { curveLinear, curveMonotoneX, curveStep, line } from "d3-shape";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type LineSeries = {
  key: string;
  label: string;
  color?: string;
};

const W = 640;
const MARGIN = { top: 12, right: 12, bottom: 32, left: 44 };

/**
 * Líneas SSR con puntos. Eje X por categorías (orden de `data`).
 */
export function LineChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY = formatDefault,
  curve = "monotone",
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: LineSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: (value: number) => string;
  /** monotone (suave), linear (recta) o step (escalón). */
  curve?: "monotone" | "linear" | "step";
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const labels = data.map((d) => String(d[xKey] ?? ""));

  const top =
    max(data, (d) => Math.max(...series.map((s) => Number(d[s.key] ?? 0)))) ??
    0;

  const x = scalePoint().domain(labels).range([0, innerW]).padding(0.5);
  const y = scaleLinear()
    .domain([0, Math.max(1, top)])
    .nice(4)
    .range([innerH, 0]);
  const ticks = y.ticks(4);
  const colors = series.map((s, i) => seriesColor(i, s.color));

  const pathFor = (key: string) =>
    line<{ label: string; value: number }>()
      .x((p) => x(p.label) ?? 0)
      .y((p) => y(p.value))
      .curve(
        curve === "step"
          ? curveStep
          : curve === "linear"
            ? curveLinear
            : curveMonotoneX,
      )(
      data.map((d) => ({
        label: String(d[xKey] ?? ""),
        value: Number(d[key] ?? 0),
      })),
    );

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
        {labels.map((label) => (
          <text
            key={label}
            x={MARGIN.left + (x(label) ?? 0)}
            y={height - 10}
            textAnchor="middle"
            fontSize={11}
            fill="var(--color-muted-foreground)"
          >
            {label}
          </text>
        ))}
        {series.map((s, si) => (
          <g key={s.key}>
            <path
              d={pathFor(s.key) ?? ""}
              transform={`translate(${MARGIN.left},${MARGIN.top})`}
              fill="none"
              stroke={colors[si]}
              strokeWidth={2}
              strokeLinecap="round"
            />
            {data.map((d) => {
              const label = String(d[xKey] ?? "");
              const value = Number(d[s.key] ?? 0);
              const tip = `${label} · ${s.label}: ${formatY(value)}`;
              return (
                <g key={`${s.key}-${label}`}>
                  <title>{tip}</title>
                  <circle
                    cx={MARGIN.left + (x(label) ?? 0)}
                    cy={MARGIN.top + y(value)}
                    r={3.5}
                    fill={colors[si]}
                    stroke="var(--background)"
                    strokeWidth={1.5}
                    data-chart-tip={tip}
                  />
                </g>
              );
            })}
          </g>
        ))}
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
