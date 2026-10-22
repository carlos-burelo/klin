/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import type { Bin } from "d3-array";
import { bin, deviation, extent, quantileSorted } from "d3-array";
import type { ScaleLinear } from "d3-scale";
import { scaleLinear } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
import { topPositive } from "../core/domain";
import { sumNumbers, toNumber } from "../core/number";
import { GRID_TICKS, PERCENT_FACTOR } from "../core/theme";
import type { HistogramBinStrategy } from "./histogram.types";

export const BUCKET_INSET_PX = 1;
export const AXIS_LABEL_OFFSET = 10;
export const ANNOTATION_LABEL_DX = 4;
export const ANNOTATION_LABEL_DY = -4;
export const MEAN_LABEL_DX = 4;
export const MEAN_LABEL_DY = 12;

export type HistogramKdePoint = { value: number; density: number };

/** Limpieza de no-finitos (verbatim de la vista). */
export function cleanHistogramValues(values: number[]): number[] {
  return values
    .map((v) => toNumber(v, Number.NaN))
    .filter((v) => Number.isFinite(v));
}

/** Recorte a dominio [mínimo, máximo] (verbatim de la vista). */
export function resolveHistogramScope(
  clean: number[],
  domain: [number, number] | undefined,
): {
  clipLo: number;
  clipHi: number;
  hasClip: boolean;
  scoped: number[];
} {
  const clipLo =
    domain === undefined ? Number.NaN : toNumber(domain[0], Number.NaN);
  const clipHi =
    domain === undefined ? Number.NaN : toNumber(domain[1], Number.NaN);
  const hasClip =
    Number.isFinite(clipLo) && Number.isFinite(clipHi) && clipLo < clipHi;
  const scoped =
    hasClip && domain !== undefined
      ? clean.filter((v) => v >= clipLo && v <= clipHi)
      : clean;
  return { clipLo, clipHi, hasClip, scoped };
}

/** Dominio de cubetas con fallback degenerado (verbatim de la vista). */
export function resolveHistogramBinDomain(
  scoped: number[],
  domain: [number, number] | undefined,
  clipLo: number,
  clipHi: number,
  hasClip: boolean,
): [number, number] {
  const [lo, hi] = extent(scoped);
  if (hasClip && domain !== undefined) return [clipLo, clipHi];
  if (lo === undefined || hi === undefined || lo === hi)
    return [Math.min(0, lo ?? 0), Math.max(1, hi ?? 1)];
  return [lo, hi];
}

/** Conteo de cubetas según estrategia (`count`/indefinido = `bins` verbatim). */
export function resolveHistogramBinCount(
  scoped: number[],
  binDomain: [number, number],
  bins: number,
  binStrategy?: HistogramBinStrategy,
): number {
  if (binStrategy === undefined || binStrategy === "count") return bins;
  const n = scoped.length;
  const span = binDomain[1] - binDomain[0];
  if (!(n > 1) || !(span > 0)) return bins;
  if (binStrategy === "sturges") {
    return Math.max(1, Math.ceil(Math.log2(n) + 1));
  }
  if (binStrategy === "width") {
    const width = toNumber(bins, Number.NaN);
    if (!Number.isFinite(width) || width <= 0) return bins;
    return Math.max(1, Math.ceil(span / width));
  }
  const cbrt = Math.cbrt(n);
  if (binStrategy === "scott") {
    const sd = deviation(scoped);
    if (!Number.isFinite(sd) || (sd ?? 0) <= 0) return bins;
    const width = (3.5 * (sd ?? 0)) / cbrt;
    if (!(width > 0)) return bins;
    return Math.max(1, Math.ceil(span / width));
  }
  const sorted = [...scoped].sort((a, b) => a - b);
  const q1 = quantileSorted(sorted, 0.25);
  const q3 = quantileSorted(sorted, 0.75);
  const iqr = q1 === undefined || q3 === undefined ? Number.NaN : q3 - q1;
  if (!Number.isFinite(iqr) || iqr <= 0) return bins;
  const width = (2 * iqr) / cbrt;
  if (!(width > 0)) return bins;
  return Math.max(1, Math.ceil(span / width));
}

