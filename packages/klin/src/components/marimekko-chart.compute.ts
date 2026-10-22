/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScaleLinear } from "d3-scale";
import { scaleLinear } from "d3-scale";
import { seriesColors } from "../core/color";
import type { ValueFormatter } from "../core/format";
import { resolveFormatter } from "../core/format";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import type { ChartSeries } from "../core/series";
import { GRID_TICKS, PERCENT_FACTOR } from "../core/theme";

/** Desplazamiento de la etiqueta x bajo el eje. */
export const AXIS_LABEL_OFFSET = 10;
/** Separación entre columnas (inset uniforme, no altera proporciones). */
export const COLUMN_GAP = 4;
/** Separación entre segmentos apilados de una columna. */
export const SEGMENT_GAP = 2;
/** % mínimo de columna para rotular el % dentro del segmento. */
export const MIN_PCT_LABEL = 8;
/** Alto (y doble de ancho) mínimo en px para que el % quepa dentro. */
export const MIN_PCT_LABEL_PX = 14;

/** Entrada pura del modelo marimekko. */
export type ComputeMarimekkoInput = {
  data: Array<Record<string, string | number>>;
  widthKey: string;
  series: ChartSeries[];
  sortGroups: boolean;
  innerW: number;
  innerH: number;
  formatX?: ValueFormatter;
  format?: ValueFormatter;
  locale: string;
  minLabelPct?: number;
  maxItems?: number;
};

/** Salida pura del modelo marimekko (filas, anchos, escala, formatos, columnas). */
export type MarimekkoModel = {
  rows: Array<Record<string, string | number>>;
  widths: number[];
  totalW: number;
  y: ScaleLinear<number, number>;
  ticks: number[];
  colors: string[];
  fmtX: ValueFormatter;
  fmtV: ValueFormatter;
  fmtPct: (v: number) => string;
  minPct: number;
  colWs: number[];
  colXs: number[];
};

/**
 * Modelo puro del marimekko: filas (cap + orden), anchos, escala 0–1,
 * colores, formatos y geometría de columnas (verbatim de la vista).
 */
export function computeMarimekkoModel(
  input: ComputeMarimekkoInput,
): MarimekkoModel {
  const {
    data,
    widthKey,
    series,
    sortGroups,
    innerW,
    innerH,
    formatX,
    format,
    locale,
    minLabelPct,
    maxItems,
  } = input;
  const rawMax = Math.floor(
    toNumber(maxItems ?? DEFAULT_MAX_ROWS, DEFAULT_MAX_ROWS),
  );
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
  const sliced = data.slice(0, safeMax);
  const rows = sortGroups
    ? [...sliced].sort((a, b) => toNumber(b[widthKey]) - toNumber(a[widthKey]))
    : sliced;
  const widths = rows.map((d) => Math.max(0, toNumber(d[widthKey])));
  const totalW = widths.reduce((acc, w) => acc + w, 0);
  const y = scaleLinear().domain([0, 1]).nice(GRID_TICKS).range([innerH, 0]);
  const ticks = y.ticks(GRID_TICKS);
  const colors = seriesColors(series);
  const fmtX = resolveFormatter(formatX, locale);
  const fmtV = resolveFormatter(format, locale);
  const fmtPct = (v: number) => `${Math.round(v * PERCENT_FACTOR)}%`;
  const minPct = Math.max(0, toNumber(minLabelPct, MIN_PCT_LABEL));
  const colWs = widths.map((w) => (w / totalW) * innerW);
  const colXs: number[] = [];
  let acc = 0;
  for (const w of colWs) {
    colXs.push(acc);
    acc += w;
  }
  return {
    rows,
    widths,
    totalW,
    y,
    ticks,
    colors,
    fmtX,
    fmtV,
    fmtPct,
    minPct,
    colWs,
    colXs,
  };
}
