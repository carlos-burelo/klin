/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { topPositive } from "../core/domain";
import { toNumber } from "../core/number";
import { EMPTY_CELL_OPACITY } from "../core/theme";

export const W = 640;
export const LABEL_W = 132;
export const LABEL_H = 30;
export const MAX_CELL = 64;
/** Celda mínima (px) para pintar valor en modo `auto`. */
export const MATRIX_VALUE_MIN_CELL = 28;
/** Separación entre celdas, aire lateral y relleno inferior. */
export const CELL_GAP = 4;
export const GRID_SIDE_PAD = 16;
export const GRID_BOTTOM_PAD = 8;
/** Máximos de truncado de columna y fila. */
export const LABEL_MAX_COL = 10;
export const LABEL_MAX_ROW = 18;
/** Opacidades de celda con valor (base + rango). */
export const CELL_BASE_OPACITY = 0.15;
export const CELL_RANGE_OPACITY = 0.85;

/** Tope positivo de la matriz (verbatim de la vista). */
export function computeMatrixTop(values: number[][]): number {
  return topPositive(values.flat());
}

/** Parrilla de celdas centrada en lienzo fijo (verbatim de la vista). */
export function computeMatrixGrid(
  colsLength: number,
  rowsLength: number,
): { cell: number; step: number; gridW: number; gx: number; H: number } {
  const cell = Math.min(
    MAX_CELL,
    Math.floor((W - LABEL_W - GRID_SIDE_PAD) / colsLength) - CELL_GAP,
  );
  const step = cell + CELL_GAP;
  const gridW = colsLength * step - CELL_GAP;
  const gx = LABEL_W + Math.max(0, (W - LABEL_W - gridW) / 2);
  const H = LABEL_H + rowsLength * step - CELL_GAP + GRID_BOTTOM_PAD;
  return { cell, step, gridW, gx, H };
}

/** Valor de celda: ausente/NaN → missing (verbatim de la vista). */
export function matrixCellValue(raw: unknown): {
  isMissing: boolean;
  v: number;
} {
  const num = typeof raw === "number" ? raw : Number(raw);
  const isMissing = raw === undefined || raw === null || !Number.isFinite(num);
  return { isMissing, v: isMissing ? 0 : toNumber(num) };
}

/** Opacidad de celda con valor (verbatim de la vista). */
export function matrixCellOpacity(
  isMissing: boolean,
  v: number,
  top: number,
): number {
  return isMissing || v <= 0
    ? EMPTY_CELL_OPACITY
    : CELL_BASE_OPACITY + CELL_RANGE_OPACITY * (v / top);
}

/** Dominio explícito min → max (auto: 0 → tope actual). */
export function resolveMatrixDomain(
  values: number[][],
  min: number | undefined,
  max: number | undefined,
): { lo: number; hi: number } {
  const top = topPositive(values.flat());
  const rawLo = min === undefined ? 0 : toNumber(min, 0);
  const rawHi = max === undefined ? top : toNumber(max, top);
  const lo = Number.isFinite(rawLo) ? rawLo : 0;
  let hi = Number.isFinite(rawHi) ? rawHi : top;
  if (!(hi > lo)) hi = lo + 1;
  return { lo, hi };
}

/** Opacidad de celda con dominio explícito min → max. */
export function matrixCellOpacityWithDomain(
  isMissing: boolean,
  v: number,
  lo: number,
  hi: number,
): number {
  if (isMissing) return EMPTY_CELL_OPACITY;
  if (!(hi > lo)) return CELL_BASE_OPACITY;
  const t = Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
  return CELL_BASE_OPACITY + CELL_RANGE_OPACITY * t;
}

/** Opacidades de la leyenda min → max. */
export const MATRIX_LEGEND_OPACITIES = [0.15, 0.3625, 0.575, 0.7875, 1];

/** Color de relleno (verbatim de la vista). */
export function resolveMatrixFill(color: string | undefined): string {
  return seriesColor(0, color);
}

/** Visibilidad del texto de valor en celda (verbatim de la vista). */
export function shouldShowMatrixValue(
  showValues: "auto" | "always" | "never",
  cell: number,
): boolean {
  return (
    showValues === "always" ||
    (showValues === "auto" && cell >= MATRIX_VALUE_MIN_CELL)
  );
}
