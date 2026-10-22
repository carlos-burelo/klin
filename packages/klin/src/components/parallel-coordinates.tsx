/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_FONT_SIZE,
} from "../core/theme";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
} from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  AXIS_LABEL_MAX,
  AXIS_LABEL_OFFSET,
  AXIS_PAD_BOTTOM,
  AXIS_PAD_TOP,
  computeParallelModel,
  VERTEX_OPACITY,
} from "./parallel-coordinates.compute";
import type { ParallelCoordinatesProps } from "./parallel-coordinates.types";

export type {
  ParallelAxis,
  ParallelCoordinatesProps,
  ParallelRow,
} from "./parallel-coordinates.types";

/**
 * Coordenadas paralelas SSR (multivariado sin interacción). Cada eje se
 * normaliza a su propio [mínimo, máximo]; filas sin ningún valor finito
 * se descartan. Determinista.
 */
export function ParallelCoordinates({
  axes,
  rows,
  height = 300,
  ariaLabel,
  format,
  locale = DEFAULT_LOCALE,
  showPoints = true,
  maxItems = DEFAULT_MAX_ROWS,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ParallelCoordinatesProps) {
  const innerW = W - MARGIN.left - MARGIN.right;
  const top = MARGIN.top + AXIS_PAD_TOP;
  const bottom = height - MARGIN.bottom - AXIS_PAD_BOTTOM;

  const { clean, fmt, x, y, domains, norm, palette, legendItems, pathFor } =
    computeParallelModel({
      axes,
      rows,
      innerW,
      top,
      bottom,
      marginLeft: MARGIN.left,
      format,
      locale,
      showLegend,
      maxItems,
    });
  if (isBlank(axes) || isBlank(clean)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {axes.map((a, ai) => {
          const ax = MARGIN.left + (x(a.key) ?? 0);
          const [lo, hi] = domains.get(a.key) ?? [0, 1];
          const label = a.label ?? a.key;
          return (
            <g key={stableKey([a.key], ai)}>
              <line
                x1={ax}
                x2={ax}
                y1={top}
                y2={bottom}
                stroke={CHART_TOKEN.border}
                strokeWidth={GRID_WIDTH}
              />
              <text
                x={ax}
                y={top - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={label}
              >
                {truncateLabel(label, AXIS_LABEL_MAX)}
              </text>
              <text
                x={ax}
                y={top - 2}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {fmt(hi)}
              </text>
              <text
                x={ax}
                y={bottom + TICK_FONT_SIZE + 2}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {fmt(lo)}
              </text>
            </g>
          );
        })}
        {clean.map((c, i) => {
          const color = palette[i] ?? CHART_TOKEN.chart1;
          const name = c.row.label ?? `Fila ${i + 1}`;
          const tip = `${name}: ${axes
            .map((a) => {
              const v = c.vals.get(a.key);
              return v === undefined ? null : `${a.label ?? a.key} ${fmt(v)}`;
            })
            .filter((s) => s !== null)
            .join(" · ")}`;
          return (
            <g key={stableKey([name], i)}>
              <path
                d={pathFor(c.vals)}
                fill="none"
                stroke={color}
                strokeWidth={LINE_WIDTH}
                strokeLinecap="round"
                opacity={VERTEX_OPACITY}
                data-chart-tip={tip}
              />
              {showPoints
                ? axes.map((a, ai) => {
                    const v = c.vals.get(a.key);
                    if (v === undefined) return null;
                    const vtip = `${name} · ${a.label ?? a.key}: ${fmt(v)}`;
                    return (
                      <g key={stableKey([a.key], ai)}>
                        <circle
                          cx={MARGIN.left + (x(a.key) ?? 0)}
                          cy={y(norm(a.key, v))}
                          r={POINT_RADIUS}
                          fill={color}
                          stroke={CHART_TOKEN.background}
                          strokeWidth={POINT_BORDER}
                          data-chart-tip={vtip}
                        />
                      </g>
                    );
                  })
                : null}
            </g>
          );
        })}
      </ChartSvg>
      {legendItems ? <ChartLegend items={legendItems} /> : null}
    </div>
  );
}
