/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  POINT_BORDER,
  TICK_FONT_SIZE,
} from "../core/theme";
import { pctOf } from "../core/tips";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
} from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { YGrid } from "../render/y-grid";
import {
  cleanHexPoints,
  computeHexbins,
  DEFAULT_HEX_RADIUS,
  HEX_MIN_OPACITY,
  HEX_OPACITY_SPAN,
  hexScales,
  safeGridTicks,
  X_TICK_LABEL_OFFSET,
  X_TICKS,
} from "./hexbin-plot.compute";
import type { HexbinPlotProps } from "./hexbin-plot.types";

export { computeHexbins } from "./hexbin-plot.compute";
export type { HexbinPlotProps, HexCell, HexPoint } from "./hexbin-plot.types";

/**
 * Agregado hexagonal SSR (d3-hexbin sobre x/y lineales con YGrid).
 * Opacidad ∝ conteo; filtra no-finitos; sin celdas → ChartEmpty.
 */
export function HexbinPlot({
  points,
  ariaLabel,
  radius = DEFAULT_HEX_RADIUS,
  height = 260,
  formatValue,
  locale = DEFAULT_LOCALE,
  color,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  showLabels = true,
  showCounts = true,
  gridTicks = GRID_TICKS,
  maxItems = DEFAULT_MAX_ROWS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: HexbinPlotProps) {
  const safeH = toNumber(height, 260);
  const safeTicks = safeGridTicks(gridTicks);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = safeH - MARGIN.top - MARGIN.bottom;
  const { bins, total, maxCount, hexagon } = computeHexbins(
    points,
    innerW,
    innerH,
    radius,
    safeTicks,
    maxItems,
  );
  if (bins.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(formatValue, locale);
  const { x, y } = hexScales(
    cleanHexPoints(points, maxItems),
    innerW,
    innerH,
    safeTicks,
  );
  const ticks = y.ticks(safeTicks);
  const base = seriesColor(0, color);
  const peak = Math.max(1, maxCount);

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
          {bins.map((b, i) => {
            const pct = pctOf(b.count, total);
            const tip = showCounts
              ? `celda: ${fmt(b.count)} puntos (${pct}%)`
              : `celda: ${pct}%`;
            const opacity =
              HEX_MIN_OPACITY + (b.count / peak) * HEX_OPACITY_SPAN;
            return (
              <g key={stableKey([Math.round(b.x), Math.round(b.y)], i)}>
                <path
                  d={hexagon}
                  transform={`translate(${b.x},${b.y})`}
                  fill={base}
                  fillOpacity={opacity}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={POINT_BORDER}
                  data-chart-tip={tip}
                />
              </g>
            );
          })}
        </g>
      </ChartSvg>
      {showLegend ? (
        <ChartLegend items={[{ label: "Celdas", color: base }]} />
      ) : null}
    </div>
  );
}
