/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  NETWORK_SEED,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
  TICK_FONT_SIZE,
} from "../core/theme";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
} from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  BEESWARM_AXIS_LABEL_OFFSET,
  BEESWARM_X_TICKS,
  beeswarmScale,
  computeBeeswarmPositions,
  TICKS_MIN,
  VALUE_LABEL_GAP,
} from "./beeswarm-plot.compute";
import type { BeeswarmPlotProps } from "./beeswarm-plot.types";

export { computeBeeswarmPositions } from "./beeswarm-plot.compute";
export type {
  BeeswarmPlotProps,
  BeeswarmPoint,
  PositionedBeeswarmPoint,
} from "./beeswarm-plot.types";

/**
 * Enjambre SSR (un valor por punto sobre un eje X lineal; la Y solo
 * desempata colisiones con física determinista). Filtra no-finitos.
 */
export function BeeswarmPlot({
  points,
  ariaLabel,
  radius = POINT_RADIUS_SCATTER,
  height = 260,
  formatX,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  domain,
  gridTicks = BEESWARM_X_TICKS,
  showValues = false,
  showSampleSize = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: BeeswarmPlotProps) {
  const r = Math.max(0, toNumber(radius, POINT_RADIUS_SCATTER));
  const finite = points
    .map((p) => toNumber(p.value, Number.NaN))
    .filter((v) => Number.isFinite(v));
  if (finite.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtX = resolveFormatter(formatX, locale);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(gridTicks, BEESWARM_X_TICKS)),
  );
  const x = beeswarmScale(finite, innerW, domain, safeTicks);
  const ticks = x.ticks(safeTicks);
  const positioned = computeBeeswarmPositions(
    points,
    innerW,
    innerH,
    r,
    NETWORK_SEED,
    domain,
    safeTicks,
  );
  const axisY = MARGIN.top + innerH;

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <line
          x1={MARGIN.left}
          x2={W - MARGIN.right}
          y1={axisY}
          y2={axisY}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
        />
        {ticks.map((t) => (
          <text
            key={t}
            x={MARGIN.left + x(t)}
            y={height - BEESWARM_AXIS_LABEL_OFFSET}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {fmtX(t)}
          </text>
        ))}
        {positioned.map((p, i) => {
          const color = seriesColor(i, p.color);
          const tip = p.label ? `${p.label}: ${fmtX(p.value)}` : fmtX(p.value);
          return (
            <g key={stableKey([p.label ?? p.value], i)}>
              <circle
                cx={MARGIN.left + p.x}
                cy={MARGIN.top + p.y}
                r={r}
                fill={color}
                stroke={CHART_TOKEN.background}
                strokeWidth={POINT_BORDER}
                data-chart-tip={tip}
              />
              {showValues ? (
                <text
                  x={MARGIN.left + p.x}
                  y={MARGIN.top + p.y - r - VALUE_LABEL_GAP}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.foreground}
                >
                  {fmtX(p.value)}
                </text>
              ) : null}
            </g>
          );
        })}
        {showSampleSize ? (
          <text
            x={W - MARGIN.right}
            y={MARGIN.top + TICK_FONT_SIZE}
            textAnchor="end"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {`n = ${finite.length}`}
          </text>
        ) : null}
      </ChartSvg>
    </div>
  );
}
