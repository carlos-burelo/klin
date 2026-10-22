/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScaleBand } from "d3-scale";
import { scaleBand } from "d3-scale";
import type { ValueAxis } from "../core/cartesian-model";
import { buildValueAxis } from "../core/cartesian-model";
import { seriesColors } from "../core/color";
import type { ValueFormatter } from "../core/format";
import { toNumber } from "../core/number";
import type { ValueScaleKind } from "../core/scale";
import type { ChartSeries } from "../core/series";
import type { StackedMatrix } from "../core/stacked-model";
import {
  buildStackedMatrix,
  maxTotalIndex,
  sortByGroupTotal,
} from "../core/stacked-model";
import { BAR_RADIUS, CHART_TOKEN } from "../core/theme";

export const GROUP_BAND_PADDING = 0.22;
export const SERIES_BAND_PADDING = 0.08;
/** Alto mínimo de segmento (px) para rotular su valor dentro. */
export const MIN_SEGMENT_LABEL_PX = 16;
/** Grosor del acento del grupo máximo. */
export const HIGHLIGHT_WIDTH = 2;

type GroupRow = Record<string, string | number>;

/** Entrada pura del modelo de barras verticales. */
export type ComputeBarInput = {
  data: GroupRow[];
  xKey: string;
  series: ChartSeries[];
  innerW: number;
  innerH: number;
  layout: "grouped" | "stacked" | "percent";
  sortGroups: "none" | "asc" | "desc";
  barRadius?: number;
  gridTicks: number;
  yMin?: number;
  yMax?: number;
  yScale: ValueScaleKind;
  formatY?: ValueFormatter;
  locale: string;
  showLegend: boolean;
};

/** Salida pura del modelo de barras (matriz, eje, bandas, colores). */
export type BarModel = {
  radius: number;
  stacked: boolean;
  percent: boolean;
  ordered: GroupRow[];
  raws: number[][];
  posSums: number[];
  negSums: number[];
  totals: number[];
  maxGroup: number;
  lo: number;
  hi: number;
  y: ValueAxis["y"];
  ticks: number[];
  fmtY: ValueFormatter;
  lv: (v: number) => number;
  log: boolean;
  y0: number;
  x0: ScaleBand<string>;
  x1: ScaleBand<string>;
  colors: string[];
  annLo: number;
  annHi: number;
  legendItems: Array<{ label: string; color: string }> | undefined;
};

/** Ordena grupos por total vía sortByGroupTotal (adopción stacked-model). */
export function orderBarGroups(
  data: GroupRow[],
  series: ChartSeries[],
  sortGroups: "none" | "asc" | "desc",
): GroupRow[] {
  return sortByGroupTotal(data, series, sortGroups);
}

/** Matriz apilada vía buildStackedMatrix (adopción stacked-model). */
export function buildBarMatrix(
  ordered: GroupRow[],
  series: ChartSeries[],
): StackedMatrix {
  return buildStackedMatrix(ordered, series);
}

/** Eje de valor vía buildValueAxis (adopción cartesian-model). */
export function buildBarValueAxis(
  stacked: boolean,
  percent: boolean,
  raws: number[][],
  posSums: number[],
  negSums: number[],
  gridTicks: number,
  formatY: ValueFormatter | undefined,
  locale: string,
  yMin: number | undefined,
  yMax: number | undefined,
  yScale: ValueScaleKind,
  innerH: number,
): ValueAxis {
  const flat = raws.flat();
  return buildValueAxis(
    {
      values: stacked ? [...posSums, ...negSums] : flat,
      ticks: gridTicks,
      format: formatY,
      locale,
      yMin,
      yMax,
      scale: yScale,
      percent,
    },
    [innerH, 0],
  );
}

/** Bandas de grupo y de serie (verbatim de la vista). */
export function buildBarBands(
  ordered: GroupRow[],
  series: ChartSeries[],
  xKey: string,
  innerW: number,
): { x0: ScaleBand<string>; x1: ScaleBand<string> } {
  const x0 = scaleBand()
    .domain(ordered.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const x1 = scaleBand()
    .domain(series.map((s) => s.key))
    .range([0, x0.bandwidth()])
    .padding(SERIES_BAND_PADDING);
  return { x0, x1 };
}

/**
 * Modelo puro de barras: orden + matriz stacked-model + eje
 * cartesian-model + bandas + colores (verbatim de la vista).
 */
export function computeBarModel(input: ComputeBarInput): BarModel {
  const {
    data,
    xKey,
    series,
    innerW,
    innerH,
    layout,
    sortGroups,
    barRadius,
    gridTicks,
    yMin,
    yMax,
    yScale,
    formatY,
    locale,
    showLegend,
  } = input;
  const radius = toNumber(barRadius, BAR_RADIUS);
  const stacked = layout !== "grouped";
  const percent = layout === "percent";

  const ordered = orderBarGroups(data, series, sortGroups);
  const { raws, posSums, negSums, totals } = buildBarMatrix(ordered, series);
  const maxGroup = maxTotalIndex(totals);

  const axis = buildBarValueAxis(
    stacked,
    percent,
    raws,
    posSums,
    negSums,
    gridTicks,
    formatY,
    locale,
    yMin,
    yMax,
    yScale,
    innerH,
  );
  const { lo, hi: hiBase, y, ticks, fmt: fmtY, lift: lv, log } = axis;
  const y0 = y(log ? lo : 0);
  const { x0, x1 } = buildBarBands(ordered, series, xKey, innerW);

  const colors = seriesColors(series);
  const annLo = percent ? 0 : lo;
  const annHi = percent ? 1 : hiBase;
  const legendItems = showLegend
    ? series.map((s, i) => ({
        label: s.label,
        color: colors[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;

  return {
    radius,
    stacked,
    percent,
    ordered,
    raws,
    posSums,
    negSums,
    totals,
    maxGroup,
    lo,
    hi: hiBase,
    y,
    ticks,
    fmtY,
    lv,
    log,
    y0,
    x0,
    x1,
    colors,
    annLo,
    annHi,
    legendItems,
  };
}
