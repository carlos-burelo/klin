/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScaleBand } from "d3-scale";
import { scaleBand } from "d3-scale";
import { buildValueAxis } from "../core/cartesian-model";
import type { ValueFormatter } from "../core/format";
import { toNumber } from "../core/number";
import type { ChartSeries } from "../core/series";
import { sortByGroupTotal } from "../core/stacked-model";

export const W = 640;
/** Ancho por defecto reservado a etiquetas de fila. */
export const DEFAULT_LABEL_WIDTH = 132;
export const MARGIN = {
  top: 8,
  right: 48,
  bottom: 28,
  left: DEFAULT_LABEL_WIDTH,
};

export const GROUP_BAND_PADDING = 0.25;
export const SERIES_BAND_PADDING = 0.15;
export const LABEL_MAX_X = 18;
export const AXIS_LABEL_OFFSET = 10;
export const ROW_BASE_H = 30;
export const ROW_PER_SERIES_H = 4;
export const MIN_HEIGHT = 140;
/** Grosor del acento del grupo máximo. */
export const HIGHLIGHT_WIDTH = 2;

type GroupRow = Record<string, string | number>;

/** Suma de series por grupo (verbatim de la vista). */
export function totalOfGroup(d: GroupRow, series: ChartSeries[]): number {
  return series.reduce((acc, s) => acc + toNumber(d[s.key]), 0);
}

/** Ordena grupos por total vía sortByGroupTotal (adopción stacked-model). */
export function orderHorizontalGroups(
  data: GroupRow[],
  series: ChartSeries[],
  sortGroups: "none" | "asc" | "desc",
): GroupRow[] {
  return sortByGroupTotal(data, series, sortGroups);
}

/** Margen con izquierda según labelWidth (verbatim de la vista). */
export function resolveHorizontalMargin(labelWidth: unknown): typeof MARGIN {
  return { ...MARGIN, left: toNumber(labelWidth, DEFAULT_LABEL_WIDTH) };
}

/** Alto de fila según nº de series (verbatim de la vista). */
export function resolveHorizontalRowHeight(seriesCount: number): number {
  return ROW_BASE_H + seriesCount * ROW_PER_SERIES_H;
}

/** Alto del lienzo: automático según filas salvo override (verbatim). */
export function resolveHorizontalHeight(
  rowCount: number,
  rowH: number,
  margin: typeof MARGIN,
  heightProp: unknown,
): number {
  const autoHeight = Math.max(
    MIN_HEIGHT,
    margin.top + margin.bottom + rowCount * rowH,
  );
  return heightProp == null
    ? autoHeight
    : Math.max(MIN_HEIGHT, Math.round(toNumber(heightProp, autoHeight)));
}

/** Eje de valor horizontal vía buildValueAxis (adopción cartesian-model). */
export function buildHorizontalValueAxis(
  ordered: GroupRow[],
  series: ChartSeries[],
  ticksCount: number,
  formatX: ValueFormatter | undefined,
  locale: string,
  innerW: number,
  xMin?: number,
  xMax?: number,
  xScale: "linear" | "log" = "linear",
): {
  lo: number;
  hi: number;
  x: (value: number) => number;
  ticks: number[];
  fmtX: ValueFormatter;
  lv: (v: number) => number;
  log: boolean;
} {
  const flat = ordered.flatMap((d) => series.map((s) => toNumber(d[s.key])));
  const { lo, hi, y, ticks, fmt, lift, log } = buildValueAxis(
    {
      values: flat,
      ticks: ticksCount,
      format: formatX,
      locale,
      yMin: xMin,
      yMax: xMax,
      scale: xScale,
    },
    [0, innerW],
  );
  return { lo, hi, x: y, ticks, fmtX: fmt, lv: lift, log };
}

/** Bandas de grupo (filas) y de serie (verbatim de la vista). */
export function buildHorizontalBands(
  ordered: GroupRow[],
  series: ChartSeries[],
  yKey: string,
  innerH: number,
): { y0: ScaleBand<string>; y1: ScaleBand<string> } {
  const y0 = scaleBand()
    .domain(ordered.map((d) => String(d[yKey] ?? "")))
    .range([0, innerH])
    .padding(GROUP_BAND_PADDING);
  const y1 = scaleBand()
    .domain(series.map((s) => s.key))
    .range([0, y0.bandwidth()])
    .padding(SERIES_BAND_PADDING);
  return { y0, y1 };
}
