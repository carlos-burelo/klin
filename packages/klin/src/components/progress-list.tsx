/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor } from "../lib/palette";
import { CHART_TOKEN, DEFAULT_LOCALE, PERCENT_FACTOR } from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Fila de progreso (etiqueta, valor, total y detalle opcionales). */
export type ProgressRow = {
  label: string;
  value: number;
  total?: number;
  detail?: string;
};

/** Estado de umbral de una fila (pct de 0 a 100). */
export type ProgressStatus = "ok" | "warn" | "bad";

/** Grosor de la barra. */
const BAR_HEIGHT_CLASS = {
  sm: "h-1",
  md: "h-2",
} as const;

/** Color de la barra por estado de umbral (tokens del tema). */
const STATUS_FILL: Record<ProgressStatus, string> = {
  ok: CHART_TOKEN.chart2,
  warn: CHART_TOKEN.chart4,
  bad: CHART_TOKEN.destructive,
};

/** Props de la lista de medidores lineales SSR. */
export type ProgressListProps = {
  rows: ProgressRow[];
  ariaLabel: string;
  /**
   * Grosor de la barra.
   * @default "md"
   */
  barHeight?: "sm" | "md";
  /**
   * Muestra el % junto al valor.
   * @default true
   */
  showPercent?: boolean;
  /**
   * Color de la barra por umbral (recibe el pct de 0 a 100).
   * Por defecto, el color de serie.
   * @default undefined
   */
  status?: (pct: number) => ProgressStatus;
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
  barHeight = "md",
  showPercent = true,
  status,
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
        const rounded = Math.round(pct);
        const barColor = status ? (STATUS_FILL[status(pct)] ?? fill) : fill;
        const tip =
          `${row.label}: ${fmt(value)} de ${fmt(toNumber(row.total ?? row.value))}` +
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
                {showPercent ? `${fmt(value)} · ${rounded}%` : fmt(value)}
              </span>
            </div>
            <div
              className={`${BAR_HEIGHT_CLASS[barHeight]} w-full overflow-hidden rounded-full bg-muted`}
              role="presentation"
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
