/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { formatDefault } from "../core/format";
import { stableKey } from "../core/keys";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS_RADAR,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  AXIS_LABEL_OFFSET,
  computeRadarTop,
  DEFAULT_RADAR_GRID_SHAPE,
  normalizeRadarPointRadius,
  normalizeRadarStrokeWidth,
  RADAR_FILL_OPACITY,
  radarAngle,
  radarCenter,
  radarLevelRadius,
  radarPoint,
  radarRadius,
  radarSeriesColors,
  resolveRadarOpacity,
} from "./radar-chart.compute";
import type { RadarChartProps } from "./radar-chart.types";

export type { RadarGridShape } from "./radar-chart.compute";
export { DEFAULT_RADAR_GRID_SHAPE } from "./radar-chart.compute";
export type { RadarChartProps, RadarSeries } from "./radar-chart.types";

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
  fillOpacity = RADAR_FILL_OPACITY,
  showVertices = true,
  scale = "linear",
  gridShape = DEFAULT_RADAR_GRID_SHAPE,
  strokeWidth = LINE_WIDTH,
  pointRadius = POINT_RADIUS_RADAR,
  locale = DEFAULT_LOCALE,
  format = (v: number) => formatDefault(v, locale),
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: RadarChartProps) {
  const center = radarCenter(size);
  const radius = radarRadius(size);

  if (axes.length < 3 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const top = computeRadarTop(series, maxValue);
  const useSqrt = scale === "sqrt";
  const lineWidth = normalizeRadarStrokeWidth(strokeWidth);
  const vertexRadius = normalizeRadarPointRadius(pointRadius);
  const circularGrid = gridShape === "circle";
  const angle = (i: number) => radarAngle(i, axes.length);
  const point = (i: number, v: number) =>
    radarPoint(center, radius, top, useSqrt, axes.length, i, v);
  const seriesOpacity = (si: number) => resolveRadarOpacity(fillOpacity, si);
  const colors = radarSeriesColors(series);

  return (
    <div
      className={
        className
          ? `flex flex-col items-center ${className}`
          : "flex flex-col items-center"
      }
      style={style}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="h-auto max-w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {Array.from({ length: levels }, (_, li) => {
          const frac = (li + 1) / levels;
          return circularGrid ? (
            <circle
              // biome-ignore lint/suspicious/noArrayIndexKey: niveles estáticos orden inmutable
              key={`level__${li}`}
              cx={center}
              cy={center}
              r={radarLevelRadius(radius, useSqrt, frac)}
              fill="none"
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
          ) : (
            <polygon
              // biome-ignore lint/suspicious/noArrayIndexKey: niveles estáticos orden inmutable
              key={`level__${li}`}
              points={axes.map((_, i) => point(i, top * frac)).join(" ")}
              fill="none"
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
          );
        })}
        {axes.map((axis, i) => (
          <g key={stableKey([axis], i)}>
            <line
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle(i))}
              y2={center + radius * Math.sin(angle(i))}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={center + (radius + AXIS_LABEL_OFFSET) * Math.cos(angle(i))}
              y={center + (radius + AXIS_LABEL_OFFSET) * Math.sin(angle(i))}
              dy={TICK_DY}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {axis}
            </text>
          </g>
        ))}
        {series.map((s, si) => (
          <g
            key={stableKey([s.label], si)}
            data-chart-tip={`${s.label}: ${s.values.map((v) => format(v)).join(" · ")}`}
          >
            <polygon
              points={s.values.map((v, i) => point(i, v)).join(" ")}
              fill={colors[si] ?? CHART_TOKEN.chart1}
              fillOpacity={seriesOpacity(si)}
              stroke={colors[si] ?? CHART_TOKEN.chart1}
              strokeWidth={lineWidth}
              strokeLinejoin="round"
            />
            {showVertices
              ? s.values.map((v, i) => {
                  const tip = `${s.label} · ${axes[i] ?? ""}: ${format(v)}`;
                  const [cx, cy] = point(i, v).split(",").map(Number);
                  return (
                    <g key={stableKey([s.label, i], i)}>
                      <circle
                        cx={cx ?? center}
                        cy={cy ?? center}
                        r={vertexRadius}
                        fill={colors[si] ?? CHART_TOKEN.chart1}
                        stroke={CHART_TOKEN.background}
                        strokeWidth={POINT_BORDER}
                        data-chart-tip={tip}
                      />
                    </g>
                  );
                })
              : null}
          </g>
        ))}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={series.map((s, i) => ({
            label: s.label,
            color: colors[i] ?? CHART_TOKEN.chart1,
          }))}
        />
      ) : null}
    </div>
  );
}
