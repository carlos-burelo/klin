/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleLinear, scalePoint } from "d3-scale";
import { curveLinear, curveMonotoneX, curveStep, line } from "d3-shape";
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
import { formatDefault, seriesColors } from "../lib/palette";
import type { ChartSeries } from "../lib/series";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  CHART_TOKEN,
  GRID_TICKS,
  LINE_WIDTH,
  PERCENT_FACTOR,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

const POINT_PADDING = 0.5;
const AXIS_LABEL_OFFSET = 10;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;

/** Props de LineChart. */
export type LineChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  /** monotone (suave), linear (recta) o step (escalón). */
  curve?: "monotone" | "linear" | "step";
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Líneas SSR con puntos. Eje X por categorías (orden de `data`).
 * Soporta negativos y filtra no-finitos como 0.
 */
export function LineChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  curve = "monotone",
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: LineChartProps) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtY = formatY ?? ((v: number) => formatDefault(v, locale));

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const labels = data.map((d) => String(d[xKey] ?? ""));

  const flat = data.flatMap((d) => series.map((s) => toNumber(d[s.key])));
  const [lo, hi] = domainWithZero(flat);

  const x = scalePoint()
    .domain(labels)
    .range([0, innerW])
    .padding(POINT_PADDING);
  const y = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(GRID_TICKS)
    .range([innerH, 0]);
  const ticks = y.ticks(GRID_TICKS);
  const colors = seriesColors(series);
  const totals = data.map((d) =>
    series.reduce((acc, s) => acc + toNumber(d[s.key]), 0),
  );

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
        value: toNumber(d[key]),
      })),
    );

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
        {labels.map((label, li) => (
          <text
            key={stableKey([label], li)}
            x={MARGIN.left + (x(label) ?? 0)}
            y={height - AXIS_LABEL_OFFSET}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
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
              stroke={colors[si] ?? CHART_TOKEN.chart1}
              strokeWidth={LINE_WIDTH}
              strokeLinecap="round"
            />
            {data.map((d, di2) => {
              const label = String(d[xKey] ?? "");
              const value = toNumber(d[s.key]);
              const total = totals[di2] ?? 0;
              const baseTip = `${label} · ${s.label}: ${fmtY(value)}`;
              const tip =
                series.length >= 2 && total > 0
                  ? `${baseTip} (${Math.round((value / total) * PERCENT_FACTOR)}% del grupo)`
                  : baseTip;
              return (
                <g key={stableKey([s.key, label], di2)}>
                  <title>{tip}</title>
                  <circle
                    cx={MARGIN.left + (x(label) ?? 0)}
                    cy={MARGIN.top + y(value)}
                    r={POINT_RADIUS}
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
