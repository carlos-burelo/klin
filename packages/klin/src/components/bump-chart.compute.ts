/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import type { ScaleLinear, ScalePoint } from "d3-scale";
import { scaleLinear, scalePoint } from "d3-scale";
import { curveMonotoneX, line } from "d3-shape";
import { toNumber } from "../core/number";
import { GRID_TICKS, POINT_RADIUS } from "../core/theme";

export const BUMP_MARGIN_TOP = 12;
export const BUMP_MARGIN_RIGHT = 72;
export const BUMP_MARGIN_BOTTOM = 32;
export const BUMP_MARGIN_LEFT = 72;
export const BUMP_POINT_PADDING = 0.5;
export const BUMP_AXIS_LABEL_OFFSET = 10;
export const BUMP_LABEL_MAX = 10;
export const BUMP_MIN_RANK = 1;
/** Mínimo de ticks y separación de la etiqueta de valor. */
export const TICKS_MIN = 1;
export const VALUE_LABEL_GAP = 4;

export type BumpPoint = {
  period: string;
  rank: number;
};

export type BumpInputSeries = {
  label: string;
  ranks: number[];
  color?: string;
};

export type BumpRow = {
  label: string;
  color: string | undefined;
  points: BumpPoint[];
  si: number;
};

/** Filas con ranks normalizados a enteros ≥ 1 (verbatim de la vista). */
export function buildBumpRows(
  series: BumpInputSeries[],
  periods: string[],
): BumpRow[] {
  return series.map((s, si) => {
    const pts: BumpPoint[] = [];
    const count = Math.min(s.ranks.length, periods.length);
    for (let i = 0; i < count; i++) {
      const rank = toNumber(s.ranks[i], Number.NaN);
      if (!Number.isFinite(rank)) continue;
      pts.push({
        period: periods[i] ?? "",
        rank: Math.max(BUMP_MIN_RANK, Math.round(rank)),
      });
    }
    return { label: s.label, color: s.color, points: pts, si };
  });
}

/** Selección topN por mejor puesto final (verbatim de la vista). */
export function selectBumpVisible(
  rows: BumpRow[],
  topN: number | undefined,
): BumpRow[] {
  const wanted =
    topN === undefined ? Number.NaN : Math.floor(toNumber(topN, Number.NaN));
  return Number.isFinite(wanted) && wanted >= 0
    ? rows
        .filter((r) => r.points.length > 0)
        .sort(
          (a, b) =>
            (a.points[a.points.length - 1]?.rank ?? BUMP_MIN_RANK) -
            (b.points[b.points.length - 1]?.rank ?? BUMP_MIN_RANK),
        )
        .slice(0, wanted)
    : rows;
}

/** Escala Y invertida de puestos + ticks enteros (verbatim de la vista). */
export function buildBumpYScale(
  visible: BumpRow[],
  gridTicks: number,
  innerH: number,
): {
  safeTicks: number;
  top: number;
  y: ScaleLinear<number, number>;
  ticks: number[];
} {
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(gridTicks, GRID_TICKS)),
  );
  let top = BUMP_MIN_RANK;
  for (const row of visible) {
    for (const p of row.points) top = Math.max(top, p.rank);
  }
  const y = scaleLinear()
    .domain([BUMP_MIN_RANK, Math.max(top, BUMP_MIN_RANK + 1)])
    .range([innerH, 0]);
  const ticks = y.ticks(safeTicks).filter((t) => Number.isInteger(t));
  return { safeTicks, top, y, ticks };
}

/** Escala X de periodos (verbatim de la vista). */
export function buildBumpXScale(
  periods: string[],
  innerW: number,
): {
  x: ScalePoint<string>;
  firstX: number;
  lastX: number;
} {
  const x = scalePoint()
    .domain(periods)
    .range([0, innerW])
    .padding(BUMP_POINT_PADDING);
  const firstX = x(periods[0] ?? "") ?? 0;
  const lastX = x(periods[periods.length - 1] ?? "") ?? 0;
  return { x, firstX, lastX };
}

/** Radio de punto saneado (verbatim de la vista). */
export function resolveBumpDotRadius(pointRadius: number): number {
  return Math.max(0, toNumber(pointRadius, POINT_RADIUS));
}

/** Path suave de una fila (verbatim de la vista). */
export function bumpPathFor(
  pts: BumpPoint[],
  x: ScalePoint<string>,
  y: ScaleLinear<number, number>,
): string | null {
  return (
    line<BumpPoint>()
      .x((p) => BUMP_MARGIN_LEFT + (x(p.period) ?? 0))
      .y((p) => BUMP_MARGIN_TOP + y(p.rank))
      .curve(curveMonotoneX)(pts) ?? null
  );
}
