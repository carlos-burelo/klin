/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScaleBand, ScaleLinear } from "d3-scale";
import { scaleBand, scaleLinear } from "d3-scale";
import { domainWithZero } from "../core/domain";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { GRID_TICKS, POINT_RADIUS_SCATTER } from "../core/theme";
import type { DumbbellSort } from "./dumbbell-chart.types";

export const W = 640;
export const MARGIN = { top: 8, right: 48, bottom: 28, left: 132 };

export const GROUP_BAND_PADDING = 0.25;
export const LABEL_MAX_X = 18;
export const AXIS_LABEL_OFFSET = 10;
export const ROW_H = 34;
export const MIN_HEIGHT = 140;
/** Mínimo de ticks del grid. */
export const TICKS_MIN = 1;

/** Fila de mancuerna (etiqueta + par a/b finitizados). */
export type DumbbellRow = { label: string; a: number; b: number };

/** Limpia filas: finitiza a/b, filtra no-finitos, topa filas (verbatim). */
export function cleanDumbbellRows(
  data: Array<Record<string, string | number>>,
  categoryKey: string,
  aKey: string,
  bKey: string,
): DumbbellRow[] {
  const computed: DumbbellRow[] = [];
  for (const d of data.slice(0, DEFAULT_MAX_ROWS)) {
    const a = toNumber(d[aKey], Number.NaN);
    const b = toNumber(d[bKey], Number.NaN);
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    computed.push({ label: String(d[categoryKey] ?? ""), a, b });
  }
  return computed;
}

/** Ordena por diferencia b−a (verbatim de la vista). */
export function orderDumbbellRows(
  computed: DumbbellRow[],
  sortGroups: DumbbellSort,
): DumbbellRow[] {
  return sortGroups === "none"
    ? computed
    : [...computed].sort((m, n) =>
        sortGroups === "asc"
          ? m.b - m.a - (n.b - n.a)
          : n.b - n.a - (m.b - m.a),
      );
}

/** Alto del lienzo según filas salvo override (verbatim de la vista). */
export function resolveDumbbellHeight(
  rowCount: number,
  height: number | undefined,
): number {
  return (
    height ??
    Math.max(MIN_HEIGHT, MARGIN.top + MARGIN.bottom + rowCount * ROW_H)
  );
}

/** Dominio X: automático con cero salvo override fijo (verbatim). */
export function resolveDumbbellDomain(
  ordered: DumbbellRow[],
  domain: [number, number] | undefined,
): { lo: number; hi: number } {
  const flat = ordered.flatMap((r) => [r.a, r.b]);
  const auto = domainWithZero(flat);
  const fixedLo =
    domain === undefined ? Number.NaN : toNumber(domain[0], Number.NaN);
  const fixedHi =
    domain === undefined ? Number.NaN : toNumber(domain[1], Number.NaN);
  return {
    lo: Number.isFinite(fixedLo) ? fixedLo : auto[0],
    hi: Number.isFinite(fixedHi) ? fixedHi : auto[1],
  };
}

/** Ticks del grid (verbatim de la vista). */
export function resolveDumbbellTicks(gridTicks: unknown): number {
  return Math.max(TICKS_MIN, Math.floor(toNumber(gridTicks, GRID_TICKS)));
}

/** Radio de punto (verbatim de la vista). */
export function resolveDumbbellRadius(pointRadius: unknown): number {
  return Math.max(0, toNumber(pointRadius, POINT_RADIUS_SCATTER));
}

/** Escalas X (lineal con nice) e Y (bandas, verbatim de la vista). */
export function buildDumbbellScales(
  ordered: DumbbellRow[],
  lo: number,
  hi: number,
  safeTicks: number,
  innerW: number,
  innerH: number,
): {
  x: ScaleLinear<number, number>;
  y0: ScaleBand<string>;
  ticks: number[];
} {
  const x = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(safeTicks)
    .range([0, innerW]);
  const y0 = scaleBand()
    .domain(ordered.map((r) => r.label))
    .range([0, innerH])
    .padding(GROUP_BAND_PADDING);
  return { x, y0, ticks: x.ticks(safeTicks) };
}

/** Fija la anotación al dominio (verbatim de la vista). */
export function clampDumbbellAnnotation(
  value: unknown,
  lo: number,
  hi: number,
): number {
  return Math.min(hi, Math.max(lo, toNumber(value)));
}
