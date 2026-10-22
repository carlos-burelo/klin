/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { arc } from "d3-shape";
import { seriesColor } from "../core/color";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { clamp01, toNumber } from "../core/number";
import type {
  RadialBarChartProps,
  RadialBarDatum,
} from "./radial-bar-chart.types";

/** Ancho del lienzo y margen base (paridad con `render/chart-svg`). */
export const W = 640;
export const MARGIN = { top: 12, right: 12, bottom: 32, left: 44 };

/** Ángulo inicial (arriba) y vuelta completa de cada anillo. */
export const RADIAL_BAR_START = -Math.PI / 2;
export const RADIAL_BAR_FULL = Math.PI * 2;
/** Grosor del anillo, calle entre anillos y radio interior mínimo. */
export const RING_THICKNESS = 14;
export const RING_GAP = 6;
export const RING_MIN_INNER = 12;
export const RING_MIN_STEP = 2;
/** Ancho de la columna izquierda de etiquetas y respiro exterior. */
export const LABEL_COL_W = 168;
export const LABEL_TEXT_DX = 12;
export const LABEL_ROW_H = 22;
export const OUTER_PAD = 10;
/** Radio de esquina del arco de valor y tamaño del total central. */
export const RING_CORNER_DEFAULT = RING_THICKNESS / 2;
export const RADIAL_TOTAL_FONT_SIZE = 20;
export const RADIAL_TOTAL_LABEL_DY = 16;

/** Fracción radial (valor, máximo y fracción 0–1). */
export type RadialFrac = {
  value: number;
  max: number;
  frac: number;
};

/** Fracción `value / (max ?? 100)` (clamp 0–1, verbatim de la vista). */
export function radialFracOf(s: RadialBarDatum): RadialFrac {
  const value = Math.max(0, toNumber(s.value));
  const max = toNumber(s.max, 100);
  return { value, max, frac: max > 0 ? clamp01(value / max) : 0 };
}

/** Filas limpias (tope + orden por fracción si `sortSlices`, verbatim). */
export function cleanRadialRows(
  series: RadialBarDatum[],
  sortSlices: boolean,
): RadialBarDatum[] {
  const base = series.slice(0, DEFAULT_MAX_ROWS);
  return sortSlices
    ? [...base].sort((a, b) => radialFracOf(b).frac - radialFracOf(a).frac)
    : base;
}

/** Fracciones por fila (verbatim de la vista). */
export function radialFracs(rows: RadialBarDatum[]): RadialFrac[] {
  return rows.map(radialFracOf);
}

/** Suma de valores (total central, verbatim de la vista). */
export function radialTotal(fracs: RadialFrac[]): number {
  return fracs.reduce((acc, f) => acc + f.value, 0);
}

/** Color del anillo: `datum.color` → `itemColor` → serie. */
export function resolveRadialBarColor(
  datum: RadialBarDatum,
  index: number,
  itemColor: RadialBarChartProps["itemColor"],
): string {
  return datum.color ?? itemColor?.(datum, index) ?? seriesColor(index);
}

/** Ángulo inicial y radio de esquina normalizados (verbatim de la vista). */
export function normalizeRadialAngles(
  startAngle: unknown,
  cornerRadius: unknown,
): { start: number; corner: number } {
  const start = toNumber(startAngle, RADIAL_BAR_START);
  const corner = Math.max(0, toNumber(cornerRadius, RING_CORNER_DEFAULT));
  return { start, corner };
}

/** Geometría de anillos (ancho útil, radio exterior, centro y paso, verbatim). */
export function radialLayout(
  rowCount: number,
  height: number,
): {
  plotW: number;
  outer: number;
  cx: number;
  cy: number;
  step: number;
} {
  const plotW = W - MARGIN.left - MARGIN.right - LABEL_COL_W;
  const outer = Math.max(0, Math.min(plotW / 2, height / 2) - OUTER_PAD);
  const cx = MARGIN.left + LABEL_COL_W + plotW / 2;
  const cy = height / 2;
  const step =
    rowCount > 1
      ? Math.max(
          RING_MIN_STEP,
          Math.min(
            RING_THICKNESS + RING_GAP,
            (outer - RING_THICKNESS - RING_MIN_INNER) / (rowCount - 1),
          ),
        )
      : 0;
  return { plotW, outer, cx, cy, step };
}

/** Radios exterior e interior del anillo `i` (verbatim de la vista). */
export function radialRingRadii(
  outer: number,
  step: number,
  i: number,
): { rOuter: number; rInner: number } {
  const rOuter = outer - i * step;
  const rInner = Math.max(0, rOuter - RING_THICKNESS);
  return { rOuter, rInner };
}

/** Pista tenue de vuelta completa (verbatim de la vista). */
export function buildRadialTrackPath(rInner: number, rOuter: number): string {
  return (
    arc().innerRadius(rInner).outerRadius(rOuter)({
      innerRadius: rInner,
      outerRadius: rOuter,
      startAngle: 0,
      endAngle: RADIAL_BAR_FULL,
    }) ?? ""
  );
}

/** Arco de valor tipo píldora (verbatim de la vista). */
export function buildRadialValuePath(
  rInner: number,
  rOuter: number,
  start: number,
  frac: number,
  corner: number,
): string {
  return (
    arc()
      .innerRadius(rInner)
      .outerRadius(rOuter)
      .cornerRadius(frac >= 1 ? 0 : corner)({
      innerRadius: rInner,
      outerRadius: rOuter,
      startAngle: start,
      endAngle: start + frac * RADIAL_BAR_FULL,
    }) ?? ""
  );
}
