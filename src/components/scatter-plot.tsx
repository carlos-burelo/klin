/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max, min } from "d3-array";
import { scaleLinear } from "d3-scale";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type ScatterPoint = {
  x: number;
  y: number;
  label?: string;
};

/**
 * Dispersión XY SSR (correlaciones, outliers).
 */
export function ScatterPlot({
  points,
  ariaLabel,
  xLabel = "x",
  yLabel = "y",
  height = 260,
  formatTick = formatDefault,
  color,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  points: ScatterPoint[];
  ariaLabel: string;
  xLabel?: string;
  yLabel?: string;
  height?: number;
  formatTick?: (value: number) => string;
  color?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (points.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const W = 640;
  const MARGIN = { top: 12, right: 16, bottom: 36, left: 48 };
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x = scaleLinear()
    .domain([Math.min(0, min(xs) ?? 0), max(xs) ?? 1])
    .nice(4)
    .range([0, innerW]);
  const y = scaleLinear()
    .domain([Math.min(0, min(ys) ?? 0), max(ys) ?? 1])
    .nice(4)
    .range([innerH, 0]);

  const fill = seriesColor(0, color);

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      {y.ticks(4).map((t) => (
        <g key={`y${t}`}>
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
            {formatTick(t)}
          </text>
        </g>
      ))}
      {x.ticks(5).map((t) => (
        <text
          key={`x${t}`}
          x={MARGIN.left + x(t)}
          y={height - 18}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-muted-foreground)"
        >
          {formatTick(t)}
        </text>
      ))}
      <text
        x={MARGIN.left + innerW / 2}
        y={height - 2}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-muted-foreground)"
      >
        {xLabel}
      </text>
      {points.map((p, i) => {
        const tip = `${p.label ? `${p.label}: ` : ""}(${formatTick(p.x)}, ${formatTick(p.y)})`;
        return (
          <g key={`${p.x}-${p.y}-${i}`}>
            <title>{tip}</title>
            <circle
              cx={MARGIN.left + x(p.x)}
              cy={MARGIN.top + y(p.y)}
              r={4.5}
              fill={fill}
              fillOpacity={0.75}
              stroke="var(--background)"
              strokeWidth={1.5}
              data-chart-tip={tip}
            />
          </g>
        );
      })}
      <text
        x={12}
        y={MARGIN.top + innerH / 2}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-muted-foreground)"
        transform={`rotate(-90, 12, ${MARGIN.top + innerH / 2})`}
      >
        {yLabel}
      </text>
    </svg>
  );
}
