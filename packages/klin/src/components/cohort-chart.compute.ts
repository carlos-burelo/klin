/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import type { ValueFormatter } from "../core/format";
import { formatDefault } from "../core/format";
import { isBlank } from "../core/guards";
import { toNumber } from "../core/number";
import { EMPTY_CELL_OPACITY } from "../core/theme";
import type { Cohort } from "./cohort-chart.types";

export const W = 640;
export const LABEL_W = 132;
export const LABEL_H = 30;
export const MAX_CELL = 64;
/** Celda mínima (px) para pintar valor en modo `auto`. */
export const COHORT_VALUE_MIN_CELL = 28;
/** Separación entre celdas, aire lateral y relleno inferior. */
export const CELL_GAP = 4;
export const GRID_SIDE_PAD = 16;
export const GRID_BOTTOM_PAD = 8;
/** Máximos de truncado de periodo y cohorte. */
export const LABEL_MAX_COL = 10;
export const LABEL_MAX_ROW = 18;
/** Opacidades de celda con retención (base + rango). */
export const CELL_BASE_OPACITY = 0.15;
export const CELL_RANGE_OPACITY = 0.85;
/** Centena para el % por defecto. */
export const PERCENT_OF_ONE = 100;
/** Marca de celda sin dato (fuera del rango válido 0–1). */
export const MISSING_RATE = -1;

/** Filas no vacías (verbatim de la vista). */
export function resolveCohortRows(cohorts: Cohort[]): Cohort[] {
  return cohorts.filter((c) => !isBlank(c.values));
}

/** Nº de periodos ≥ 1 (verbatim de la vista). */
export function computeCohortPeriods(rows: Cohort[]): number {
  return Math.max(1, ...rows.map((c) => c.values.length));
}

/** Etiquetas de periodo (`P1`, `P2`… por defecto; verbatim de la vista). */
export function resolveCohortLabels(
  periodLabels: string[] | undefined,
  periods: number,
): string[] {
  return periodLabels && periodLabels.length > 0
    ? periodLabels
    : Array.from({ length: periods }, (_, i) => `P${i + 1}`);
}

/** Formato de retención 0–1 (verbatim de la vista). */
export function resolveCohortFormat(
  format: ValueFormatter | undefined,
  locale: string,
): ValueFormatter {
  return (
    format ??
    ((v: number) =>
      `${formatDefault(v * PERCENT_OF_ONE, locale, { maximumFractionDigits: 0 })}%`)
  );
}

/** Parrilla de celdas centrada en lienzo fijo (verbatim de la vista). */
export function computeCohortGrid(
  periods: number,
  rowCount: number,
): { cell: number; step: number; gridW: number; gx: number; H: number } {
  const cell = Math.min(
    MAX_CELL,
    Math.floor((W - LABEL_W - GRID_SIDE_PAD) / periods) - CELL_GAP,
  );
  const step = cell + CELL_GAP;
  const gridW = periods * step - CELL_GAP;
  const gx = LABEL_W + Math.max(0, (W - LABEL_W - gridW) / 2);
  const H = LABEL_H + rowCount * step - CELL_GAP + GRID_BOTTOM_PAD;
  return { cell, step, gridW, gx, H };
}

/** Base de la fila: primer valor positivo o 0 (verbatim de la vista). */
export function cohortBase(cohort: Cohort): number {
  const first = toNumber(cohort.values[0], Number.NaN);
  return Number.isFinite(first) && first > 0 ? first : 0;
}

/** Tasa de retención o MISSING_RATE (verbatim de la vista). */
export function cohortRate(base: number, raw: number): number {
  const v = toNumber(raw, Number.NaN);
  return base > 0 && Number.isFinite(v) && v >= 0 ? v / base : MISSING_RATE;
}

/** Opacidad de celda con retención (verbatim de la vista). */
export function cohortCellOpacity(missing: boolean, rate: number): number {
  return missing || rate <= 0
    ? EMPTY_CELL_OPACITY
    : CELL_BASE_OPACITY + CELL_RANGE_OPACITY * Math.min(1, rate);
}

/** Color de relleno (verbatim de la vista). */
export function resolveCohortFill(color: string | undefined): string {
  return seriesColor(0, color);
}

/** Visibilidad del texto de valor en celda (verbatim de la vista). */
export function shouldShowCohortValue(
  showValues: "auto" | "always" | "never",
  cell: number,
): boolean {
  return (
    showValues === "always" ||
    (showValues === "auto" && cell >= COHORT_VALUE_MIN_CELL)
  );
}
