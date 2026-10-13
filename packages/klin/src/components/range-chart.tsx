/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max, min } from "d3-array";
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
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  CHART_TOKEN,
  GRID_TICKS,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Grupo de rango: intervalo low–high con valor opcional. */
export type RangeGroup = {
  label: string;
  low: number;
  high: number;
  value?: number;
  color?: string;
};

/** Orden de los grupos por valor (none conserva el orden de entrada). */
export type RangeSort = "none" | "asc" | "desc";

/** Props de RangeChart. */
export type RangeChartProps = {
  groups: RangeGroup[];
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /** Mínimo fijo del dominio Y (indefinido = automático con cero). */
  yMin?: number;
  /** Máximo fijo del dominio Y (indefinido = automático). */
  yMax?: number;
  /** Ticks del grid horizontal (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Muestra el valor junto a cada punto. */
  showValues?: boolean;
  /** Muestra el punto de valor (o medio) sobre el rango. */
  showPoints?: boolean;
  /** Orden de los grupos por su valor. */
  sortGroups?: RangeSort;
  /** Radio del punto de valor (por defecto POINT_RADIUS). */
  pointRadius?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

const GROUP_BAND_PADDING = 0.45;
const AXIS_LABEL_OFFSET = 10;
const CAP_MAX_WIDTH = 56;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;
/** Mínimo de ticks y separación de la etiqueta de valor. */
const TICKS_MIN = 1;
const VALUE_LABEL_GAP = 4;

type ComputedRange = {
  label: string;
  low: number;
  high: number;
  point: number;
  isMid: boolean;
  color?: string;
};

/**
 * Rangos verticales SSR (línea low–high con topes + punto de valor
 * o punto medio si falta). Filtra no-finitos; tope DEFAULT_MAX_ROWS.
 */
export function RangeChart({
  groups,
  ariaLabel,
  height = 260,
  formatY,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  yMin,
  yMax,
  gridTicks = GRID_TICKS,
  showValues = false,
  showPoints = true,
  sortGroups = "none",
  pointRadius = POINT_RADIUS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: RangeChartProps) {
  const computed: ComputedRange[] = [];
  for (const g of groups.slice(0, DEFAULT_MAX_ROWS)) {
    const low = toNumber(g.low, Number.NaN);
    const high = toNumber(g.high, Number.NaN);
    if (!Number.isFinite(low) || !Number.isFinite(high)) continue;
    const loose = toNumber(g.value, Number.NaN);
    const hasValue = Number.isFinite(loose);
    computed.push({
      label: g.label,
      low,
      high,
      point: hasValue ? loose : (low + high) / 2,
      isMid: !hasValue,
      color: g.color,
    });
  }
  if (computed.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const ordered =
    sortGroups === "none"
      ? computed
      : [...computed].sort((a, b) =>
          sortGroups === "asc" ? a.point - b.point : b.point - a.point,
        );

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const all = ordered.flatMap((c) => [c.low, c.high, c.point]);
  const fixedLo = toNumber(yMin, Number.NaN);
  const fixedHi = toNumber(yMax, Number.NaN);
  const blo = Number.isFinite(fixedLo) ? fixedLo : Math.min(0, min(all) ?? 0);
  const rawHi = Number.isFinite(fixedHi) ? fixedHi : (max(all) ?? 1);
  const bhi = rawHi <= blo ? blo + 1 : rawHi;
  const fmtY = formatY ?? ((v: number) => formatDefault(v, locale));
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(gridTicks, GRID_TICKS)),
  );
  const dotR = Math.max(0, toNumber(pointRadius, POINT_RADIUS));
  const y = scaleLinear().domain([blo, bhi]).nice(safeTicks).range([innerH, 0]);
  const x = scaleBand()
    .domain(ordered.map((c) => c.label))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const ticks = y.ticks(safeTicks);
  const capW = Math.min(CAP_MAX_WIDTH, x.bandwidth());

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
        {ordered.map((c, gi) => {
          const cx = MARGIN.left + (x(c.label) ?? 0) + x.bandwidth() / 2;
          const color = seriesColor(gi, c.color);
          const tip = c.isMid
            ? `${c.label}: min ${fmtY(c.low)} · max ${fmtY(c.high)} · ` +
              `medio ${fmtY(c.point)}`
            : `${c.label}: min ${fmtY(c.low)} · max ${fmtY(c.high)} · ` +
              `valor ${fmtY(c.point)}`;
          return (
            <g key={stableKey([c.label], gi)}>
              <title>{tip}</title>
              <text
                x={cx}
                y={height - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{c.label}</title>
                {truncateLabel(c.label)}
              </text>
              <line
                x1={cx}
                x2={cx}
                y1={MARGIN.top + y(c.high)}
                y2={MARGIN.top + y(c.low)}
                stroke={color}
                strokeWidth={LINE_WIDTH}
                data-chart-tip={tip}
              />
              <line
                x1={cx - capW / 2}
                x2={cx + capW / 2}
                y1={MARGIN.top + y(c.high)}
                y2={MARGIN.top + y(c.high)}
                stroke={color}
                strokeWidth={LINE_WIDTH}
              />
              <line
                x1={cx - capW / 2}
                x2={cx + capW / 2}
                y1={MARGIN.top + y(c.low)}
                y2={MARGIN.top + y(c.low)}
                stroke={color}
                strokeWidth={LINE_WIDTH}
              />
              {showPoints ? (
                <circle
                  cx={cx}
                  cy={MARGIN.top + y(c.point)}
                  r={dotR}
                  fill={color}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={POINT_BORDER}
                />
              ) : null}
              {showValues ? (
                <text
                  x={cx}
                  y={MARGIN.top + y(c.point) - dotR - VALUE_LABEL_GAP}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.foreground}
                >
                  {fmtY(c.point)}
                </text>
              ) : null}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Rango", color: CHART_TOKEN.chart1 },
            { label: "Valor", color: CHART_TOKEN.chart2 },
          ]}
        />
      ) : null}
    </div>
  );
}
