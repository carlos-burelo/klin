/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { scaleBand, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { domainWithZero } from "../lib/domain";
import type { ChartMargin } from "../lib/frame";
import { ChartSvg } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColors, truncateLabel } from "../lib/palette";
import type { ChartSeries } from "../lib/series";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  GRID_TICKS,
  GRID_WIDTH,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
  ZERO_MARK_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Props de barras horizontales agrupadas SSR. */
export type HorizontalBarChartProps = {
  data: Array<Record<string, string | number>>;
  yKey: string;
  series: ChartSeries[];
  ariaLabel: string;
  formatX?: ValueFormatter;
  locale?: string;
  annotations?: ValueAnnotation[];
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const W = 640;
const MARGIN: ChartMargin = { top: 8, right: 48, bottom: 28, left: 132 };

const GROUP_BAND_PADDING = 0.25;
const SERIES_BAND_PADDING = 0.15;
const LABEL_MAX_X = 18;
const AXIS_LABEL_OFFSET = 10;
const VALUE_LABEL_DX = 5;
const ROW_BASE_H = 30;
const ROW_PER_SERIES_H = 4;
const MIN_HEIGHT = 140;

/**
 * Barras horizontales agrupadas SSR. Altura automática según filas.
 * Soporta negativos (origen en cero) y filtra no-finitos como 0.
 */
export function HorizontalBarChart({
  data,
  yKey,
  series,
  ariaLabel,
  locale = "es-MX",
  formatX = (v: number) => formatDefault(v, locale),
  annotations,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: HorizontalBarChartProps) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const rowH = ROW_BASE_H + series.length * ROW_PER_SERIES_H;
  const height = Math.max(
    MIN_HEIGHT,
    MARGIN.top + MARGIN.bottom + data.length * rowH,
  );
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const flat = data.flatMap((d) => series.map((s) => toNumber(d[s.key])));
  const [lo, hi] = domainWithZero(flat);
  const x = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(GRID_TICKS)
    .range([0, innerW]);
  const x0 = x(0);
  const y0 = scaleBand()
    .domain(data.map((d) => String(d[yKey] ?? "")))
    .range([0, innerH])
    .padding(GROUP_BAND_PADDING);
  const y1 = scaleBand()
    .domain(series.map((s) => s.key))
    .range([0, y0.bandwidth()])
    .padding(SERIES_BAND_PADDING);

  const ticks = x.ticks(GRID_TICKS);
  const colors = seriesColors(series);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={MARGIN.left + x(t)}
              x2={MARGIN.left + x(t)}
              y1={MARGIN.top}
              y2={height - MARGIN.bottom}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={MARGIN.left + x(t)}
              y={height - AXIS_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {formatX(t)}
            </text>
          </g>
        ))}
        {(annotations ?? []).map((a, ai) => {
          const clamped = Math.min(hi, Math.max(lo, toNumber(a.value)));
          const ax = MARGIN.left + x(clamped);
          const stroke = a.color ?? CHART_TOKEN.accent;
          return (
            <g key={stableKey([a.label ?? `${a.value}`], ai)}>
              <title>{a.label ?? formatX(a.value)}</title>
              <line
                x1={ax}
                x2={ax}
                y1={MARGIN.top}
                y2={height - MARGIN.bottom}
                stroke={stroke}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              {a.label ? (
                <text
                  x={ax + TICK_GAP_PX}
                  y={MARGIN.top + TICK_GAP_PX}
                  fontSize={TICK_FONT_SIZE}
                  fill={stroke}
                >
                  {a.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {data.map((d, di) => {
          const group = String(d[yKey] ?? "");
          const total = series.reduce((acc, s) => acc + toNumber(d[s.key]), 0);
          return (
            <g key={stableKey([group], di)}>
              <text
                x={MARGIN.left - TICK_GAP_PX}
                y={MARGIN.top + (y0(group) ?? 0) + y0.bandwidth() / 2}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{group}</title>
                {truncateLabel(group, LABEL_MAX_X)}
              </text>
              {series.map((s, si) => {
                const value = toNumber(d[s.key]);
                const xv = x(value);
                const bw = Math.abs(xv - x0);
                const bx = MARGIN.left + Math.min(x0, xv);
                const w =
                  value === 0 ? ZERO_MARK_PX : Math.max(MIN_SHAPE_PX, bw);
                const by = MARGIN.top + (y0(group) ?? 0) + (y1(s.key) ?? 0);
                const baseTip = `${group} · ${s.label}: ${formatX(value)}`;
                const tip =
                  series.length >= 2 && total > 0
                    ? `${baseTip} (${Math.round((value / total) * PERCENT_FACTOR)}% del grupo)`
                    : baseTip;
                return (
                  <g key={s.key}>
                    <title>{tip}</title>
                    <rect
                      x={bx}
                      y={by}
                      width={w}
                      height={Math.max(ZERO_MARK_PX, y1.bandwidth())}
                      rx={BAR_RADIUS}
                      fill={colors[si] ?? CHART_TOKEN.chart1}
                      data-chart-tip={tip}
                    />
                    <text
                      x={bx + w + VALUE_LABEL_DX}
                      y={by + y1.bandwidth() / 2}
                      dy={TICK_DY}
                      fontSize={TICK_FONT_SIZE}
                      fill={CHART_TOKEN.muted}
                    >
                      {formatX(value)}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </ChartSvg>
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
