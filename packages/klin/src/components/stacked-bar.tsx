/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { useId } from "react";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";

import { CHART_TOKEN, DEFAULT_LOCALE, PERCENT_FACTOR } from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  mainSegmentKey,
  maxStackedTotal,
  resolveStackedBarHeight,
  resolveStackedOuterStyle,
  segmentColors,
  stackedRowDenom,
  stackedRowShare,
  TRACK_W,
} from "./stacked-bar.compute";
import type { StackedBarProps } from "./stacked-bar.types";

export type {
  StackedBarProps,
  StackRow,
  StackSegment,
} from "./stacked-bar.types";

/**
 * Barras horizontales apiladas SSR (progreso y comparativas).
 * Render HTML+SVG: etiqueta truncada + pista flexible + % tabular.
 * Puntas redondeadas vía clip (funciona con N segmentos).
 */
export function StackedBar({
  rows,
  segments,
  ariaLabel,
  locale = DEFAULT_LOCALE,
  format,
  formatValues,
  percentOf,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  scale = "global",
  showPercent = true,
  showValues = false,
  barHeight,
  height,
  id,
}: StackedBarProps) {
  // useId arriba: hooks siempre en mismo orden (antes del early return).
  const autoUid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  if (isBlank(rows) || isBlank(segments)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const uid =
    id == null || id === "" ? autoUid : id.replace(/[^a-zA-Z0-9_-]/g, "");
  const { barH, barRadius, defaultH } = resolveStackedBarHeight(barHeight);
  const mainKey = mainSegmentKey(segments, percentOf);
  const colors = segmentColors(segments);
  const fmt = resolveFormatter(format, locale);
  const fmtV = formatValues ? resolveFormatter(formatValues, locale) : fmt;
  const maxTotal = maxStackedTotal(rows, segments);
  const outerStyle = resolveStackedOuterStyle(style, height);

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={className}
      style={outerStyle}
    >
      <div className="flex flex-col gap-2.5">
        {rows.map((row, ri) => {
          const { total, percent } = stackedRowShare(row, segments, mainKey);
          // En escala por fila cada pista llena su propio total.
          const denom = stackedRowDenom(scale, total, maxTotal);
          let offset = 0;
          const clipId = `${uid}-st-${ri}`;
          return (
            <div
              key={stableKey([row.label], ri)}
              className="flex items-center gap-2"
            >
              <span
                className="w-36 shrink-0 truncate text-xs text-muted-foreground"
                data-chart-tip={
                  row.detail ? `${row.label} · ${row.detail}` : row.label
                }
              >
                {row.label}
              </span>
              <svg
                viewBox={`0 0 ${TRACK_W} ${barH}`}
                className={defaultH ? "h-6 min-w-0 flex-1" : "min-w-0 flex-1"}
                style={defaultH ? undefined : { height: barH }}
                aria-hidden="true"
              >
                <defs>
                  <clipPath id={clipId}>
                    <rect width={TRACK_W} height={barH} rx={barRadius} />
                  </clipPath>
                </defs>
                <rect
                  width={TRACK_W}
                  height={barH}
                  rx={barRadius}
                  fill={CHART_TOKEN.track}
                />
                <g clipPath={`url(#${clipId})`}>
                  {segments.map((seg, si) => {
                    const value = toNumber(row.values[seg.key]);
                    const w = (value / denom) * TRACK_W;
                    const x = offset;
                    offset += w;
                    if (w <= 0) return null;
                    const pct =
                      total === 0
                        ? 0
                        : Math.round((value / total) * PERCENT_FACTOR);
                    const tip =
                      `${row.label} · ${seg.label}: ${fmt(value)} (${pct}% del total)` +
                      (row.detail ? ` (${row.detail})` : "");
                    return (
                      <g key={stableKey([seg.key], si)}>
                        <rect
                          x={x}
                          y={0}
                          width={w}
                          height={barH}
                          fill={colors[si] ?? CHART_TOKEN.chart1}
                          data-chart-tip={tip}
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>
              {showPercent ? (
                <span className="w-10 shrink-0 text-right font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
                  {percent}%
                </span>
              ) : null}
              {showValues ? (
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                  {fmtV(total)}
                </span>
              ) : null}
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
