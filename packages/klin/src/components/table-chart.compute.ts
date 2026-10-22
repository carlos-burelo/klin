/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import type { ValueFormatter } from "../core/format";
import { resolveFormatter } from "../core/format";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { clamp01, toNumber } from "../core/number";
import { CHART_TOKEN, DEFAULT_LOCALE, PERCENT_FACTOR } from "../core/theme";
import type {
  TableBar,
  TableColumn,
  TableLayout,
  TableRow,
  TableSortBy,
} from "./table-chart.types";

/** Comparador de filas por columna o etiqueta (dir por defecto asc). */
export function compareTableRows(
  sortBy: TableSortBy,
): (a: TableRow, b: TableRow) => number {
  const desc = sortBy.dir === "desc";
  const sign = desc ? -1 : 1;
  if (sortBy.key === "label") {
    return (a, b) => sign * a.label.localeCompare(b.label);
  }
  return (a, b) =>
    sign *
    (toNumber(a.values[sortBy.key], 0) - toNumber(b.values[sortBy.key], 0));
}

/** Caps SSR (filas y columnas). */
export const MAX_TABLE_ROWS = DEFAULT_MAX_ROWS;
export const MAX_TABLE_COLUMNS = 12;

/** Altura de barra inline. */
export const TABLE_BAR_HEIGHT = { sm: "h-1.5", md: "h-2" } as const;
/** Color por estado de avance (token). */
export const TABLE_STATUS_COLOR = {
  ok: CHART_TOKEN.chart1,
  warn: CHART_TOKEN.chart3,
  bad: CHART_TOKEN.destructive,
} as const;

/**
 * Cómputo puro de la tabla-chart (trunca determinista + máximos por
 * columna + porcientos de barra; testable, sin JSX).
 */
export function computeTableLayout(
  rows: TableRow[],
  columns: TableColumn[],
  bars: TableBar[] = [],
  locale = DEFAULT_LOCALE,
  format?: ValueFormatter,
  maxRows = MAX_TABLE_ROWS,
  sortBy?: TableSortBy,
): TableLayout {
  const fmt = resolveFormatter(format, locale);
  const cappedCols = columns.slice(0, MAX_TABLE_COLUMNS);
  const rawMax = Math.floor(toNumber(maxRows, MAX_TABLE_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : MAX_TABLE_ROWS;
  const sorted = sortBy ? [...rows].sort(compareTableRows(sortBy)) : rows;
  const cappedRows = sorted.slice(0, safeMax);
  const known = new Set(cappedCols.map((c) => c.key));
  const barByKey = new Map(
    bars.filter((b) => known.has(b.key)).map((b) => [b.key, b]),
  );
  const maxima = new Map<string, number>();
  for (const col of cappedCols) {
    const explicit = barByKey.get(col.key)?.max;
    if (explicit === undefined) {
      let m = 0;
      for (const row of cappedRows) {
        const v = toNumber(row.values[col.key], 0);
        if (v > m) m = v;
      }
      maxima.set(col.key, m);
    } else {
      maxima.set(col.key, Math.max(0, toNumber(explicit)));
    }
  }

  return {
    columns: cappedCols,
    rows: cappedRows.map((row) => ({
      label: row.label,
      cells: cappedCols.map((col, ci) => {
        const value = toNumber(row.values[col.key], 0);
        const bar = barByKey.get(col.key);
        if (!bar) {
          return {
            key: col.key,
            label: col.label,
            align: col.align ?? "right",
            value,
            bar: null,
          };
        }
        const max = maxima.get(col.key) ?? 0;
        const pct =
          max > 0 ? Math.round(clamp01(value / max) * PERCENT_FACTOR) : 0;
        return {
          key: col.key,
          label: col.label,
          align: col.align ?? "right",
          value,
          bar: {
            pct,
            tip: `${row.label} · ${bar.label ?? col.label}: ${fmt(value)} (${pct}% del máximo)`,
            color: seriesColor(ci),
          },
        };
      }),
    })),
  };
}
