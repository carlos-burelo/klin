/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  LABEL_GAP_PX,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../core/theme";
import { ChartSvg, CHART_W as W } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  BUMP_AXIS_LABEL_OFFSET,
  BUMP_LABEL_MAX,
  BUMP_MARGIN_BOTTOM,
  BUMP_MARGIN_LEFT,
  BUMP_MARGIN_RIGHT,
  BUMP_MARGIN_TOP,
  buildBumpRows,
  buildBumpXScale,
  buildBumpYScale,
  bumpPathFor,
  resolveBumpDotRadius,
  selectBumpVisible,
  VALUE_LABEL_GAP,
} from "./bump-chart.compute";
import type { BumpChartProps } from "./bump-chart.types";

export type { BumpPoint, BumpRow } from "./bump-chart.compute";
export {
  BUMP_AXIS_LABEL_OFFSET,
  BUMP_LABEL_MAX,
  BUMP_MARGIN_BOTTOM,
  BUMP_MARGIN_LEFT,
  BUMP_MARGIN_RIGHT,
  BUMP_MARGIN_TOP,
  BUMP_MIN_RANK,
  BUMP_POINT_PADDING,
  buildBumpRows,
  buildBumpXScale,
  buildBumpYScale,
  bumpPathFor,
  resolveBumpDotRadius,
  selectBumpVisible,
  TICKS_MIN,
  VALUE_LABEL_GAP,
} from "./bump-chart.compute";
export type { BumpChartProps, BumpSeries } from "./bump-chart.types";

/**
 * Carreras de puestos SSR (eje Y = rank invertido 1..N, líneas suaves).
 * Los ranks se normalizan a enteros ≥ 1; filtra no-finitos.
 */
export function BumpChart({
  periods,
  series,
  ariaLabel,
  height = 260,
  locale = DEFAULT_LOCALE,
  formatRank,
  className,
  style,
  ariaDescribedBy,
  showLegend = false,
  gridTicks = GRID_TICKS,
  showPoints = true,
  showValues = false,
  pointRadius = POINT_RADIUS,
  topN,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: BumpChartProps) {
  const rows = buildBumpRows(series, periods);
  const visible = selectBumpVisible(rows, topN);
  const total = visible.length;
  if (isBlank(periods) || !visible.some((r) => r.points.length > 0)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtRank = resolveFormatter(formatRank, locale);
  const dotR = resolveBumpDotRadius(pointRadius);
  const innerW = W - BUMP_MARGIN_LEFT - BUMP_MARGIN_RIGHT;
  const innerH = height - BUMP_MARGIN_TOP - BUMP_MARGIN_BOTTOM;
  const { y, ticks } = buildBumpYScale(visible, gridTicks, innerH);
  const { x, firstX, lastX } = buildBumpXScale(periods, innerW);

  const pathFor = (pts: { period: string; rank: number }[]) =>
    bumpPathFor(pts, x, y);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={BUMP_MARGIN_LEFT + firstX}
              x2={BUMP_MARGIN_LEFT + lastX}
              y1={BUMP_MARGIN_TOP + y(t)}
              y2={BUMP_MARGIN_TOP + y(t)}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={BUMP_MARGIN_LEFT - TICK_GAP_PX}
              y={BUMP_MARGIN_TOP + y(t)}
              dy={TICK_DY}
              textAnchor="end"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtRank(t)}
            </text>
          </g>
        ))}
        {periods.map((p, i) => (
          <text
            key={stableKey([p], i)}
            x={BUMP_MARGIN_LEFT + (x(p) ?? 0)}
            y={height - BUMP_AXIS_LABEL_OFFSET}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {truncateLabel(p)}
          </text>
        ))}
        {visible.map((row, si) => {
          const first = row.points[0];
          const last = row.points[row.points.length - 1];
          if (!first || !last) return null;
          const color = seriesColor(row.si, row.color);
          const d = row.points.length >= 2 ? pathFor(row.points) : null;
          const firstX0 = BUMP_MARGIN_LEFT + (x(first.period) ?? 0);
          const lastX0 = BUMP_MARGIN_LEFT + (x(last.period) ?? 0);
          return (
            <g key={stableKey([row.label], si)}>
              {d ? (
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={LINE_WIDTH}
                  strokeLinecap="round"
                />
              ) : null}
              <text
                x={firstX0 - LABEL_GAP_PX}
                y={BUMP_MARGIN_TOP + y(first.rank)}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={color}
              >
                {truncateLabel(row.label, BUMP_LABEL_MAX)}
              </text>
              <text
                x={lastX0 + LABEL_GAP_PX}
                y={BUMP_MARGIN_TOP + y(last.rank)}
                dy={TICK_DY}
                textAnchor="start"
                fontSize={TICK_FONT_SIZE}
                fill={color}
              >
                {truncateLabel(row.label, BUMP_LABEL_MAX)}
              </text>
              {showPoints
                ? row.points.map((p, pi) => {
                    const tip = `${row.label} · ${p.period}: puesto ${fmtRank(p.rank)} de ${fmtRank(total)}`;
                    return (
                      <g key={stableKey([row.label, p.period], pi)}>
                        <circle
                          cx={BUMP_MARGIN_LEFT + (x(p.period) ?? 0)}
                          cy={BUMP_MARGIN_TOP + y(p.rank)}
                          r={dotR}
                          fill={color}
                          stroke={CHART_TOKEN.background}
                          strokeWidth={POINT_BORDER}
                          data-chart-tip={tip}
                        />
                        {showValues ? (
                          <text
                            x={BUMP_MARGIN_LEFT + (x(p.period) ?? 0)}
                            y={
                              BUMP_MARGIN_TOP +
                              y(p.rank) -
                              dotR -
                              VALUE_LABEL_GAP
                            }
                            textAnchor="middle"
                            fontSize={TICK_FONT_SIZE}
                            fill={CHART_TOKEN.foreground}
                          >
                            {fmtRank(p.rank)}
                          </text>
                        ) : null}
                      </g>
                    );
                  })
                : null}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={visible
            .filter((row) => row.points.length > 0)
            .map((row) => ({
              label: row.label,
              color: seriesColor(row.si, row.color),
            }))}
        />
      ) : null}
    </div>
  );
}
