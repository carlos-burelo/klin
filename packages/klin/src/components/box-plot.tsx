/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max, min, quantileSorted } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  GRID_TICKS,
  LINE_WIDTH,
  POINT_BORDER,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

export type BoxGroup = {
  label: string;
  values: number[];
  color?: string;
};

const GROUP_BAND_PADDING = 0.45;
const AXIS_LABEL_OFFSET = 10;
const BOX_MAX_WIDTH = 56;
const BOX_LINE_WIDTH = 1.5;
const BOX_FILL_OPACITY = 0.35;
const OUTLIER_RADIUS = 3;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;
const IQR_FACTOR = 1.5;
const SAMPLE_LABEL_SHIFT = 12;
const NOTCH_HALF_HEIGHT = 6;
const NOTCH_DEPTH = 10;

/** Props de BoxPlot. */
export type BoxPlotProps = {
  groups: BoxGroup[];
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Muestra los puntos atípicos fuera de los bigotes. */
  showOutliers?: boolean;
  /** Bigotes por rango intercuartílico (1.5) o por mínimo/máximo reales. */
  whisker?: 1.5 | "minmax";
  /** Muestra el tamaño de muestra (`n`) bajo cada etiqueta. */
  showSampleSize?: boolean;
  /** Dibuja una muesca en la mediana. */
  notch?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
};

type Stats = {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
};

function statsOf(values: number[], whisker: 1.5 | "minmax"): Stats | null {
  const clean = values
    .map((v) => toNumber(v, Number.NaN))
    .filter((v) => Number.isFinite(v));
  const sorted = [...clean].sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const q1 = quantileSorted(sorted, 0.25) ?? sorted[0] ?? 0;
  const median = quantileSorted(sorted, 0.5) ?? sorted[0] ?? 0;
  const q3 = quantileSorted(sorted, 0.75) ?? sorted[0] ?? 0;
  if (whisker === "minmax") {
    return {
      min: sorted[0] ?? 0,
      q1,
      median,
      q3,
      max: sorted[sorted.length - 1] ?? 0,
      outliers: [],
    };
  }
  const iqr = q3 - q1;
  const lo = q1 - IQR_FACTOR * iqr;
  const hi = q3 + IQR_FACTOR * iqr;
  const inside = sorted.filter((v) => v >= lo && v <= hi);
  return {
    min: inside[0] ?? sorted[0] ?? 0,
    q1,
    median,
    q3,
    max: inside[inside.length - 1] ?? sorted[sorted.length - 1] ?? 0,
    outliers: sorted.filter((v) => v < lo || v > hi),
  };
}

/**
 * Cajas y bigotes SSR (distribución por grupo: min, Q1, mediana, Q3, max).
 * Soporta negativos; filtra no-finitos.
 */
