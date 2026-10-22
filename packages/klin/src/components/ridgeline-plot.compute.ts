/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { type ScaleLinear, scaleLinear } from "d3-scale";
import { area, curveCatmullRom } from "d3-shape";
import { type KdePoint, kdeOf, kdePeak } from "../core/kde";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { clamp01, toNumber } from "../core/number";
import { GRID_TICKS, POINT_RADIUS } from "../core/theme";
import type { RidgelineSeries, RidgelineSort } from "./ridgeline-plot.types";

/** Ancho del lienzo y margen base (paridad con `render/chart-svg`). */
export const W = 640;
export const MARGIN = { top: 12, right: 12, bottom: 32, left: 44 };

/** Ancho de la columna de etiquetas, solape y fracción del pico de fila. */
export const RIDGE_LABEL_W = 120;
export const RIDGE_OVERLAP_DEFAULT = 0.6;
export const RIDGE_OVERLAP_MAX = 0.95;
export const RIDGE_PEAK_FRAC = 0.95;
/** Relleno opaco de la cresta, marcas del eje X y colchón degenerado. */
export const RIDGE_FILL_OPACITY = 0.85;
export const TICK_MARK_H = 4;
export const AXIS_TICK_OFFSET = 16;
export const RIDGE_DEGENERATE_PAD = 1;
/** Mínimo de ticks del grid. */
export const TICKS_MIN = 1;

/** Fila de cresta (serie, índice original y muestra limpia). */
export type RidgelineRow = {
  entry: RidgelineSeries;
  oi: number;
  clean: number[];
};

/** Fila con pico de densidad. */
export type RidgelineOrderedRow = RidgelineRow & { peak: number };

/** Filas limpias (tope + no-finitos fuera, verbatim de la vista). */
export function cleanRidgelineRows(series: RidgelineSeries[]): RidgelineRow[] {
  return series
    .slice(0, DEFAULT_MAX_ROWS)
    .map((entry, oi) => ({
      entry,
      oi,
      clean: entry.values
        .map((v) => toNumber(v, Number.NaN))
        .filter((v) => Number.isFinite(v)),
    }))
    .filter((c) => c.clean.length > 0);
}

/** Dominio global con colchón degenerado (verbatim de la vista). */
export function resolveRidgelineDomain(rows: RidgelineRow[]): {
  glo: number;
  ghi: number;
} {
  const flat = rows.flatMap((c) => c.clean);
  let glo = flat[0] ?? 0;
  let ghi = flat[0] ?? 0;
  for (const v of flat) {
    if (v < glo) glo = v;
    if (v > ghi) ghi = v;
  }
  if (glo === ghi) {
    glo -= RIDGE_DEGENERATE_PAD;
    ghi += RIDGE_DEGENERATE_PAD;
  }
  return { glo, ghi };
}

/** Alto seguro del lienzo (verbatim de la vista). */
export function resolveRidgelineHeight(height: unknown): number {
  return toNumber(height, 260);
}

/** Ticks del eje X común (verbatim de la vista). */
export function normalizeRidgelineTicks(gridTicks: unknown): number {
  return Math.max(TICKS_MIN, Math.floor(toNumber(gridTicks, GRID_TICKS)));
}

/** Solape 0–1 con tope (verbatim de la vista). */
export function normalizeRidgelineOverlap(overlap: unknown): number {
  return Math.min(RIDGE_OVERLAP_MAX, clamp01(toNumber(overlap, 0)));
}

/** Radio del punto del pico (verbatim de la vista). */
export function normalizeRidgelineDotR(pointRadius: unknown): number {
  return Math.max(0, toNumber(pointRadius, POINT_RADIUS));
}

/** Escala X común con nice y sus marcas (verbatim de la vista). */
export function buildRidgelineScale(
  glo: number,
  ghi: number,
  safeTicks: number,
  plotW: number,
): { x: ScaleLinear<number, number>; ticks: number[] } {
  const x = scaleLinear().domain([glo, ghi]).nice(safeTicks).range([0, plotW]);
  const ticks = x.ticks(safeTicks);
  return { x, ticks };
}

/** Filas ordenadas por pico de densidad (verbatim de la vista). */
export function orderRidgelineRows(
  base: RidgelineRow[],
  sortGroups: RidgelineSort,
  glo: number,
  ghi: number,
): RidgelineOrderedRow[] {
  const withPeak = base.map((c) => ({
    ...c,
    peak: kdePeak(kdeOf(c.clean, 0, glo, ghi)),
  }));
  return sortGroups === "none"
    ? withPeak
    : [...withPeak].sort((a, b) =>
        sortGroups === "asc" ? a.peak - b.peak : b.peak - a.peak,
      );
}

/** Alto de fila y paso según solape (verbatim de la vista). */
export function resolveRidgelineRows(
  innerH: number,
  count: number,
  ov: number,
): { rowH: number; step: number } {
  const rowH = innerH / (1 + (count - 1) * (1 - ov));
  const step = rowH * (1 - ov);
  return { rowH, step };
}

/** Puntos KDE de la fila (misma KDE que el violín, verbatim). */
export function ridgePoints(
  clean: number[],
  glo: number,
  ghi: number,
): KdePoint[] {
  return kdeOf(clean, 0, glo, ghi);
}

/** Área de la cresta normalizada al pico (verbatim de la vista). */
export function buildRidgePath(
  pts: KdePoint[],
  plotX0: number,
  x: ScaleLinear<number, number>,
  baseY: number,
  rowH: number,
): string {
  let dmax = 0;
  for (const p of pts) dmax = Math.max(dmax, p.density);
  return (
    area<KdePoint>()
      .x((p) => plotX0 + x(p.value))
      .y0(baseY)
      .y1(
        (p) =>
          baseY - (dmax > 0 ? (p.density / dmax) * rowH * RIDGE_PEAK_FRAC : 0),
      )
      .curve(curveCatmullRom)(pts) ?? ""
  );
}
