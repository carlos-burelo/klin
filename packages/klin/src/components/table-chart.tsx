/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { clamp01, toNumber } from "../lib/number";
import { seriesColor, type ValueFormatter } from "../lib/palette";
import { CHART_TOKEN, DEFAULT_LOCALE, PERCENT_FACTOR } from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Columna numérica de la tabla (clave + etiqueta + alineación). */
export type TableColumn = {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
};

/** Fila de la tabla (etiqueta + valores por clave de columna). */
export type TableRow = {
  label: string;
  values: Record<string, number>;
};

/** Barra inline por columna (clave + etiqueta de tip + máximo explícito). */
export type TableBar = {
  key: string;
  label?: string;
  max?: number;
};

/** Props de la tabla-chart (HTML puro, sin SVG). */
export type TableChartProps = {
  columns: TableColumn[];
  rows: TableRow[];
  bars?: TableBar[];
  ariaLabel: string;
  format?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  /**
   * Altura de la barra inline.
   * @default "md"
   */
  barHeight?: "sm" | "md";
  /**
   * Muestra el % junto al valor.
   * @default true
   */
  showPercent?: boolean;
  /**
   * Color de barra por umbral de % (si no, color de serie).
   * @default undefined
   */
  status?: (pct: number) => "ok" | "warn" | "bad";
  /**
   * Densidad de filas.
   * @default "comfortable"
   */
  density?: "comfortable" | "compact";
  /**
   * Tope de filas (SSR acotado).
   * @default MAX_TABLE_ROWS
   */
  maxRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

/** Caps SSR (filas y columnas). */
export const MAX_TABLE_ROWS = DEFAULT_MAX_ROWS;
export const MAX_TABLE_COLUMNS = 12;

/** Altura de barra inline. */
const TABLE_BAR_HEIGHT = { sm: "h-1.5", md: "h-2" } as const;
/** Color por estado de avance (token). */
const TABLE_STATUS_COLOR = {
  ok: CHART_TOKEN.chart1,
  warn: CHART_TOKEN.chart3,
  bad: CHART_TOKEN.destructive,
} as const;

export type TableCellLayout = {
  key: string;
  label: string;
  align: "left" | "center" | "right";
  value: number;
  bar: { pct: number; tip: string; color: string } | null;
};

export type TableRowLayout = {
  label: string;
  cells: TableCellLayout[];
};

export type TableLayout = {
  columns: TableColumn[];
  rows: TableRowLayout[];
};

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
): TableLayout {
  const fmt = resolveFormatter(format, locale);
  const cappedCols = columns.slice(0, MAX_TABLE_COLUMNS);
  const rawMax = Math.floor(toNumber(maxRows, MAX_TABLE_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : MAX_TABLE_ROWS;
  const cappedRows = rows.slice(0, safeMax);
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

/**
 * Tabla-chart SSR (filas + celdas tabulares + barra inline por columna).
 * HTML puro, sin SVG.
 */
export function TableChart({
  columns,
  rows,
  bars = [],
  ariaLabel,
  format,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  barHeight = "md",
  showPercent = true,
  status,
  density = "comfortable",
  maxRows = MAX_TABLE_ROWS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: TableChartProps) {
  if (isBlank(columns) || isBlank(rows)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);
  const layout = computeTableLayout(rows, columns, bars, locale, fmt, maxRows);
  const gridTemplateColumns = `minmax(0,1.1fr) repeat(${layout.columns.length}, minmax(0,1fr))`;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={
        className ? `flex flex-col gap-3 ${className}` : "flex flex-col gap-3"
      }
      style={style}
    >
      <title>{ariaLabel}</title>
      <div
        className={
          density === "compact" ? "flex flex-col gap-1" : "flex flex-col gap-2"
        }
      >
        <div
          className="grid items-baseline gap-2"
          style={{ gridTemplateColumns }}
        >
          <span />
          {layout.columns.map((col, ci) => (
            <span
              key={stableKey([col.key], ci)}
              className="truncate text-[11px] text-muted-foreground"
              style={{ textAlign: col.align ?? "right" }}
            >
              {col.label}
            </span>
          ))}
        </div>
        {layout.rows.map((row, ri) => (
          <div
            key={stableKey([row.label], ri)}
            className="grid items-center gap-2"
            style={{ gridTemplateColumns }}
          >
            <span
              className="truncate text-xs text-muted-foreground"
              title={row.label}
            >
              {row.label}
            </span>
            {row.cells.map((cell, ci) => (
              <div
                key={stableKey([row.label, cell.key], ci)}
                style={{ textAlign: cell.align }}
              >
                <span className="font-mono text-[11px] font-medium tabular-nums">
                  {fmt(cell.value)}
                </span>
                {showPercent && cell.bar ? (
                  <span className="ml-1 font-mono text-[11px] tabular-nums text-muted-foreground">
                    {cell.bar.pct}%
                  </span>
                ) : null}
                {cell.bar ? (
                  <div
                    className={`mt-1 w-full overflow-hidden rounded-full bg-muted ${TABLE_BAR_HEIGHT[barHeight]}`}
                    role="presentation"
                    title={cell.bar.tip}
                    data-chart-tip={cell.bar.tip}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cell.bar.pct}%`,
                        backgroundColor: status
                          ? TABLE_STATUS_COLOR[status(cell.bar.pct)]
                          : cell.bar.color,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
