/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { toNumber } from "../core/number";
import { CHART_TOKEN, PERCENT_FACTOR } from "../core/theme";
import type { ProgressRow, ProgressStatus } from "./progress-list.types";

/** Grosor de la barra. */
export const BAR_HEIGHT_CLASS = {
  sm: "h-1",
  md: "h-2",
} as const;

/** Color de la barra por estado de umbral (tokens del tema). */
export const STATUS_FILL: Record<ProgressStatus, string> = {
  ok: CHART_TOKEN.chart2,
  warn: CHART_TOKEN.chart4,
  bad: CHART_TOKEN.destructive,
};

/** Medida de una fila (valor y total/pct opcionales: sin total no hay %). */
export type ProgressMeasure = {
  value: number;
  total: number | null;
  pct: number | null;
  rounded: number | null;
};

/** Mide una fila: sin total, pct nulo (nunca 100% falso); con total, pct 0–100. */
export function measureProgressRow(row: ProgressRow): ProgressMeasure {
  const value = toNumber(row.value);
  if (row.total === undefined) {
    return { value, total: null, pct: null, rounded: null };
  }
  const total = Math.max(toNumber(row.total), 1);
  const pct = Math.min(
    PERCENT_FACTOR,
    Math.max(0, (value / total) * PERCENT_FACTOR),
  );
  const rounded = Math.round(pct);
  return { value, total, pct, rounded };
}

/** Color base de la barra (verbatim de la vista). */
export function resolveProgressFill(color: string | undefined): string {
  return seriesColor(0, color);
}

/** Color de barra por umbral o base (verbatim de la vista). */
export function resolveProgressBarColor(
  pct: number | null,
  status: ((pct: number) => ProgressStatus) | undefined,
  fill: string,
): string {
  return pct !== null && status ? (STATUS_FILL[status(pct)] ?? fill) : fill;
}

/** Ordena filas de progreso (none/indefinido → entrada). */
export function sortProgressRows(
  rows: ProgressRow[],
  sortBy: "label" | "value" | "none" | undefined,
): ProgressRow[] {
  if (sortBy === "label") {
    return [...rows].sort((a, b) => a.label.localeCompare(b.label));
  }
  if (sortBy === "value") {
    return [...rows].sort((a, b) => toNumber(b.value) - toNumber(a.value));
  }
  return rows;
}