export function BoxPlot({
  groups,
  ariaLabel,
  height = 260,
  formatY,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  showOutliers = true,
  whisker = 1.5,
  showSampleSize = false,
  notch = false,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: BoxPlotProps) {
  const computed = groups
    .map((g) => ({ group: g, stats: statsOf(g.values, whisker) }))
    .filter((c) => c.stats !== null);
  if (computed.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const all = computed.flatMap((c) => [
    c.stats?.min ?? 0,
    c.stats?.max ?? 0,
    ...(showOutliers ? (c.stats?.outliers ?? []) : []),
  ]);
  const blo = Math.min(0, min(all) ?? 0);
  const bhi = max(all) ?? 1;
  const fmtY = formatY ?? ((v: number) => formatDefault(v, locale));
  const y = scaleLinear()
    .domain([blo, bhi])
    .nice(GRID_TICKS)
    .range([innerH, 0]);
  const x = scaleBand()
    .domain(computed.map((c) => c.group.label))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const ticks = y.ticks(GRID_TICKS);
  const boxW = Math.min(BOX_MAX_WIDTH, x.bandwidth());

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
          if (a.value < blo || a.value > bhi) return null;
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
        {computed.map(({ group, stats }, gi) => {
          const s = stats;
          if (!s) return null;
          const cx = MARGIN.left + (x(group.label) ?? 0) + x.bandwidth() / 2;
          const color = seriesColor(gi, group.color);
          const n = group.values.filter((v) =>
            Number.isFinite(toNumber(v, Number.NaN)),
          ).length;
          const shownOutliers = showOutliers ? s.outliers : [];
          const tip =
            `${group.label}: min ${fmtY(s.min)} · Q1 ${fmtY(s.q1)} · ` +
            `mediana ${fmtY(s.median)} · Q3 ${fmtY(s.q3)} · max ${fmtY(s.max)}` +
            (shownOutliers.length > 0
              ? ` · atípicos ${shownOutliers.map(fmtY).join(", ")}`
              : "") +
            (showSampleSize ? ` · n ${n}` : "");
          const yq3 = MARGIN.top + y(s.q3);
          const yq1 = MARGIN.top + y(s.q1);
          const ymed = MARGIN.top + y(s.median);
          const notchPath =
            `M ${cx - boxW / 2} ${yq3} H ${cx + boxW / 2} ` +
            `V ${ymed + NOTCH_HALF_HEIGHT} L ${cx + boxW / 2 - NOTCH_DEPTH} ${ymed} ` +
            `L ${cx + boxW / 2} ${ymed - NOTCH_HALF_HEIGHT} V ${yq1} ` +
            `H ${cx - boxW / 2} V ${ymed - NOTCH_HALF_HEIGHT} ` +
            `L ${cx - boxW / 2 + NOTCH_DEPTH} ${ymed} ` +
            `L ${cx - boxW / 2} ${ymed + NOTCH_HALF_HEIGHT} Z`;
          return (
            <g key={stableKey([group.label], gi)}>
              <title>{tip}</title>
              <text
                x={cx}
                y={height - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{group.label}</title>
                {truncateLabel(group.label)}
              </text>
              {showSampleSize ? (
                <text
                  x={cx}
                  y={height - AXIS_LABEL_OFFSET + SAMPLE_LABEL_SHIFT}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  n {n}
                </text>
              ) : null}
              <line
                x1={cx}
                x2={cx}
                y1={MARGIN.top + y(s.max)}
                y2={MARGIN.top + y(s.min)}
                stroke={color}
                strokeWidth={BOX_LINE_WIDTH}
              />
              <line
                x1={cx - boxW / 2}
                x2={cx + boxW / 2}
                y1={MARGIN.top + y(s.max)}
                y2={MARGIN.top + y(s.max)}
                stroke={color}
                strokeWidth={BOX_LINE_WIDTH}
              />
              <line
                x1={cx - boxW / 2}
                x2={cx + boxW / 2}
                y1={MARGIN.top + y(s.min)}
                y2={MARGIN.top + y(s.min)}
                stroke={color}
                strokeWidth={BOX_LINE_WIDTH}
              />
              {notch ? (
                <path
                  d={notchPath}
                  fill={color}
                  fillOpacity={BOX_FILL_OPACITY}
                  stroke={color}
                  strokeWidth={BOX_LINE_WIDTH}
                  data-chart-tip={tip}
                />
              ) : (
                <rect
                  x={cx - boxW / 2}
                  y={MARGIN.top + y(s.q3)}
                  width={boxW}
                  height={Math.max(ZERO_MARK_PX, y(s.q1) - y(s.q3))}
                  rx={BAR_RADIUS}
                  fill={color}
                  fillOpacity={BOX_FILL_OPACITY}
                  stroke={color}
                  strokeWidth={BOX_LINE_WIDTH}
                  data-chart-tip={tip}
                />
              )}
              <line
                x1={cx - boxW / 2}
                x2={cx + boxW / 2}
                y1={MARGIN.top + y(s.median)}
                y2={MARGIN.top + y(s.median)}
                stroke={color}
                strokeWidth={LINE_WIDTH}
              />
              {showOutliers
                ? s.outliers.map((o, oi) => (
                    <circle
                      // biome-ignore lint/suspicious/noArrayIndexKey: atípicos pueden duplicar valor
                      key={`${o}__${oi}`}
                      cx={cx}
                      cy={MARGIN.top + y(o)}
                      r={OUTLIER_RADIUS}
                      fill={CHART_TOKEN.background}
                      stroke={color}
                      strokeWidth={POINT_BORDER}
                    />
                  ))
                : null}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Q1 – Q3", color: CHART_TOKEN.chart1 },
            { label: "Mediana", color: CHART_TOKEN.chart2 },
          ]}
        />
      ) : null}
    </div>
  );
}
