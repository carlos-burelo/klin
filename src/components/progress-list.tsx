/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor } from "../lib/palette";
import { PERCENT_FACTOR } from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Fila de progreso (etiqueta, valor, total y detalle opcionales). */
export type ProgressRow = {
  label: string;
  value: number;
  total?: number;
  detail?: string;
};

/** Props de la lista de medidores lineales SSR. */
export type ProgressListProps = {
  rows: ProgressRow[];
  ariaLabel: string;
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Lista de medidores lineales SSR (label + pista + valor tabular).
 */
export function ProgressList({
  rows,
  ariaLabel,
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
  color,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ProgressListProps) {
  if (rows.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fill = seriesColor(0, color);

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
      {rows.map((row, ri) => {
        const value = toNumber(row.value);
        const total = Math.max(toNumber(row.total ?? row.value), 1);
        const pct = Math.min(
          PERCENT_FACTOR,
          Math.max(0, (value / total) * PERCENT_FACTOR),
        );
        const tip =
          `${row.label}: ${format(value)} de ${format(toNumber(row.total ?? row.value))}` +
          (row.detail ? ` (${row.detail})` : "");
        return (
          <div
            key={stableKey([row.label], ri)}
            title={tip}
            data-chart-tip={tip}
          >
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span
                className="truncate text-xs text-muted-foreground"
                title={row.detail ? `${row.label} · ${row.detail}` : row.label}
              >
                {row.label}
              </span>
              <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums">
                {format(value)}
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
              role="presentation"
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: fill }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
