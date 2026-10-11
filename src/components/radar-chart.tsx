/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max } from "d3-array";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type RadarSeries = {
  label: string;
  values: number[];
  color?: string;
};

/**
 * Radar (telaraña) SSR para perfiles multivariados.
 */
export function RadarChart({
  axes,
  series,
  ariaLabel,
  size = 300,
  levels = 4,
  maxValue,
  formatTick = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  axes: string[];
  series: RadarSeries[];
  ariaLabel: string;
  size?: number;
  levels?: number;
  maxValue?: number;
  formatTick?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const center = size / 2;
  const radius = size / 2 - 44;

  if (axes.length < 3 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const top = Math.max(
    1,
    maxValue ?? max(series, (s) => max(s.values) ?? 0) ?? 1,
  );
  const angle = (i: number) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  const point = (i: number, v: number) => {
    const r = (Math.max(0, v) / top) * radius;
    return `${center + r * Math.cos(angle(i))},${center + r * Math.sin(angle(i))}`;
  };
  const colors = series.map((s, i) => seriesColor(i, s.color));

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="h-auto max-w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        {Array.from({ length: levels }, (_, li) => {
          const frac = (li + 1) / levels;
          return (
            <polygon
              key={frac}
              points={axes.map((_, i) => point(i, top * frac)).join(" ")}
              fill="none"
              stroke="var(--border)"
              strokeWidth={1}
            />
          );
        })}
        {axes.map((axis, i) => (
          <g key={axis}>
            <line
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle(i))}
              y2={center + radius * Math.sin(angle(i))}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={center + (radius + 14) * Math.cos(angle(i))}
              y={center + (radius + 14) * Math.sin(angle(i))}
              dy={4}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-muted-foreground)"
            >
              {axis}
            </text>
          </g>
        ))}
        {series.map((s, si) => (
          <g key={s.label}>
            <title>{`${s.label}: ${s.values.map((v) => formatTick(v)).join(" · ")}`}</title>
            <polygon
              points={s.values.map((v, i) => point(i, v)).join(" ")}
              fill={colors[si]}
              fillOpacity={0.18}
              stroke={colors[si]}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            {s.values.map((v, i) => {
              const tip = `${s.label} · ${axes[i]}: ${formatTick(v)}`;
              const [cx, cy] = point(i, v).split(",").map(Number);
              return (
                <g key={`${s.label}-${i}`}>
                  <title>{tip}</title>
                  <circle
                    cx={cx ?? center}
                    cy={cy ?? center}
                    r={3}
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
