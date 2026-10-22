/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScaleLinear } from "d3-scale";
import { scaleLinear } from "d3-scale";
import { curveStepAfter, line } from "d3-shape";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { maxFinite, minFinite, toNumber } from "../core/number";
import type { EcdfGroup } from "./ecdf-chart.types";

export const X_TICKS = 5;
/** Probabilidad de la línea de mediana (p=0.5). */
export const MEDIAN_P = 0.5;

/** Grupo saneado con muestra ordenada (verbatim de la vista). */
export type EcdfCleanGroup = {
  group: EcdfGroup;
  sorted: number[];
};

/** Punto del escalón (valor + probabilidad acumulada). */
export type EcdfPoint = { v: number; p: number };

/** Escalas X/Y + ticks + dominio (verbatim de la vista). */
export type EcdfScales = {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  ticks: number[];
  xticks: number[];
  lo: number;
  hi: number;
};

/** Saneado de grupos: topa filas, finitiza y ordena (verbatim de la vista). */
export function cleanEcdfGroups(groups: EcdfGroup[]): EcdfCleanGroup[] {
  return groups
    .slice(0, DEFAULT_MAX_ROWS)
    .map((group) => ({
      group,
      sorted: group.values
        .map((v) => toNumber(v, Number.NaN))
        .filter((v) => Number.isFinite(v))
        .sort((a, b) => a - b),
    }))
    .filter((c) => c.sorted.length > 0);
}

/** Escalas X (dominio de la muestra) e Y (0–1) + ticks (verbatim). */
export function buildEcdfScales(
  clean: EcdfCleanGroup[],
  innerW: number,
  innerH: number,
  gridTicks: number,
  xMin?: number,
  xMax?: number,
): EcdfScales {
  const rawLo = minFinite(clean.flatMap((c) => c.sorted));
  const rawHi = maxFinite(clean.flatMap((c) => c.sorted));
  const fixedLo = xMin === undefined ? Number.NaN : toNumber(xMin, Number.NaN);
  const fixedHi = xMax === undefined ? Number.NaN : toNumber(xMax, Number.NaN);
  const lo = Number.isFinite(fixedLo) ? fixedLo : rawLo;
  const hi = Number.isFinite(fixedHi) ? fixedHi : rawHi;
  const x = scaleLinear()
    .domain([
      Number.isFinite(lo) ? lo : 0,
      Number.isFinite(hi) && hi > lo ? hi : lo + 1,
    ])
    .nice(gridTicks)
    .range([0, innerW]);
  const y = scaleLinear().domain([0, 1]).range([innerH, 0]);
  const ticks = y.ticks(gridTicks);
  const xticks = x.ticks(X_TICKS);
  return { x, y, ticks, xticks, lo, hi };
}

/** Puntos del escalón arrancando en (v0, 0) (verbatim de la vista). */
export function buildEcdfPoints(sorted: number[]): EcdfPoint[] {
  const n = sorted.length;
  // El escalón arranca en (v0, 0): la curva empieza en probabilidad cero.
  const first = sorted[0] ?? 0;
  return [{ v: first, p: 0 }, ...sorted.map((v, i) => ({ v, p: (i + 1) / n }))];
}

/** Path del escalón con curva step-after (verbatim de la vista). */
export function buildEcdfPath(
  pts: EcdfPoint[],
  x: ScaleLinear<number, number>,
  y: ScaleLinear<number, number>,
): string {
  return (
    line<EcdfPoint>()
      .x((p) => x(p.v))
      .y((p) => y(p.p))
      .curve(curveStepAfter)(pts) ?? ""
  );
}