/** Cubetas con `d3.bin` (verbatim de la vista; estrategia optativa). */
export function buildHistogramBins(
  scoped: number[],
  binDomain: [number, number],
  bins: number,
  binStrategy?: HistogramBinStrategy,
): Bin<number, number>[] {
  return bin()
    .domain(binDomain)
    .thresholds(resolveHistogramBinCount(scoped, binDomain, bins, binStrategy))(
    scoped,
  );
}

/** Escalas X/Y + ticks (verbatim; `normalize` = eje Y en %). */
export function buildHistogramScales(
  binDomain: [number, number],
  buckets: Bin<number, number>[],
  innerW: number,
  innerH: number,
  gridTicks: number = GRID_TICKS,
  normalize = false,
  total = 0,
): {
  top: number;
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  ticks: number[];
} {
  const magnitudes =
    normalize && total > 0
      ? buckets.map((b) => (b.length / total) * PERCENT_FACTOR)
      : buckets.map((b) => b.length);
  const top = topPositive(magnitudes);
  const x = scaleLinear().domain(binDomain).range([0, innerW]);
  const y = scaleLinear().domain([0, top]).nice(gridTicks).range([innerH, 0]);
  const ticks = y.ticks(gridTicks);
  return { top, x, y, ticks };
}

/** Media, mediana y total (verbatim de la vista). */
export function computeHistogramStats(scoped: number[]): {
  total: number;
  mean: number;
  median: number;
} {
  const total = scoped.length;
  const mean = sumNumbers(scoped) / scoped.length;
  const median =
    quantileSorted(
      [...scoped].sort((a, b) => a - b),
      0.5,
    ) ??
    scoped[0] ??
    0;
  return { total, mean, median };
}

/** Paso uniforme de la rejilla KDE (verbatim de la vista). */
export function histogramKdeStep(
  binDomain: [number, number],
  kdeLength: number,
): number {
  // La rejilla KDE es uniforme: conteo ≈ densidad · n · ancho de paso.
  return kdeLength > 1
    ? (binDomain[1] - binDomain[0]) / (kdeLength - 1)
    : binDomain[1] - binDomain[0];
}

/** Paths de línea + área KDE fijados al tope Y (verbatim de la vista). */
export function buildHistogramKdePaths(
  kde: HistogramKdePoint[],
  x: ScaleLinear<number, number>,
  y: ScaleLinear<number, number>,
  top: number,
  scopedLength: number,
  kdeStep: number,
  marginLeft: number,
  marginTop: number,
  innerH: number,
  normalize = false,
  total = 0,
): { curvePath: string; curveArea: string } {
  // La curva nunca sale del lienzo: se fija al tope del dominio Y.
  // En modo % la altura se reescala (conteo · 100 / total).
  const pctScale = normalize && total > 0 ? PERCENT_FACTOR / total : 1;
  const kdeCount = (density: number) =>
    density * scopedLength * kdeStep * pctScale;
  const kdeY = (density: number) =>
    y(Math.min(Math.max(0, kdeCount(density)), top));
  const curvePath =
    kde.length > 0
      ? (line<HistogramKdePoint>()
          .x((p) => marginLeft + x(p.value))
          .y((p) => kdeY(p.density))
          .curve(curveMonotoneX)(kde) ?? "")
      : "";
  const curveArea =
    kde.length > 0
      ? (area<HistogramKdePoint>()
          .x((p) => marginLeft + x(p.value))
          .y0(() => marginTop + innerH)
          .y1((p) => kdeY(p.density))
          .curve(curveMonotoneX)(kde) ?? "")
      : "";
  return { curvePath, curveArea };
}
