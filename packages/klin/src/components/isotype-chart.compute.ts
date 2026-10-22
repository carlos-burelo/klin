/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import type { IsotypeChartProps, IsotypeDatum } from "./isotype-chart.types";

export const ISOTYPE_SORT_NONE = "none";

export const ISOTYPE_W = 640;
export const ISOTYPE_MARGIN = {
  top: 12,
  right: 16,
  bottom: 16,
  left: 16,
} as const;
/** Radio fijo del pictograma + paso de retícula + tope por fila. */
export const ISOTYPE_R = 7;
export const ISOTYPE_GAP = 4;
export const ISOTYPE_MAX_PER_ROW = 10;
/** Tope total de pictogramas (SSR acotado). */
export const MAX_ISOTYPE = 200;
/** Columna izquierda (etiqueta + conteo) y ritmo vertical. */
export const ISOTYPE_LABEL_W = 180;
export const ISOTYPE_LABEL_MAX = 22;
export const ISOTYPE_LABEL_DY = 2;
export const ISOTYPE_COUNT_DY = 15;
export const ISOTYPE_ROW_GAP = 12;
export const ISOTYPE_CELL = ISOTYPE_R * 2 + ISOTYPE_GAP;

export type IsotypeRow = {
  label: string;
  value: number;
  count: number;
  color: string;
};

/**
 * Filas del isotipo (orden, tope y presupuesto de pictogramas) +
 * pictogramas por fila ajustados al ancho disponible.
 */
export function computeIsotypeRows(
  series: IsotypeDatum[],
  unit: number,
  maxPerRow: number,
  sortBy: IsotypeChartProps["sortBy"],
  maxItems: number,
): { rows: IsotypeRow[]; perRow: number } {
  const sortMode =
    sortBy === "asc" || sortBy === "desc" ? sortBy : ISOTYPE_SORT_NONE;
  const rawMax = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
  const ordered = series.slice(0, safeMax);
  if (sortMode !== ISOTYPE_SORT_NONE) {
    ordered.sort((a, b) =>
      sortMode === "asc"
        ? toNumber(a.value) - toNumber(b.value)
        : toNumber(b.value) - toNumber(a.value),
    );
  }
  const perUnit = toNumber(unit, Number.NaN);
  const wanted = Math.floor(toNumber(maxPerRow, ISOTYPE_MAX_PER_ROW));
  const perRowWanted =
    Number.isFinite(wanted) && wanted > 0 ? wanted : ISOTYPE_MAX_PER_ROW;
  const fit = Math.max(
    1,
    Math.floor(
      (ISOTYPE_W -
        ISOTYPE_MARGIN.left -
        ISOTYPE_MARGIN.right -
        ISOTYPE_LABEL_W) /
        ISOTYPE_CELL,
    ),
  );
  const perRow = Math.min(perRowWanted, fit);

  const rows: IsotypeRow[] = [];
  if (perUnit > 0) {
    let budget = MAX_ISOTYPE;
    for (const s of ordered) {
      if (budget <= 0) break;
      const value = toNumber(s.value, Number.NaN);
      if (!Number.isFinite(value) || value <= 0) continue;
      const take = Math.min(Math.max(1, Math.round(value / perUnit)), budget);
      budget -= take;
      rows.push({
        label: s.label,
        value,
        count: take,
        color: seriesColor(rows.length, s.color),
      });
    }
  }
  return { rows, perRow };
}

/** Líneas que ocupa una fila de `count` pictogramas con `perRow` por línea. */
export function isotypeLinesOf(count: number, perRow: number): number {
  return Math.max(1, Math.ceil(count / perRow));
}

/** Desplazamientos verticales por fila + alto total del gráfico. */
export function computeIsotypeOffsets(
  rows: IsotypeRow[],
  perRow: number,
  height: number,
): { offsets: number[]; chartH: number } {
  const offsets: number[] = [];
  let cursor = ISOTYPE_MARGIN.top;
  for (const r of rows) {
    offsets.push(cursor);
    cursor += isotypeLinesOf(r.count, perRow) * ISOTYPE_CELL + ISOTYPE_ROW_GAP;
  }
  const chartH = Math.max(
    height,
    cursor - ISOTYPE_ROW_GAP + ISOTYPE_MARGIN.bottom,
  );
  return { offsets, chartH };
}
