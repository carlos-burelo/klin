/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { DEFAULT_LOCALE } from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  BAR_HEIGHT_CLASS,
  measureProgressRow,
  resolveProgressBarColor,
  resolveProgressFill,
  sortProgressRows,
} from "./progress-list.compute";
import type { ProgressListProps } from "./progress-list.types";

export type { ProgressMeasure } from "./progress-list.compute";
export {
  BAR_HEIGHT_CLASS,
  measureProgressRow,
  resolveProgressBarColor,
  resolveProgressFill,
  STATUS_FILL,
  sortProgressRows,
} from "./progress-list.compute";
export type {
  ProgressListProps,
  ProgressRow,
  ProgressSortBy,
  ProgressStatus,
} from "./progress-list.types";

/**
 * Lista de medidores lineales SSR (label + pista + valor tabular).
 */
export function ProgressList({
  rows,
  ariaLabel,
  barHeight = "md",
  showPercent = true,
  status,
  sortBy = "none",
  locale = DEFAULT_LOCALE,
  format,
  color,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ProgressListProps) {
  if (isBlank(rows)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fmt = resolveFormatter(format, locale);
  const fill = resolveProgressFill(color);
  const ordered = sortProgressRows(rows, sortBy);

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
      {ordered.map((row, ri) => {
        const { value, total, pct, rounded } = measureProgressRow(row);
        const barColor = resolveProgressBarColor(pct, status, fill);
        const tip =
          total === null
            ? `${row.label}: ${fmt(value)}` +
              (row.detail ? ` (${row.detail})` : "")
            : `${row.label}: ${fmt(value)} de ${fmt(total)}` +
              (row.detail ? ` (${row.detail})` : "");
        return (
          <div key={stableKey([row.label], ri)} data-chart-tip={tip}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span
                className="truncate text-xs text-muted-foreground"
                data-chart-tip={
                  row.detail ? `${row.label} · ${row.detail}` : row.label
                }
              >
                {row.label}
              </span>
              <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums">
                {showPercent && rounded !== null
                  ? `${fmt(value)} · ${rounded}%`
                  : fmt(value)}
              </span>
            </div>
            <div
              className={`${BAR_HEIGHT_CLASS[barHeight]} w-full overflow-hidden rounded-full bg-muted`}
              role="presentation"
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${pct ?? 0}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
