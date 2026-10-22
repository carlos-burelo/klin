/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScaleLinear } from "d3-scale";
import { scaleLinear } from "d3-scale";
import { domainWithZero } from "../core/domain";
import type { ValueFormatter } from "../core/format";
import { resolveFormatter } from "../core/format";
import { toNumber } from "../core/number";
import { CHART_TOKEN, GRID_TICKS } from "../core/theme";
import type { SlopeDatum } from "./slope-chart.types";

export const SLOPE_MARGIN_TOP = 30;
export const SLOPE_MARGIN_RIGHT = 116;
export const SLOPE_MARGIN_BOTTOM = 18;
export const SLOPE_MARGIN_LEFT = 116;
export const SLOPE_HEADER_Y = 18;
export const SLOPE_LABEL_MAX = 16;
export const SLOPE_UP_SIGN = "+";
export const SLOPE_DOWN_SIGN = "−";

/** Fila limpia de pendiente (verbatim de la vista). */
export type SlopeRow = {
  label: string;
  from: number;
  to: number;
  color?: string;
};

/** Entrada pura del modelo de pendiente. */
export type ComputeSlopeInput = {
  data: SlopeDatum[];
  sortGroups: boolean;
  formatY?: ValueFormatter;
  locale: string;
  height: number;
};

/** Salida pura del modelo de pendiente (filas, dominio, escala). */
export type SlopeModel = {
  rows: SlopeRow[];
  ordered: SlopeRow[];
  fmtY: ValueFormatter;
  innerH: number;
  lo: number;
  hi: number;
  y: ScaleLinear<number, number>;
};

/**
 * Filas limpias de pendiente (filtra no-finitos; verbatim de la vista).
 */
export function cleanSlopeRows(data: SlopeDatum[]): SlopeRow[] {
  const rows: SlopeRow[] = [];
  for (const d of data) {
    const from = toNumber(d.from, Number.NaN);
    const to = toNumber(d.to, Number.NaN);
    if (!Number.isFinite(from) || !Number.isFinite(to)) continue;
    rows.push({ label: d.label, from, to, color: d.color });
  }
  return rows;
}

/** Orden por delta descendente solo si `sortGroups` (verbatim). */
export function orderSlopeRows(
  rows: SlopeRow[],
  sortGroups: boolean,
): SlopeRow[] {
  return sortGroups
    ? [...rows].sort((a, b) => b.to - b.from - (a.to - a.from))
    : rows;
}

/** Colores de subida/bajada (overrides o tokens actuales). */
export function resolveSlopeColors(
  colorUp: string | undefined,
  colorDown: string | undefined,
): { up: string; down: string } {
  return {
    up: colorUp ?? CHART_TOKEN.chart1,
    down: colorDown ?? CHART_TOKEN.destructive,
  };
}

/** Color de una fila (color propio, si no subida/bajada). */
export function slopeRowColor(row: SlopeRow, up: string, down: string): string {
  return row.color ?? (row.to - row.from >= 0 ? up : down);
}

/**
 * Modelo puro de pendiente: limpieza + orden + dominio con cero +
 * escala lineal (verbatim de la vista; NO adopta `buildValueAxis`:
 * bloque sin overrides y layout custom de dos ejes).
 */
export function computeSlopeModel(input: ComputeSlopeInput): SlopeModel {
  const { data, sortGroups, formatY, locale, height } = input;
  const rows = cleanSlopeRows(data);
  const ordered = orderSlopeRows(rows, sortGroups);

  const fmtY = resolveFormatter(formatY, locale);
  const innerH = height - SLOPE_MARGIN_TOP - SLOPE_MARGIN_BOTTOM;
  const [lo, hi] = domainWithZero([
    ...ordered.map((r) => r.from),
    ...ordered.map((r) => r.to),
  ]);
  const y = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(GRID_TICKS)
    .range([innerH, 0]);

  return { rows, ordered, fmtY, innerH, lo, hi, y };
}
