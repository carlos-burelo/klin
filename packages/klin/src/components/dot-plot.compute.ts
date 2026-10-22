/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { GRID_TICKS, POINT_RADIUS_SCATTER } from "../core/theme";

export const DOT_SORT_NONE = "none";

export const DOT_W = 640;
export const DOT_MARGIN = {
  top: 12,
  right: 48,
  bottom: 32,
  left: 132,
};
export const DOT_BAND_PADDING = 0.35;
export const DOT_LABEL_MAX = 20;
export const DOT_STEM_OPACITY = 0.5;
export const DOT_VALUE_GAP = 6;
export const DOT_AXIS_LABEL_OFFSET = 10;

export type DotRow = {
  label: string;
  value: number;
  datum: Record<string, string | number>;
};

export type DotSortMode = "none" | "asc" | "desc";

/** Ticks sanitizados (piso + fallback a GRID_TICKS). */
export function resolveDotTicks(gridTicks: number): number {
  const rawTicks = Math.floor(toNumber(gridTicks, GRID_TICKS));
  return Number.isFinite(rawTicks) && rawTicks > 0 ? rawTicks : GRID_TICKS;
}

/** Tope de filas sanitizado (piso + fallback a DEFAULT_MAX_ROWS). */
export function resolveDotMax(maxItems: number): number {
  const rawMax = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  return Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
}

/** Radio de punto sanitizado (piso 0; `POINT_RADIUS_SCATTER` por defecto). */
export function resolveDotRadius(pointRadius: unknown): number {
  return Math.max(0, toNumber(pointRadius, POINT_RADIUS_SCATTER));
}

/** Dominio X con overrides fijos (sin overrides = [lo, hi] verbatim). */
export function resolveDotDomain(
  lo: number,
  hi: number,
  xMin: number | undefined,
  xMax: number | undefined,
): { lo: number; hi: number } {
  if (xMin === undefined && xMax === undefined) return { lo, hi };
  const fixedLo = xMin === undefined ? Number.NaN : toNumber(xMin, Number.NaN);
  const fixedHi = xMax === undefined ? Number.NaN : toNumber(xMax, Number.NaN);
  const blo = Number.isFinite(fixedLo) ? fixedLo : lo;
  const rawHi = Number.isFinite(fixedHi) ? fixedHi : hi;
  return { lo: blo, hi: rawHi <= blo ? blo + 1 : rawHi };
}

/** Modo de orden válido (`none` por defecto). */
export function normalizeDotSort(sortBy: string): DotSortMode {
  return sortBy === "asc" || sortBy === "desc" ? sortBy : DOT_SORT_NONE;
}

/** Filas limpias (filtra no-finitos, tope, orden). */
export function buildDotRows(
  data: Array<Record<string, string | number>>,
  categoryKey: string,
  valueKey: string,
  sortBy: string,
  maxItems: number,
): DotRow[] {
  const safeMax = resolveDotMax(maxItems);
  const sortMode = normalizeDotSort(sortBy);
  const computed: DotRow[] = [];
  for (const d of data.slice(0, safeMax)) {
    const value = toNumber(d[valueKey], Number.NaN);
    if (!Number.isFinite(value)) continue;
    computed.push({ label: String(d[categoryKey] ?? ""), value, datum: d });
  }
  if (sortMode !== DOT_SORT_NONE) {
    computed.sort((a, b) =>
      sortMode === "asc" ? a.value - b.value : b.value - a.value,
    );
  }
  return computed;
}
