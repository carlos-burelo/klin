/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { quantileSorted } from "d3-array";
import { maxFinite, minFinite, sumNumbers, toNumber } from "../core/number";
import { GRID_TICKS } from "../core/theme";

export const GROUP_BAND_PADDING = 0.45;
export const AXIS_LABEL_OFFSET = 10;
export const BOX_MAX_WIDTH = 56;
export const BOX_LINE_WIDTH = 1.5;
export const BOX_FILL_OPACITY = 0.35;
export const OUTLIER_RADIUS = 3;
export const ANNOTATION_LABEL_DX = 4;
export const ANNOTATION_LABEL_DY = -4;
export const IQR_FACTOR = 1.5;
export const SAMPLE_LABEL_SHIFT = 12;
export const NOTCH_HALF_HEIGHT = 6;
export const NOTCH_DEPTH = 10;
/** Semitamaño del rombo de la media. */
export const MEAN_MARKER_HALF = 4;
/** Mínimo de ticks del grid. */
export const TICKS_MIN = 1;

export type Stats = {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean: number;
  outliers: number[];
};

/** Ticks sanitizados (piso + mínimo 1; `GRID_TICKS` por defecto). */
export function resolveBoxTicks(gridTicks: unknown): number {
  return Math.max(TICKS_MIN, Math.floor(toNumber(gridTicks, GRID_TICKS)));
}

/** Radio de atípicos sanitizado (piso 0; `OUTLIER_RADIUS` por defecto). */
export function resolveBoxRadius(pointRadius: unknown): number {
  return Math.max(0, toNumber(pointRadius, OUTLIER_RADIUS));
}

/** Límite inferior del dominio (override fijo o automático con cero). */
export function resolveBoxLo(all: number[], yMin: number | undefined): number {
  const fixed = yMin === undefined ? Number.NaN : toNumber(yMin, Number.NaN);
  if (Number.isFinite(fixed)) return fixed;
  const auto = minFinite(all);
  return Math.min(0, Number.isFinite(auto) ? auto : 0);
}

/** Límite superior del dominio (override fijo o automático). */
export function resolveBoxHi(
  all: number[],
  yMax: number | undefined,
  lo: number,
  hasOverride: boolean,
): number {
  const fixed = yMax === undefined ? Number.NaN : toNumber(yMax, Number.NaN);
  const auto = maxFinite(all);
  const raw = Number.isFinite(fixed) ? fixed : Number.isFinite(auto) ? auto : 1;
  if (!hasOverride) return raw;
  return raw <= lo ? lo + 1 : raw;
}

export function statsOf(
  values: number[],
  whisker: 1.5 | "minmax",
): Stats | null {
  const clean = values
    .map((v) => toNumber(v, Number.NaN))
    .filter((v) => Number.isFinite(v));
  const sorted = [...clean].sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const q1 = quantileSorted(sorted, 0.25) ?? sorted[0] ?? 0;
  const median = quantileSorted(sorted, 0.5) ?? sorted[0] ?? 0;
  const q3 = quantileSorted(sorted, 0.75) ?? sorted[0] ?? 0;
  const mean = sumNumbers(clean) / clean.length;
  if (whisker === "minmax") {
    return {
      min: sorted[0] ?? 0,
      q1,
      median,
      q3,
      max: sorted[sorted.length - 1] ?? 0,
      mean,
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
    mean,
    outliers: sorted.filter((v) => v < lo || v > hi),
  };
}
