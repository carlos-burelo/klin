/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { seriesColor } from "../core/color";
import type { ValueFormatter } from "../core/format";
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
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
import { YGrid } from "../render/y-grid";
import {
  CONTOUR_MIN_OPACITY,
  CONTOUR_OPACITY_SPAN,
  computeDensityContours,
  contourPath,
  DEFAULT_BANDWIDTH,
  DEFAULT_LEVELS,
  densityScales,
  safeGridTicks,
  X_TICK_LABEL_OFFSET,
  X_TICKS,
} from "./density-contour-plot.compute";
import type { DensityContourPlotProps } from "./density-contour-plot.types";

export { computeDensityContours } from "./density-contour-plot.compute";
export type {
  DensityContourPlotProps,
  DensityPoint,
  PositionedDensityPoint,
} from "./density-contour-plot.types";

/**
 * Contornos de densidad SSR (d3-contour sobre el grid del viewBox +
 * puntos encima). Filtra no-finitos; sin muestra → ChartEmpty.
 */
export function DensityContourPlot({
  points,
  ariaLabel,
  bandwidth = DEFAULT_BANDWIDTH,
  thresholds = DEFAULT_LEVELS,
  height = 260,
  format,
  locale = DEFAULT_LOCALE,
  color,
  showPoints = true,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  showLabels = true,
  gridTicks = GRID_TICKS,
  maxItems = DEFAULT_MAX_ROWS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: DensityContourPlotProps) {
  const safeH = toNumber(height, 260);
  const safeTicks = safeGridTicks(gridTicks);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = safeH - MARGIN.top - MARGIN.bottom;
  const { contours, positioned } = computeDensityContours(
    points,
    innerW,
    innerH,
    bandwidth,
    thresholds,
    safeTicks,
    maxItems,
  );
  if (positioned.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt: ValueFormatter = resolveFormatter(format, locale);
  const { x, y } = densityScales(positioned, innerW, innerH, safeTicks);
  const ticks = y.ticks(safeTicks);
  const base = seriesColor(0, color);
  const total = Math.max(1, contours.length);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={safeH}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {showLabels ? (
          <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmt} />
        ) : (
          ticks.map((t) => (
            <line
              key={`grid-${t}`}
              x1={MARGIN.left}
              x2={W - MARGIN.right}
              y1={MARGIN.top + y(t)}
              y2={MARGIN.top + y(t)}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
          ))
        )}
        {showLabels
          ? x.ticks(X_TICKS).map((t) => (
              <text
                key={`x${t}`}
                x={MARGIN.left + x(t)}
                y={safeH - X_TICK_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {fmt(t)}
              </text>
            ))
          : null}
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {contours.map((c, i) => {
            const d = contourPath(c);
            if (d.length === 0) return null;
            const tip = `densidad ≥ ${fmt(c.value)}`;
            const opacity =
              CONTOUR_MIN_OPACITY + ((i + 1) / total) * CONTOUR_OPACITY_SPAN;
            return (
              <g key={stableKey([c.value], i)}>
                <path
                  d={d}
                  fill={base}
                  fillOpacity={opacity}
                  stroke={base}
                  strokeWidth={LINE_WIDTH}
                  data-chart-tip={tip}
                />
              </g>
            );
          })}
          {showPoints
            ? positioned.map((p, i) => {
                const tip = p.label
                  ? `${p.label}: (${fmt(p.x)}, ${fmt(p.y)})`
                  : `(${fmt(p.x)}, ${fmt(p.y)})`;
                return (
                  <g key={stableKey([p.label ?? `${p.x},${p.y}`], i)}>
                    <circle
                      cx={p.px}
                      cy={p.py}
                      r={POINT_RADIUS}
                      fill={base}
                      stroke={CHART_TOKEN.background}
                      strokeWidth={POINT_BORDER}
                      data-chart-tip={tip}
                    />
                  </g>
                );
              })
            : null}
        </g>
      </ChartSvg>
      {showLegend ? (
        <ChartLegend items={[{ label: "Densidad", color: base }]} />
      ) : null}
    </div>
  );
}
