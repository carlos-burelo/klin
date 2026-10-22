/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { toNumber } from "../core/number";
import { BAR_RADIUS, PERCENT_FACTOR } from "../core/theme";
import type { WafflePart } from "./waffle-chart.types";

/** Columnas de la retícula 10×10 (100 celdas = 100 %). */
export const WAFFLE_COLS = 10;
/** Separación entre celdas en px. */
export const WAFFLE_GAP = 3;

/** Parte saneada (negativos a 0, verbatim de la vista). */
export type WaffleCleanPart = WafflePart & { value: number };

/** Celda asignada a una parte (verbatim de la vista). */
export type WaffleCell = { part: number };

/** Retícula del waffle (verbatim de la vista). */
export type WaffleGrid = {
  cols: number;
  rows: number;
  sep: number;
  radius: number;
  cell: number;
};

/** Saneado de partes (verbatim de la vista). */
export function cleanWaffleParts(parts: WafflePart[]): WaffleCleanPart[] {
  return parts.map((p) => ({
    ...p,
    value: Math.max(0, toNumber(p.value)),
  }));
}

/** Total de partes saneadas (verbatim de la vista). */
export function totalWaffleValue(clean: WaffleCleanPart[]): number {
  return clean.reduce((a, p) => a + p.value, 0);
}

/** Retícula: columnas/filas/separación/radio/tamaño de celda (verbatim). */
export function computeWaffleGrid(
  size: number,
  columns: number | undefined,
  gap: number | undefined,
  cellRadius: number | undefined,
): WaffleGrid {
  const cols = Math.max(1, Math.floor(toNumber(columns, WAFFLE_COLS)));
  const rows = Math.max(1, Math.ceil(PERCENT_FACTOR / cols));
  const sep = Math.max(0, toNumber(gap, WAFFLE_GAP));
  const radius = Math.max(0, toNumber(cellRadius ?? BAR_RADIUS, BAR_RADIUS));
  const cell = Math.min(
    (size - sep * (cols - 1)) / cols,
    (size - sep * (rows - 1)) / rows,
  );
  return { cols, rows, sep, radius, cell };
}

/** Celdas por parte con redondeo de resto mayor (verbatim de la vista). */
export function computeWaffleCells(
  clean: WaffleCleanPart[],
  total: number,
): WaffleCell[] {
  // Celdas por parte (redondeo con resto mayor).
  const raw = clean.map((p) => (p.value / total) * PERCENT_FACTOR);
  const base = raw.map(Math.floor);
  let rest = PERCENT_FACTOR - base.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (const o of order) {
    if (rest <= 0) break;
    base[o.i] = (base[o.i] ?? 0) + 1;
    rest--;
  }

  const cells: WaffleCell[] = [];
  base.forEach((n, pi) => {
    for (let k = 0; k < (n ?? 0); k++) cells.push({ part: pi });
  });
  return cells;
}

/** Celdas sobrantes de la retícula (huecos sin parte asignada). */
export function computeWaffleEmptyCells(
  cols: number,
  rows: number,
  filled: number,
): number[] {
  const slots = Math.max(0, cols * rows - filled);
  return Array.from({ length: slots }, (_, k) => filled + k);
}
