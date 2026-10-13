/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max, min } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { ChartSvg, YGrid } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  GRID_TICKS,
  GRID_WIDTH,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type WaterfallStep = {
  label: string;
  /** Delta (positivo suma, negativo resta). */
  value: number;
};

/** Props de WaterfallChart. */
export type WaterfallChartProps = {
  steps: WaterfallStep[];
  ariaLabel: string;
  height?: number;
  totalLabel?: string;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  annotations?: ValueAnnotation[];
  /** Muestra los conectores punteados entre barras. */
  showConnectors?: boolean;
  /** Color de deltas positivos (token). */
  positiveColor?: string;
  /** Color de deltas negativos (token). */
  negativeColor?: string;
  /** Color de la barra total (token). */
  totalColor?: string;
  /** Etiqueta acumulada sobre cada barra (si no, el delta). */
  runningTotal?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

const W = 640;
const MARGIN = { top: 28, right: 12, bottom: 32, left: 48 };

const UP = CHART_TOKEN.chart1;
const DOWN = CHART_TOKEN.chart5;
const TOTAL = CHART_TOKEN.primary;

const GROUP_BAND_PADDING = 0.3;
const AXIS_LABEL_OFFSET = 10;
const VALUE_LABEL_DY = 6;
const CONNECTOR_DASH = "3 3";
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;

/**
 * Cascada SSR (acumulado por deltas + total). Subidas, bajadas y conectores.
 * Soporta negativos; no-finitos cuentan como 0.
 */
export function WaterfallChart({
  steps,
  ariaLabel,
  height = 280,
  totalLabel = "Total",
  formatY,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  annotations,
  showConnectors = true,
  positiveColor,
  negativeColor,
  totalColor,
  runningTotal = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: WaterfallChartProps) {
  if (isBlank(steps)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  let acc = 0;
  const floats = steps.map((s) => {
    const value = toNumber(s.value);
    const from = acc;
    acc += value;
    return { label: s.label, value, from, to: acc };
  });
  const total = acc;
  const lo = Math.min(0, min(floats, (f) => Math.min(f.from, f.to)) ?? 0);
  const hi = Math.max(0, max(floats, (f) => Math.max(f.from, f.to)) ?? 1);

  const labels = [...floats.map((f) => f.label), totalLabel];
  const y = scaleLinear().domain([lo, hi]).nice(GRID_TICKS).range([innerH, 0]);
  const x = scaleBand()
    .domain(labels)
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const ticks = y.ticks(GRID_TICKS);
  const bw = x.bandwidth();
  const fmtY = resolveFormatter(formatY, locale);
  const upColor = positiveColor ?? UP;
  const downColor = negativeColor ?? DOWN;
  const grandColor = totalColor ?? TOTAL;

  const bar = (
    key: string,
    label: string,
    from: number,
    to: number,
    color: string,
    tip: string,
    dashed: boolean,
    nextLabel?: string,
  ) => {
    const yTop = y(Math.max(from, to));
    const yBase = y(Math.min(from, to));
    return (
      <g key={key}>
        <title>{tip}</title>
        <rect
          x={MARGIN.left + (x(label) ?? 0)}
          y={MARGIN.top + yTop}
          width={bw}
          height={Math.max(ZERO_MARK_PX, yBase - yTop)}
          rx={BAR_RADIUS}
          fill={color}
          data-chart-tip={tip}
        />
        <text
          x={MARGIN.left + (x(label) ?? 0) + bw / 2}
          y={MARGIN.top + yTop - VALUE_LABEL_DY}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fontWeight={FONT_SEMIBOLD}
          fill={CHART_TOKEN.foreground}
        >
          {runningTotal ? fmtY(to) : fmtY(to - from)}
        </text>
        {showConnectors && dashed && nextLabel ? (
          <line
            x1={MARGIN.left + (x(label) ?? 0) + bw}
            x2={MARGIN.left + (x(nextLabel) ?? 0)}
            y1={MARGIN.top + y(to)}
            y2={MARGIN.top + y(to)}
            stroke={CHART_TOKEN.muted}
            strokeWidth={GRID_WIDTH}
            strokeDasharray={CONNECTOR_DASH}
          />
        ) : null}
      </g>
    );
  };

  return (
    <ChartSvg
      width={W}
      height={height}
      ariaLabel={ariaLabel}
      className={className ? `h-auto w-full ${className}` : undefined}
      style={style}
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
      {floats.map((f, i) => {
        const nextLabel = floats[i + 1]?.label ?? totalLabel;
        return (
          <g key={stableKey([f.label], i)}>
            {bar(
              stableKey([f.label], i),
              f.label,
              f.from,
              f.to,
              f.value >= 0 ? upColor : downColor,
              `${f.label}: ${f.value >= 0 ? "+" : ""}${fmtY(f.value)} (acumulado ${fmtY(f.to)})`,
              true,
              nextLabel,
            )}
            <text
              x={MARGIN.left + (x(f.label) ?? 0) + bw / 2}
              y={height - AXIS_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              <title>{f.label}</title>
              {truncateLabel(f.label)}
            </text>
          </g>
        );
      })}
      {bar(
        stableKey([totalLabel], floats.length),
        totalLabel,
        0,
        total,
        grandColor,
        `${totalLabel}: ${fmtY(total)}`,
        false,
      )}
      <text
        x={MARGIN.left + (x(totalLabel) ?? 0) + bw / 2}
        y={height - AXIS_LABEL_OFFSET}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fill={CHART_TOKEN.muted}
      >
        {totalLabel}
      </text>
    </ChartSvg>
  );
}
