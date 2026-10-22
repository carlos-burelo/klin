/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  MISSING_VALUE,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  computeMatrixGrid,
  computeMatrixTop,
  LABEL_H,
  LABEL_MAX_COL,
  LABEL_MAX_ROW,
  MATRIX_LEGEND_OPACITIES,
  matrixCellOpacity,
  matrixCellOpacityWithDomain,
  matrixCellValue,
  resolveMatrixDomain,
  resolveMatrixFill,
  shouldShowMatrixValue,
  W,
} from "./matrix-heatmap.compute";
import type { MatrixHeatmapProps } from "./matrix-heatmap.types";

export type { MatrixHeatmapProps } from "./matrix-heatmap.types";

/**
 * Mapa de calor matricial SSR (filas × columnas, intensidad por opacidad).
 * La parrilla se centra en un lienzo fijo de 640 para no agigantarse.
 */
export function MatrixHeatmap({
  rows,
  cols,
  values,
  ariaLabel,
  showValues = "auto",
  missingLabel = MISSING_VALUE,
  min,
  max,
  showLegend = false,
  locale = DEFAULT_LOCALE,
  format,
  color,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: MatrixHeatmapProps) {
  if (isBlank(rows) || isBlank(cols)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);

  const top = computeMatrixTop(values);
  const hasDomain = min !== undefined || max !== undefined;
  const { lo, hi } = resolveMatrixDomain(values, min, max);
  const { cell, step, gx, H } = computeMatrixGrid(cols.length, rows.length);
  const fill = resolveMatrixFill(color);

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {cols.map((col, ci) => (
          <text
            key={stableKey([col], ci)}
            x={gx + ci * step + cell / 2}
            y={LABEL_H - TICK_GAP_PX}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
            data-chart-tip={col}
          >
            {truncateLabel(col, LABEL_MAX_COL)}
          </text>
        ))}
        {rows.map((row, ri) => (
          <g key={stableKey([row], ri)}>
            <text
              x={gx - TICK_GAP_PX}
              y={LABEL_H + ri * step + cell / 2}
              dy={TICK_DY}
              textAnchor="end"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
              data-chart-tip={row}
            >
              {truncateLabel(row, LABEL_MAX_ROW)}
            </text>
            {cols.map((col, ci) => {
              const { isMissing, v } = matrixCellValue(values[ri]?.[ci]);
              const tip = isMissing
                ? `${row} · ${col}: ${missingLabel}`
                : `${row} · ${col}: ${fmt(v)}`;
              const showText = shouldShowMatrixValue(showValues, cell);
              const opacity = hasDomain
                ? matrixCellOpacityWithDomain(isMissing, v, lo, hi)
                : matrixCellOpacity(isMissing, v, top);
              return (
                <g key={stableKey([col], ci)}>
                  <rect
                    x={gx + ci * step}
                    y={LABEL_H + ri * step}
                    width={cell}
                    height={cell}
                    rx={BAR_RADIUS}
                    fill={fill}
                    fillOpacity={opacity}
                    data-chart-tip={tip}
                  />
                  {showText ? (
                    <text
                      x={gx + ci * step + cell / 2}
                      y={LABEL_H + ri * step + cell / 2}
                      dy={TICK_DY}
                      textAnchor="middle"
                      fontSize={TICK_FONT_SIZE}
                      fill={CHART_TOKEN.foreground}
                    >
                      {isMissing ? missingLabel : fmt(v)}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
        ))}
      </svg>
      {showLegend ? (
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>{fmt(lo)}</span>
          {MATRIX_LEGEND_OPACITIES.map((o, oi) => (
            <span
              key={stableKey([o], oi)}
              className="inline-block size-[10px] rounded-[3px]"
              style={{ backgroundColor: fill, opacity: o }}
            />
          ))}
          <span>{fmt(hi)}</span>
        </p>
      ) : null}
    </div>
  );
}
