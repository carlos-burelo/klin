/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { max } from "d3-array";
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor } from "../lib/palette";
import {
  CHART_TOKEN,
  GRID_WIDTH,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS_RADAR,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Serie del radar (etiqueta, valores por eje y color opcional). */
export type RadarSeries = {
  label: string;
  values: number[];
  color?: string;
};

/** Relleno exterior del lienzo, separación de etiquetas y relleno de serie. */
const RADAR_OUTER_PAD = 44;
const AXIS_LABEL_OFFSET = 14;
const RADAR_FILL_OPACITY = 0.18;

/** Props del radar SSR para perfiles multivariados. */
export type RadarChartProps = {
  axes: string[];
  series: RadarSeries[];
  ariaLabel: string;
  size?: number;
  levels?: number;
  maxValue?: number;
  format?: ValueFormatter;
  locale?: string;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
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
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: RadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - RADAR_OUTER_PAD;

  if (axes.length < 3 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const top = Math.max(
    1,
    toNumber(maxValue ?? max(series.flatMap((s) => s.values)) ?? 1),
  );
  const angle = (i: number) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  const point = (i: number, v: number) => {
    const r = (Math.max(0, toNumber(v)) / top) * radius;
    return `${center + r * Math.cos(angle(i))},${center + r * Math.sin(angle(i))}`;
  };
  const colors = series.map((s, i) => seriesColor(i, s.color));

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
        <title>{ariaLabel}</title>
        {Array.from({ length: levels }, (_, li) => {
          const frac = (li + 1) / levels;
          return (
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
          <g key={stableKey([s.label], si)}>
            <title>{`${s.label}: ${s.values.map((v) => format(v)).join(" · ")}`}</title>
            <polygon
              points={s.values.map((v, i) => point(i, v)).join(" ")}
              fill={colors[si] ?? CHART_TOKEN.chart1}
              fillOpacity={RADAR_FILL_OPACITY}
              stroke={colors[si] ?? CHART_TOKEN.chart1}
              strokeWidth={LINE_WIDTH}
              strokeLinejoin="round"
            />
            {s.values.map((v, i) => {
              const tip = `${s.label} · ${axes[i] ?? ""}: ${format(v)}`;
              const [cx, cy] = point(i, v).split(",").map(Number);
              return (
                <g key={stableKey([s.label, i], i)}>
                  <title>{tip}</title>
                  <circle
                    cx={cx ?? center}
                    cy={cy ?? center}
                    r={POINT_RADIUS_RADAR}
                    fill={colors[si] ?? CHART_TOKEN.chart1}
                    stroke={CHART_TOKEN.background}
                    strokeWidth={POINT_BORDER}
                    data-chart-tip={tip}
                  />
                </g>
              );
            })}
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
