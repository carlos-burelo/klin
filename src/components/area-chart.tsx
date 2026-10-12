/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleLinear, scalePoint } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
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
  AREA_FILL_OPACITY,
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

export type AreaSeries = ChartSeries;

const POINT_PADDING = 0.5;
const AXIS_LABEL_OFFSET = 10;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;

/** Props de AreaChart. */
export type AreaChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: AreaSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  stacked?: boolean;
  /** Apila a 100 % (implica `stacked`). */
  normalize?: boolean;
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
 * Áreas SSR (superpuestas o apiladas). Eje X por categorías.
 * Soporta negativos en modo superpuesto; en apilado/normalizado los
 * negativos se clamp a 0 (no se apilan negativos).
 */
export function AreaChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  stacked = false,
  normalize = false,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: AreaChartProps) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const labels = data.map((d) => String(d[xKey] ?? ""));
  // En apilado/normalize los negativos se clamp a 0: no se apilan negativos.
  const stackedTotals = data.map((d) =>
    series.reduce((acc, s) => acc + Math.max(0, toNumber(d[s.key])), 0),
  );
  const flat = data.flatMap((d) => series.map((s) => toNumber(d[s.key])));
  const [lo, hi] = domainWithZero(stacked || normalize ? stackedTotals : flat);

  const x = scalePoint()
    .domain(labels)
    .range([0, innerW])
    .padding(POINT_PADDING);
  const y = (
    normalize
      ? scaleLinear().domain([0, 1])
      : scaleLinear()
          .domain([lo, Math.max(hi, lo + 1)])
          .nice(GRID_TICKS)
  ).range([innerH, 0]);
  const ticks = y.ticks(GRID_TICKS);
  const colors = seriesColors(series);
  const fmtY = formatY ?? ((v: number) => formatDefault(v, locale));
  const fmt = normalize
    ? (v: number) => `${Math.round(v * PERCENT_FACTOR)}%`
    : fmtY;

  // Base acumulada por etiqueta cuando es apilada.
  const bases = new Map<string, number>(labels.map((l) => [l, 0]));

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmt} />
        {(annotations ?? []).map((a, ai) => {
          const annLo = normalize ? 0 : lo;
          const annHi = normalize ? 1 : hi;
          if (a.value < annLo || a.value > annHi) return null;
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
        {series.map((s, si) => {
          const color = colors[si] ?? CHART_TOKEN.chart1;
          const pts = data.map((d, di) => {
            const label = String(d[xKey] ?? "");
            const raw = toNumber(d[s.key]);
            // En apilado/normalize los negativos se clamp a 0.
            const clamped = Math.max(0, raw);
            const total = stackedTotals[di] ?? 0;
            const value =
              normalize && total > 0
                ? clamped / total
                : stacked || normalize
                  ? clamped
                  : raw;
            const base = stacked || normalize ? (bases.get(label) ?? 0) : 0;
            if (stacked || normalize)
              bases.set(label, base + (normalize ? value : clamped));
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
              <title>{`${s.label}: total ${fmtY(pts.reduce((a, p) => a + p.raw, 0))}`}</title>
              <path d={areaPath} fill={color} opacity={AREA_FILL_OPACITY} />
              <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth={LINE_WIDTH}
                strokeLinecap="round"
              />
              {pts.map((p, pi) => {
                const baseTip = `${p.label} · ${s.label}: ${fmtY(p.raw)}`;
                const total = stackedTotals[pi] ?? 0;
                const tip = normalize
                  ? `${p.label} · ${s.label}: ${fmtY(p.raw)} (${Math.round(p.value * PERCENT_FACTOR)}%)`
                  : stacked && series.length >= 2 && total > 0
                    ? `${baseTip} (${Math.round((Math.max(0, p.raw) / total) * PERCENT_FACTOR)}% del grupo)`
                    : baseTip;
                return (
                  <g key={stableKey([s.key, p.label], pi)}>
                    <title>{tip}</title>
                    <circle
                      cx={x(p.label) ?? 0}
                      cy={y(p.base + p.value)}
                      r={POINT_RADIUS}
                      fill={color}
                      stroke={CHART_TOKEN.background}
                      strokeWidth={POINT_BORDER}
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
