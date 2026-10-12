/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { domainWithZero } from "../lib/domain";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
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
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

const GROUP_BAND_PADDING = 0.22;
const SERIES_BAND_PADDING = 0.08;
const AXIS_LABEL_OFFSET = 10;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;

/** Props de BarChart. */
export type BarChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
  /**
   * Override de color por barra (p. ej. una serie con un color por categoría).
   * Devuelve un color (token/var) o undefined para usar el de la serie.
   */
  barColor?: (
    datum: Record<string, string | number>,
    datumIndex: number,
    serie: ChartSeries,
    serieIndex: number,
  ) => string | undefined;
};

/**
 * Barras verticales SSR (una serie o agrupadas). Función pura props → SVG,
 * responsiva por `viewBox`. Ejes y grid calculados con d3-scale/d3-array.
 * Soporta negativos (línea de cero) y filtra no-finitos como 0.
 */
export function BarChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  barColor,
}: BarChartProps) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtY = formatY ?? ((v: number) => formatDefault(v, locale));

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const flat = data.flatMap((d) => series.map((s) => toNumber(d[s.key])));
  const [lo, hi] = domainWithZero(flat);
  const y = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(GRID_TICKS)
    .range([innerH, 0]);
  const y0 = y(0);
  const x0 = scaleBand()
    .domain(data.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const x1 = scaleBand()
    .domain(series.map((s) => s.key))
    .range([0, x0.bandwidth()])
    .padding(SERIES_BAND_PADDING);

  const ticks = y.ticks(GRID_TICKS);
  const colors = seriesColors(series);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmtY} />
        {(annotations ?? []).map((a, ai) => {
          if (a.value < lo || a.value > hi) return null;
          const ay = MARGIN.top + y(a.value);
          return (
            <g key={`ann-${a.value}-${ai}`}>
              <title>{a.label ?? String(a.value)}</title>
              <line
                x1={MARGIN.left}
                x2={W - MARGIN.right}
                y1={ay}
                y2={ay}
                stroke={a.color ?? CHART_TOKEN.accent}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              <text
                x={W - MARGIN.right - ANNOTATION_LABEL_DX}
                y={ay}
                dy={ANNOTATION_LABEL_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={a.color ?? CHART_TOKEN.muted}
              >
                {a.label ?? String(a.value)}
              </text>
            </g>
          );
        })}
        {data.map((d, di) => {
          const group = String(d[xKey] ?? "");
          const total = series.reduce((acc, s) => acc + toNumber(d[s.key]), 0);
          return (
            <g key={stableKey([group], di)}>
              <text
                x={MARGIN.left + (x0(group) ?? 0) + x0.bandwidth() / 2}
                y={height - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{group}</title>
                {truncateLabel(group)}
              </text>
              {series.map((s, si) => {
                const value = toNumber(d[s.key]);
                const bw = x1.bandwidth();
                const bx = MARGIN.left + (x0(group) ?? 0) + (x1(s.key) ?? 0);
                const yV = y(value);
                const rectY =
                  value === 0
                    ? MARGIN.top + y0 - ZERO_MARK_PX / 2
                    : MARGIN.top + Math.min(y0, yV);
                const rectH =
                  value === 0
                    ? ZERO_MARK_PX
                    : Math.max(MIN_SHAPE_PX, Math.abs(y0 - yV));
                const baseTip = `${group} · ${s.label}: ${fmtY(value)}`;
                const tip =
                  series.length >= 2 && total > 0
                    ? `${baseTip} (${Math.round((value / total) * PERCENT_FACTOR)}% del grupo)`
                    : baseTip;
                const fill = barColor?.(d, di, s, si) ?? colors[si];
                return (
                  <g key={s.key}>
                    <title>{tip}</title>
                    <rect
                      x={bx}
                      y={rectY}
                      width={Math.max(MIN_SHAPE_PX, bw)}
                      height={rectH}
                      rx={BAR_RADIUS}
                      fill={fill}
                      data-chart-tip={tip}
                    />
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
