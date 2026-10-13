/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { scaleBand, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { domainWithZero } from "../lib/domain";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import type { ChartMargin } from "../lib/frame";
import { ChartSvg } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColors, truncateLabel } from "../lib/palette";
import type { ChartSeries } from "../lib/series";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  MIN_SHAPE_PX,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
  ZERO_MARK_PX,
} from "../lib/theme";
import { shareTip } from "../lib/tips";
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
  /** Alto fijo del lienzo (por defecto, automático según filas). */
  height?: number;
  /** Radio de esquina de barra (`0` para estilo denso). */
  barRadius?: number;
  /** Etiqueta de valor al final de cada barra. */
  showValues?: boolean;
  /** Orden de grupos por total (suma de series). */
  sortGroups?: "none" | "asc" | "desc";
  /** Ticks del grid vertical. */
  gridTicks?: number;
  /** Ancho reservado a etiquetas de fila (hoy margen izquierdo fijo). */
  labelWidth?: number;
};

const W = 640;
/** Ancho por defecto reservado a etiquetas de fila. */
const DEFAULT_LABEL_WIDTH = 132;
const MARGIN: ChartMargin = {
  top: 8,
  right: 48,
  bottom: 28,
  left: DEFAULT_LABEL_WIDTH,
};

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
  locale = DEFAULT_LOCALE,
  formatX,
  annotations,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  height: heightProp,
  barRadius = BAR_RADIUS,
  showValues = true,
  sortGroups = "none",
  gridTicks = GRID_TICKS,
  labelWidth = DEFAULT_LABEL_WIDTH,
}: HorizontalBarChartProps) {
  if (isBlank(data) || isBlank(series)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const radius = toNumber(barRadius, BAR_RADIUS);
  const ticksCount = Math.max(1, Math.round(toNumber(gridTicks, GRID_TICKS)));
  const margin: ChartMargin = {
    ...MARGIN,
    left: toNumber(labelWidth, DEFAULT_LABEL_WIDTH),
  };

  const totalOf = (d: Record<string, string | number>) =>
    series.reduce((acc, s) => acc + toNumber(d[s.key]), 0);
  const ordered = [...data];
  if (sortGroups !== "none") {
    ordered.sort((a, b) =>
      sortGroups === "asc" ? totalOf(a) - totalOf(b) : totalOf(b) - totalOf(a),
    );
  }

  const rowH = ROW_BASE_H + series.length * ROW_PER_SERIES_H;
  const autoHeight = Math.max(
    MIN_HEIGHT,
    margin.top + margin.bottom + ordered.length * rowH,
  );
  const height =
    heightProp == null
      ? autoHeight
      : Math.max(MIN_HEIGHT, Math.round(toNumber(heightProp, autoHeight)));
  const innerW = W - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const flat = ordered.flatMap((d) => series.map((s) => toNumber(d[s.key])));
  const [lo, hi] = domainWithZero(flat);
  const x = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(ticksCount)
    .range([0, innerW]);
  const x0 = x(0);
  const y0 = scaleBand()
    .domain(ordered.map((d) => String(d[yKey] ?? "")))
    .range([0, innerH])
    .padding(GROUP_BAND_PADDING);
  const y1 = scaleBand()
    .domain(series.map((s) => s.key))
    .range([0, y0.bandwidth()])
    .padding(SERIES_BAND_PADDING);

  const ticks = x.ticks(ticksCount);
  const colors = seriesColors(series);
  const fmtX = resolveFormatter(formatX, locale);

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
              x1={margin.left + x(t)}
              x2={margin.left + x(t)}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={margin.left + x(t)}
              y={height - AXIS_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtX(t)}
            </text>
          </g>
        ))}
        {(annotations ?? []).map((a, ai) => {
          const clamped = Math.min(hi, Math.max(lo, toNumber(a.value)));
          const ax = margin.left + x(clamped);
          const stroke = a.color ?? CHART_TOKEN.accent;
          return (
            <g key={stableKey([a.label ?? `${a.value}`], ai)}>
              <title>{a.label ?? fmtX(a.value)}</title>
              <line
                x1={ax}
                x2={ax}
                y1={margin.top}
                y2={height - margin.bottom}
                stroke={stroke}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              {a.label ? (
                <text
                  x={ax + TICK_GAP_PX}
                  y={margin.top + TICK_GAP_PX}
                  fontSize={TICK_FONT_SIZE}
                  fill={stroke}
                >
                  {a.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {ordered.map((d, di) => {
          const group = String(d[yKey] ?? "");
          const total = totalOf(d);
          return (
            <g key={stableKey([group], di)}>
              <text
                x={margin.left - TICK_GAP_PX}
                y={margin.top + (y0(group) ?? 0) + y0.bandwidth() / 2}
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
                const bx = margin.left + Math.min(x0, xv);
                const w =
                  value === 0 ? ZERO_MARK_PX : Math.max(MIN_SHAPE_PX, bw);
                const by = margin.top + (y0(group) ?? 0) + (y1(s.key) ?? 0);
                const tip = shareTip({
                  label: group,
                  series: s.label,
                  formatted: fmtX(value),
                  value,
                  total,
                  multi: series.length >= 2,
                  of: "grupo",
                });
                return (
                  <g key={s.key}>
                    <title>{tip}</title>
                    <rect
                      x={bx}
                      y={by}
                      width={w}
                      height={Math.max(ZERO_MARK_PX, y1.bandwidth())}
                      rx={radius}
                      fill={colors[si] ?? CHART_TOKEN.chart1}
                      data-chart-tip={tip}
                    />
                    {showValues ? (
                      <text
                        x={bx + w + VALUE_LABEL_DX}
                        y={by + y1.bandwidth() / 2}
                        dy={TICK_DY}
                        fontSize={TICK_FONT_SIZE}
                        fill={CHART_TOKEN.muted}
                      >
                        {fmtX(value)}
                      </text>
                    ) : null}
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
