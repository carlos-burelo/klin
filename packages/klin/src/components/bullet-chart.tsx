/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { type CSSProperties, useId } from "react";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  ZERO_MARK_PX,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  buildBulletSegments,
  bulletSegGeometry,
  cleanBulletRows,
  resolveBulletBands,
  resolveBulletFill,
  resolveBulletGeometry,
  resolveBulletMax,
  resolveBulletTrackStyle,
  TARGET_WIDTH,
  TRACK_H,
  TRACK_RADIUS,
  TRACK_W,
  VALUE_BAR_H,
} from "./bullet-chart.compute";
import type { BulletChartProps } from "./bullet-chart.types";

export type { BulletCleanRow, BulletSeg } from "./bullet-chart.compute";
export {
  BAND_OPACITY_HIGH,
  BAND_OPACITY_LOW,
  BAND_OPACITY_MID,
  buildBulletSegments,
  bulletSegGeometry,
  cleanBulletRows,
  resolveBulletBands,
  resolveBulletFill,
  resolveBulletGeometry,
  resolveBulletMax,
  resolveBulletTrackStyle,
  TARGET_WIDTH,
  TRACK_H,
  TRACK_RADIUS,
  TRACK_W,
  VALUE_BAR_H,
} from "./bullet-chart.compute";
export type { BulletChartProps, BulletRow } from "./bullet-chart.types";

/**
 * Bala SSR (valor vs. meta sobre bandas cualitativas).
 * No-finitos cuentan como 0; anchos siempre dentro del riel.
 */
export function BulletChart({
  rows,
  ariaLabel,
  bands,
  showTargetLabel = true,
  showValues = true,
  scaleMax = "auto",
  height,
  id,
  locale = DEFAULT_LOCALE,
  format,
  formatValues,
  color,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: BulletChartProps) {
  // useId arriba: hooks siempre en mismo orden (antes del early return).
  const autoUid = useId().replace(/:/g, "");
  const uid = id ?? autoUid;
  if (isBlank(rows)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);
  const fmtV = formatValues ? resolveFormatter(formatValues, locale) : fmt;

  const trackStyle: CSSProperties | undefined = resolveBulletTrackStyle(height);
  const clean = cleanBulletRows(rows);
  const maxTotal = resolveBulletMax(clean, scaleMax);
  const { bandFills, bandOpacity } = resolveBulletBands(bands);

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={className}
      style={style}
    >
      <div className="flex flex-col gap-3">
        {clean.map((row, ri) => {
          const clipId = `${uid}-bullet-${ri}`;
          const tip =
            `${row.label}: ${fmt(row.value)} (meta ${fmt(row.target)})` +
            (row.detail ? ` · ${row.detail}` : "");
          const segs = buildBulletSegments(row.ranges, bandOpacity);
          const { valueW, targetX } = resolveBulletGeometry(
            row.value,
            row.target,
            maxTotal,
          );
          const rowFill = resolveBulletFill(row.color ?? color);
          const rowTarget = row.targetColor ?? CHART_TOKEN.foreground;
          return (
            <div key={stableKey([row.label], ri)}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span
                  className="truncate text-xs text-muted-foreground"
                  data-chart-tip={row.label}
                >
                  {row.label}
                </span>
                <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums">
                  {showValues
                    ? showTargetLabel
                      ? `${fmtV(row.value)} / ${fmtV(row.target)}`
                      : fmtV(row.value)
                    : null}
                </span>
              </div>
              <svg
                viewBox={`0 0 ${TRACK_W} ${TRACK_H}`}
                className="h-6 min-w-0 flex-1"
                style={trackStyle}
                aria-hidden="true"
              >
                <defs>
                  <clipPath id={clipId}>
                    <rect width={TRACK_W} height={TRACK_H} rx={TRACK_RADIUS} />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${clipId})`}>
                  {segs.map((s, si) => {
                    const { sx, sw } = bulletSegGeometry(s, maxTotal);
                    return (
                      <rect
                        key={`${s.from}-${s.to}__${si}`}
                        x={sx}
                        y={0}
                        width={sw}
                        height={TRACK_H}
                        fill={bandFills[si] ?? CHART_TOKEN.track}
                        opacity={s.o}
                      />
                    );
                  })}
                </g>
                <rect
                  x={0}
                  y={TRACK_H / 2 - VALUE_BAR_H / 2}
                  width={Math.max(ZERO_MARK_PX, valueW)}
                  height={VALUE_BAR_H}
                  rx={VALUE_BAR_H / 2}
                  fill={rowFill}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={GRID_WIDTH}
                  data-chart-tip={tip}
                />
                <line
                  x1={targetX}
                  x2={targetX}
                  y1={0}
                  y2={TRACK_H}
                  stroke={rowTarget}
                  strokeWidth={TARGET_WIDTH}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
