/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScaleBand, ScaleLinear } from "d3-scale";
import { scaleBand, scaleLinear } from "d3-scale";
import { seriesColors } from "../core/color";
import { domainWithZero } from "../core/domain";
import type { ValueFormatter } from "../core/format";
import { resolveFormatter } from "../core/format";
import { toNumber } from "../core/number";
import type { ChartSeries } from "../core/series";
import { buildStackedMatrix, sortByGroupTotal } from "../core/stacked-model";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  GRID_TICKS,
  PERCENT_FACTOR,
} from "../core/theme";

export const GROUP_BAND_PADDING = 0.3;
export const AXIS_LABEL_OFFSET = 10;
export const ANNOTATION_LABEL_DX = 4;
export const ANNOTATION_LABEL_DY = -4;
/** Alto mínimo de segmento (px) para rotular su valor dentro. */
export const MIN_SEGMENT_LABEL_PX = 16;

type GroupRow = Record<string, string | number>;

/** Entrada pura del modelo apilado vertical. */
export type ComputeVerticalStackedInput = {
  data: GroupRow[];
  xKey: string;
  series: ChartSeries[];
  innerW: number;
  innerH: number;
  normalize: boolean;
  formatY?: ValueFormatter;
  locale: string;
  gridTicks: number;
  sortGroups: "none" | "asc" | "desc";
  barRadius?: number;
  showLegend: boolean;
};

/** Salida pura del modelo apilado vertical (escalas, dominio, colores). */
export type VerticalStackedModel = {
  radius: number;
  ticksCount: number;
  ordered: GroupRow[];
  raws: number[][];
  posSums: number[];
  negSums: number[];
  lo: number;
  hi: number;
  y: ScaleLinear<number, number>;
  x: ScaleBand<string>;
  ticks: number[];
  colors: string[];
  fmtY: ValueFormatter;
  fmt: (v: number) => string;
  legendItems: Array<{ label: string; color: string }> | undefined;
};

/** Ordena grupos por total vía sortByGroupTotal (adopción stacked-model). */
export function orderVerticalGroups(
  data: GroupRow[],
  series: ChartSeries[],
  sortGroups: "none" | "asc" | "desc",
): GroupRow[] {
  return sortByGroupTotal(data, series, sortGroups);
}

/** Radio sanitizado (verbatim de la vista). */
export function resolveVerticalRadius(barRadius: unknown): number {
  return toNumber(barRadius, BAR_RADIUS);
}

/** Ticks sanitizados (verbatim de la vista). */
export function resolveVerticalTicks(gridTicks: unknown): number {
  return Math.max(1, Math.round(toNumber(gridTicks, GRID_TICKS)));
}

/**
 * Modelo puro apilado vertical: orden + matriz stacked-model +
 * dominio con cero + escalas + colores (verbatim de la vista).
 */
export function computeVerticalStackedModel(
  input: ComputeVerticalStackedInput,
): VerticalStackedModel {
  const {
    data,
    xKey,
    series,
    innerW,
    innerH,
    normalize,
    formatY,
    locale,
    gridTicks,
    sortGroups,
    barRadius,
    showLegend,
  } = input;
  const radius = resolveVerticalRadius(barRadius);
  const ticksCount = resolveVerticalTicks(gridTicks);
  const ordered = orderVerticalGroups(data, series, sortGroups);
  const { raws, posSums, negSums } = buildStackedMatrix(ordered, series);
  // En normalize los negativos se clamp a 0.
  const [lo, hi] = domainWithZero([...posSums, ...negSums]);

  const y = (
    normalize
      ? scaleLinear().domain([0, 1])
      : scaleLinear().domain([lo, Math.max(hi, lo + 1)])
  )
    .nice(ticksCount)
    .range([innerH, 0]);
  const x = scaleBand()
    .domain(ordered.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);

  const ticks = y.ticks(ticksCount);
  const colors = seriesColors(series);
  const fmtY = resolveFormatter(formatY, locale);
  const fmt = normalize
    ? (v: number) => `${Math.round(v * PERCENT_FACTOR)}%`
    : fmtY;
  const legendItems = showLegend
    ? series.map((s, i) => ({
        label: s.label,
        color: colors[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;

  return {
    radius,
    ticksCount,
    ordered,
    raws,
    posSums,
    negSums,
    lo,
    hi,
    y,
    x,
    ticks,
    colors,
    fmtY,
    fmt,
    legendItems,
  };
}
