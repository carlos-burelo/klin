/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max } from "d3-array";
import { scaleLinear, scalePoint } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type AreaSeries = {
  key: string;
  label: string;
  color?: string;
};

const W = 640;
const MARGIN = { top: 12, right: 12, bottom: 32, left: 44 };

/**
 * Áreas SSR (superpuestas o apiladas). Eje X por categorías.
 */
export function AreaChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY = formatDefault,
  stacked = false,
  normalize = false,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: AreaSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: (value: number) => string;
  stacked?: boolean;
  /** Apila a 100 % (implica `stacked`). */
  normalize?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const labels = data.map((d) => String(d[xKey] ?? ""));
  const totals = data.map((d) =>
    series.reduce((acc, s) => acc + Number(d[s.key] ?? 0), 0),
  );

  const top = stacked
    ? (max(totals) ?? 0)
    : (max(data, (d) =>
        Math.max(...series.map((s) => Number(d[s.key] ?? 0))),
      ) ?? 0);

  const x = scalePoint().domain(labels).range([0, innerW]).padding(0.5);
  const y = (
    normalize
      ? scaleLinear().domain([0, 1])
      : scaleLinear()
          .domain([0, Math.max(1, top)])
          .nice(4)
  ).range([innerH, 0]);
  const ticks = y.ticks(4);
  const colors = series.map((s, i) => seriesColor(i, s.color));
  const fmt = normalize ? (v: number) => `${Math.round(v * 100)}%` : formatY;

  // Base acumulada por etiqueta cuando es apilada.
  const bases = new Map<string, number>(labels.map((l) => [l, 0]));

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
        {series.map((s, si) => {
          const pts = data.map((d, di) => {
            const label = String(d[xKey] ?? "");
            const raw = Number(d[s.key] ?? 0);
            const total = totals[di] ?? 0;
            const value = normalize && total > 0 ? raw / total : raw;
            const base = stacked || normalize ? (bases.get(label) ?? 0) : 0;
            if (stacked || normalize)
              bases.set(label, base + (normalize ? value : raw));
            return { label, value, raw, base };
          });
          const areaPath =
            area<{ label: string; value: number; raw: number; base: number }>()
              .x((p) => x(p.label) ?? 0)
              .y0((p) => y(p.base))
              .y1((p) => y(p.base + p.value))
              .curve(curveMonotoneX)(pts) ?? "";
          const linePath =
            line<{ label: string; value: number; raw: number; base: number }>()
              .x((p) => x(p.label) ?? 0)
              .y((p) => y(p.base + p.value))
              .curve(curveMonotoneX)(pts) ?? "";
          return (
            <g
              key={s.key}
              transform={`translate(${MARGIN.left},${MARGIN.top})`}
            >
              <title>{`${s.label}: total ${formatY(pts.reduce((a, p) => a + p.raw, 0))}`}</title>
              <path d={areaPath} fill={colors[si]} opacity={0.22} />
              <path
                d={linePath}
                fill="none"
                stroke={colors[si]}
                strokeWidth={2}
                strokeLinecap="round"
              />
              {pts.map((p) => {
                const tip = normalize
                  ? `${p.label} · ${s.label}: ${formatY(p.raw)} (${Math.round(p.value * 100)}%)`
                  : `${p.label} · ${s.label}: ${formatY(p.raw)}`;
                return (
                  <g key={p.label}>
                    <title>{tip}</title>
                    <circle
                      cx={x(p.label) ?? 0}
                      cy={y(p.base + p.value)}
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
