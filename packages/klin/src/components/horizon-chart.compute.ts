/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { type ScalePoint, scalePoint } from "d3-scale";
import { area, curveMonotoneX } from "d3-shape";
import { toNumber } from "../core/number";
import type { HorizonMode, HorizonSeries } from "./horizon-chart.types";

/** Ancho del lienzo y margen base (paridad con `render/chart-svg`). */
export const W = 640;
export const MARGIN = { top: 12, right: 12, bottom: 32, left: 44 };

export const POINT_PADDING = 0.5;
/** Opacidad base de banda + incremento por nivel. */
export const BAND_BASE_OPACITY = 0.25;
export const BAND_OPACITY_STEP = 0.75;
/** Etiquetas de carril y de eje. */
export const LANE_LABEL_X = 4;
export const LANE_LABEL_DY = 12;
export const AXIS_LABEL_OFFSET = 10;
/** Radio de captura táctil/mouse por punto (invisible). */
export const HIT_RADIUS = 8;

/** Fila limpia del horizonte (serie y muestra finitizada). */
export type HorizonCleanRow = {
  serie: HorizonSeries;
  values: number[];
};

/** Punto plegado (valor crudo y magnitud plegada). */
export type HorizonFoldPoint = {
  v: number;
  mag: number;
};

/** Trazo de banda plegada (path + opacidad). */
export type HorizonBandPath = {
  d: string;
  opacity: number;
};

/** Filas con al menos un finito (verbatim de la vista). */
export function cleanHorizonRows(series: HorizonSeries[]): HorizonCleanRow[] {
  return series
    .map((s) => ({
      serie: s,
      values: s.values.map((v) => toNumber(v, Number.NaN)),
    }))
    .filter((c) => c.values.some((v) => Number.isFinite(v)));
}

/** Longitud máxima de muestra entre carriles (verbatim de la vista). */
export function resolveHorizonCount(clean: HorizonCleanRow[]): number {
  return Math.max(...clean.map((c) => c.values.length));
}

/** Nº de bandas de plegado (mínimo 1, verbatim de la vista). */
export function normalizeHorizonBands(bands: unknown): number {
  return Math.max(1, Math.floor(toNumber(bands, 4)));
}

/** Máximo absoluto global (comparable entre carriles, verbatim). */
export function resolveHorizonMaxAbs(clean: HorizonCleanRow[]): number {
  let maxAbs = 0;
  for (const c of clean)
    for (const v of c.values)
      if (Number.isFinite(v)) maxAbs = Math.max(maxAbs, Math.abs(v));
  return maxAbs;
}

/** Geometría de carriles y altura de banda (verbatim de la vista). */
export function resolveHorizonLayout(
  clean: HorizonCleanRow[],
  height: number,
  bandCount: number,
  maxAbs: number,
): { innerW: number; innerH: number; laneH: number; bandH: number } {
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const laneH = innerH / clean.length;
  const bandH = maxAbs / bandCount;
  return { innerW, innerH, laneH, bandH };
}

/** Etiquetas X y escala de punto (verbatim de la vista). */
export function buildHorizonScale(
  n: number,
  labels: string[] | undefined,
  innerW: number,
): { xs: string[]; x: ScalePoint<string> } {
  const xs = Array.from({ length: n }, (_, i) => labels?.[i] ?? String(i + 1));
  const x = scalePoint()
    .domain(xs.map((_, i) => String(i)))
    .range([0, innerW])
    .padding(POINT_PADDING);
  return { xs, x };
}

/** Alturas plegadas por banda en cada índice (verbatim de la vista). */
export function foldHorizonLane(
  values: number[],
  n: number,
  mode: HorizonMode,
): HorizonFoldPoint[] {
  return Array.from({ length: n }, (_, i) => {
    const v = values[i];
    const finite = Number.isFinite(v) ? (v as number) : 0;
    const mag = mode === "mirror" ? Math.abs(finite) : finite;
    return { v: finite, mag };
  });
}

/** Trazos de banda plegada por nivel (verbatim de la vista). */
export function buildHorizonBandPaths(
  folded: HorizonFoldPoint[],
  bandCount: number,
  bandH: number,
  lane: { laneTop: number; laneMid: number; laneBottom: number },
  mode: HorizonMode,
  atX: (i: number) => number,
): HorizonBandPath[] {
  const { laneMid, laneBottom } = lane;
  return Array.from({ length: bandCount }, (_, k) => {
    const pts = folded.map(({ v, mag }, i) => {
      const h = Math.min(Math.max(mag - k * bandH, 0), bandH);
      if (mode === "mirror") {
        return {
          i,
          y0: laneBottom - k * bandH,
          y1: laneBottom - k * bandH - h,
        };
      }
      const neg = v < 0;
      return neg
        ? {
            i,
            y0: laneMid + k * bandH,
            y1: laneMid + k * bandH + h,
          }
        : {
            i,
            y0: laneMid - k * bandH,
            y1: laneMid - k * bandH - h,
          };
    });
    const d =
      area<{ i: number; y0: number; y1: number }>()
        .x((p) => atX(p.i))
        .y0((p) => p.y0)
        .y1((p) => p.y1)
        .curve(curveMonotoneX)(pts) ?? "";
    return {
      d,
      opacity: BAND_BASE_OPACITY + BAND_OPACITY_STEP * ((k + 1) / bandCount),
    };
  });
}
