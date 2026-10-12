/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { type CSSProperties, useId } from "react";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor } from "../lib/palette";
import { CHART_TOKEN, PERCENT_FACTOR } from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Segmento apilado (clave, etiqueta y color opcional). */
export type StackSegment = {
  key: string;
  label: string;
  color?: string;
};

/** Fila apilada (etiqueta, detalle y valores por segmento). */
export type StackRow = {
  label: string;
  detail?: string;
  values: Record<string, number>;
};

/** Props de barras apiladas SSR (progreso y comparativas). */
export type StackedBarProps = {
  rows: StackRow[];
  segments: StackSegment[];
  ariaLabel: string;
  format?: ValueFormatter;
  /** Clave del segmento para el % (por defecto, el primero). */
  percentOf?: string;
  locale?: string;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const TRACK_W = 600;
const TRACK_H = 24;
/** Radio de la pista (pastilla). */
const TRACK_RADIUS = TRACK_H / 2;

/**
 * Barras horizontales apiladas SSR (progreso y comparativas).
 * Render HTML+SVG: etiqueta truncada + pista flexible + % tabular.
 * Puntas redondeadas vía clip (funciona con N segmentos).
 */
export function StackedBar({
  rows,
  segments,
  ariaLabel,
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
  percentOf,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: StackedBarProps) {
  // useId arriba: hooks siempre en mismo orden (antes del early return).
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  if (rows.length === 0 || segments.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const mainKey = percentOf ?? segments[0]?.key ?? "";
  const colors = segments.map((s, i) => seriesColor(i, s.color));
  const totalOf = (values: Record<string, number>) =>
    segments.reduce((acc, s) => acc + toNumber(values[s.key]), 0);
  const maxTotal = Math.max(1, ...rows.map((r) => totalOf(r.values)));

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={className}
      style={style}
    >
      <title>{ariaLabel}</title>
      <div className="flex flex-col gap-2.5">
        {rows.map((row, ri) => {
          const total = totalOf(row.values);
          const main = toNumber(row.values[mainKey]);
          const percent =
            total === 0 ? 0 : Math.round((main / total) * PERCENT_FACTOR);
          let offset = 0;
          const clipId = `${uid}-st-${ri}`;
          return (
            <div
              key={stableKey([row.label], ri)}
              className="flex items-center gap-2"
            >
              <span
                className="w-36 shrink-0 truncate text-xs text-muted-foreground"
                title={row.detail ? `${row.label} · ${row.detail}` : row.label}
              >
                {row.label}
              </span>
              <svg
                viewBox={`0 0 ${TRACK_W} ${TRACK_H}`}
                className="h-6 min-w-0 flex-1"
                aria-hidden="true"
              >
                <defs>
                  <clipPath id={clipId}>
                    <rect width={TRACK_W} height={TRACK_H} rx={TRACK_RADIUS} />
                  </clipPath>
                </defs>
                <rect
                  width={TRACK_W}
                  height={TRACK_H}
                  rx={TRACK_RADIUS}
                  fill={CHART_TOKEN.track}
                />
                <g clipPath={`url(#${clipId})`}>
                  {segments.map((seg, si) => {
                    const value = toNumber(row.values[seg.key]);
                    const w = (value / maxTotal) * TRACK_W;
                    const x = offset;
                    offset += w;
                    if (w <= 0) return null;
                    const pct =
                      total === 0
                        ? 0
                        : Math.round((value / total) * PERCENT_FACTOR);
                    const tip =
                      `${row.label} · ${seg.label}: ${format(value)} (${pct}% del total)` +
                      (row.detail ? ` (${row.detail})` : "");
                    return (
                      <g key={stableKey([seg.key], si)}>
                        <title>{tip}</title>
                        <rect
                          x={x}
                          y={0}
                          width={w}
                          height={TRACK_H}
                          fill={colors[si] ?? CHART_TOKEN.chart1}
                          data-chart-tip={tip}
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>
              <span className="w-10 shrink-0 text-right font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
      {showLegend ? (
        <ChartLegend
          items={segments.map((s, i) => ({
            label: s.label,
            color: colors[i] ?? CHART_TOKEN.chart1,
          }))}
        />
      ) : null}
    </div>
  );
}
