/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { max, min } from "d3-array";
import type { ScaleBand, ScaleLinear } from "d3-scale";
import { scaleBand, scaleLinear } from "d3-scale";
import type { ValueFormatter } from "../core/format";
import { resolveFormatter } from "../core/format";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { GRID_TICKS, POINT_RADIUS } from "../core/theme";
import type { RangeGroup, RangeSort } from "./range-chart.types";

export const GROUP_BAND_PADDING = 0.45;
export const AXIS_LABEL_OFFSET = 10;
export const CAP_MAX_WIDTH = 56;
export const ANNOTATION_LABEL_DX = 4;
export const ANNOTATION_LABEL_DY = -4;
/** Mínimo de ticks y separación de la etiqueta de valor. */
export const TICKS_MIN = 1;
export const VALUE_LABEL_GAP = 4;

/** Fila computada del rango (verbatim de la vista). */
export type ComputedRange = {
  label: string;
  low: number;
  high: number;
  point: number;
  isMid: boolean;
  color?: string;
};

/** Entrada pura del modelo de rango. */
export type ComputeRangeInput = {
  groups: RangeGroup[];
  sortGroups: RangeSort;
  yMin?: number;
  yMax?: number;
  gridTicks: number;
  formatY?: ValueFormatter;
  locale: string;
  pointRadius: number;
  capWidth?: number;
  innerW: number;
  innerH: number;
};

/** Salida pura del modelo de rango (dominio, escalas, filas). */
export type RangeModel = {
  ordered: ComputedRange[];
  all: number[];
  blo: number;
  bhi: number;
  fmtY: ValueFormatter;
  safeTicks: number;
  dotR: number;
  y: ScaleLinear<number, number>;
  x: ScaleBand<string>;
  ticks: number[];
  capW: number;
};

/**
 * Filas limpias del rango (filtra no-finitos; tope DEFAULT_MAX_ROWS;
 * punto de valor o medio si falta; verbatim de la vista).
 */
export function cleanRangeRows(groups: RangeGroup[]): ComputedRange[] {
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
  return computed;
}

/** Orden de grupos por valor (verbatim de la vista). */
export function orderRangeRows(
  computed: ComputedRange[],
  sortGroups: RangeSort,
): ComputedRange[] {
  return sortGroups === "none"
    ? computed
    : [...computed].sort((a, b) =>
        sortGroups === "asc" ? a.point - b.point : b.point - a.point,
      );
}

/**
 * Modelo puro de rango: limpieza + orden + dominio custom con cero +
 * escalas (verbatim de la vista; NO adopta `buildValueAxis`: dominio
 * custom con `min`/`max` de d3-array y ticks saneados).
 */
export function computeRangeModel(input: ComputeRangeInput): RangeModel {
  const {
    groups,
    sortGroups,
    yMin,
    yMax,
    gridTicks,
    formatY,
    locale,
    pointRadius,
    capWidth,
    innerW,
    innerH,
  } = input;
  const computed = cleanRangeRows(groups);
  const ordered = orderRangeRows(computed, sortGroups);

  const all = ordered.flatMap((c) => [c.low, c.high, c.point]);
  const fixedLo = toNumber(yMin, Number.NaN);
  const fixedHi = toNumber(yMax, Number.NaN);
  const blo = Number.isFinite(fixedLo) ? fixedLo : Math.min(0, min(all) ?? 0);
  const rawHi = Number.isFinite(fixedHi) ? fixedHi : (max(all) ?? 1);
  const bhi = rawHi <= blo ? blo + 1 : rawHi;
  const fmtY = resolveFormatter(formatY, locale);
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
  const autoCap = Math.min(CAP_MAX_WIDTH, x.bandwidth());
  const capW =
    capWidth === undefined ? autoCap : Math.max(0, toNumber(capWidth, autoCap));

  return { ordered, all, blo, bhi, fmtY, safeTicks, dotR, y, x, ticks, capW };
}
