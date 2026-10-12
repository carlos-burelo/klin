/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { topPositive } from "../lib/domain";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  EMPTY_CELL_OPACITY,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

const W = 640;
const LABEL_W = 132;
const LABEL_H = 30;
const MAX_CELL = 64;
/** Separación entre celdas, aire lateral y relleno inferior. */
const CELL_GAP = 4;
const GRID_SIDE_PAD = 16;
const GRID_BOTTOM_PAD = 8;
/** Máximos de truncado de columna y fila. */
const LABEL_MAX_COL = 10;
const LABEL_MAX_ROW = 18;
/** Opacidades de celda con valor (base + rango). */
const CELL_BASE_OPACITY = 0.15;
const CELL_RANGE_OPACITY = 0.85;

/** Props del mapa de calor matricial SSR (filas × columnas). */
export type MatrixHeatmapProps = {
  rows: string[];
  cols: string[];
  /** values[fila][columna]. */
  values: number[][];
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
 * Mapa de calor matricial SSR (filas × columnas, intensidad por opacidad).
 * La parrilla se centra en un lienzo fijo de 640 para no agigantarse.
 */
export function MatrixHeatmap({
  rows,
  cols,
  values,
  ariaLabel,
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
  color,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: MatrixHeatmapProps) {
  if (rows.length === 0 || cols.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const top = topPositive(values.flat());
  const cell = Math.min(
    MAX_CELL,
    Math.floor((W - LABEL_W - GRID_SIDE_PAD) / cols.length) - CELL_GAP,
  );
  const step = cell + CELL_GAP;
  const gridW = cols.length * step - CELL_GAP;
  const gx = LABEL_W + Math.max(0, (W - LABEL_W - gridW) / 2);
  const H = LABEL_H + rows.length * step - CELL_GAP + GRID_BOTTOM_PAD;
  const fill = seriesColor(0, color);

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
        <title>{ariaLabel}</title>
        {cols.map((col, ci) => (
          <text
            key={stableKey([col], ci)}
            x={gx + ci * step + cell / 2}
            y={LABEL_H - TICK_GAP_PX}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            <title>{col}</title>
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
            >
              <title>{row}</title>
              {truncateLabel(row, LABEL_MAX_ROW)}
            </text>
            {cols.map((col, ci) => {
              const v = toNumber(values[ri]?.[ci] ?? 0);
              const tip = `${row} · ${col}: ${format(v)}`;
              return (
                <g key={stableKey([col], ci)}>
                  <title>{tip}</title>
                  <rect
                    x={gx + ci * step}
                    y={LABEL_H + ri * step}
                    width={cell}
                    height={cell}
                    rx={BAR_RADIUS}
                    fill={fill}
                    fillOpacity={
                      v <= 0
                        ? EMPTY_CELL_OPACITY
                        : CELL_BASE_OPACITY + CELL_RANGE_OPACITY * (v / top)
                    }
                    data-chart-tip={tip}
                  />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
