/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { DEFAULT_LOCALE } from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  computeTableLayout,
  MAX_TABLE_ROWS,
  TABLE_BAR_HEIGHT,
  TABLE_STATUS_COLOR,
} from "./table-chart.compute";
import type { TableChartProps } from "./table-chart.types";

export {
  computeTableLayout,
  MAX_TABLE_COLUMNS,
  MAX_TABLE_ROWS,
} from "./table-chart.compute";
export type {
  TableBar,
  TableCellLayout,
  TableChartProps,
  TableColumn,
  TableLayout,
  TableRow,
  TableRowLayout,
  TableSortBy,
} from "./table-chart.types";

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
  sortBy,
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
  const layout = computeTableLayout(
    rows,
    columns,
    bars,
    locale,
    fmt,
    maxRows,
    sortBy,
  );
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
              data-chart-tip={row.label}
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
