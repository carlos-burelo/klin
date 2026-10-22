/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  PERCENT_FACTOR,
  TICK_DY,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../core/theme";
import type { ChartMargin } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  AXIS_LABEL_BOTTOM_PAD,
  BAR_STROKE_OPACITY,
  BAR_Y_PAD,
  buildPyramidRows,
  buildPyramidScale,
  computePyramidLayout,
  computePyramidTotals,
  LABEL_MAX_CENTER,
  LABEL_MAX_SIDE,
  normalizePyramidBarRadius,
  pyramidFitsValue,
  SHARE_GAP_PX,
} from "./pyramid-chart.compute";
import type { PyramidChartProps } from "./pyramid-chart.types";

export type {
  PyramidLabels,
  PyramidMargin,
  PyramidRow,
  PyramidSort,
} from "./pyramid-chart.compute";
export {
  AXIS_LABEL_BOTTOM_PAD,
  BAR_STROKE_OPACITY,
  BAR_Y_PAD,
  buildPyramidRows,
  buildPyramidScale,
  computePyramidLayout,
  computePyramidTotals,
  LABEL_BAND,
  LABEL_MAX_CENTER,
  LABEL_MAX_SIDE,
  normalizePyramidBarRadius,
  PYRAMID_MIN_H,
  pyramidFitsValue,
  ROW_H,
  SHARE_GAP_PX,
  VALUE_MIN_W,
} from "./pyramid-chart.compute";
export type { PyramidChartProps } from "./pyramid-chart.types";

const W = 640;
const MARGIN: ChartMargin = { top: 8, right: 16, bottom: 34, left: 84 };

/**
 * Pirámide poblacional SSR (dos series espejadas): etiquetas a la izquierda,
 * barras al centro y escala abajo, como la clásica de población.
 */
export function PyramidChart({
  groups,
  left,
  right,
  ariaLabel,
  locale = DEFAULT_LOCALE,
  formatX,
  formatValues,
  labels = "left",
  itemColor,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  height: heightProp,
  showShare = false,
  centerGap,
  sortGroups = "none",
  barRadius = BAR_RADIUS,
  showValues = false,
}: PyramidChartProps) {
  if (isBlank(groups)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtX = resolveFormatter(formatX, locale);
  const fmtV = formatValues ? resolveFormatter(formatValues, locale) : fmtX;

  const rows = buildPyramidRows(groups, left.values, right.values, sortGroups);

  const { rowH, height, halfW, midX, leftEdge, rightEdge } =
    computePyramidLayout(rows.length, heightProp, labels, centerGap, W, MARGIN);

  const { scale, ticks } = buildPyramidScale(left.values, right.values, halfW);
  const radius = normalizePyramidBarRadius(barRadius);
  const leftColor = seriesColor(0, left.color);
  const rightColor = seriesColor(1, right.color);
  const { totalL, totalR } = computePyramidTotals(left.values, right.values);

  return (
    <div className={className} style={style}>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <line
          x1={midX}
          x2={midX}
          y1={MARGIN.top}
          y2={height - MARGIN.bottom}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
        />
        {rows.map((row, i) => {
          const group = row.group;
          const lv = row.l;
          const rv = row.r;
          const by = MARGIN.top + i * rowH + BAR_Y_PAD;
          const bh = rowH - BAR_Y_PAD * 2;
          const lw = Math.max(lv === 0 ? 0 : ZERO_MARK_PX, scale(lv));
          const rw = Math.max(rv === 0 ? 0 : ZERO_MARK_PX, scale(rv));
          const leftFill = itemColor?.(group, "left", i) ?? leftColor;
          const rightFill = itemColor?.(group, "right", i) ?? rightColor;
          const pctL =
            totalL > 0 ? Math.round((lv / totalL) * PERCENT_FACTOR) : 0;
          const pctR =
            totalR > 0 ? Math.round((rv / totalR) * PERCENT_FACTOR) : 0;
          const tipL = `${group} · ${left.label}: ${fmtX(lv)} (${pctL}% de ${left.label})`;
          const tipR = `${group} · ${right.label}: ${fmtX(rv)} (${pctR}% de ${right.label})`;
          return (
            <g key={stableKey([group], i)}>
              <text
                x={labels === "center" ? midX : MARGIN.left}
                y={by + bh / 2}
                dy={TICK_DY}
                textAnchor={labels === "center" ? "middle" : "start"}
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={group}
              >
                {truncateLabel(
                  group,
                  labels === "center" ? LABEL_MAX_CENTER : LABEL_MAX_SIDE,
                )}
              </text>
              <g>
                <rect
                  x={leftEdge - lw}
                  y={by}
                  width={lw}
                  height={bh}
                  rx={radius}
                  fill={leftFill}
                  stroke={CHART_TOKEN.foreground}
                  strokeOpacity={BAR_STROKE_OPACITY}
                  strokeWidth={GRID_WIDTH}
                  data-chart-tip={tipL}
                />
                {pyramidFitsValue(showValues, lw) ? (
                  <text
                    x={leftEdge - lw / 2}
                    y={by + bh / 2}
                    dy={TICK_DY}
                    textAnchor="middle"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.onFill}
                  >
                    {fmtV(lv)}
                  </text>
                ) : null}
              </g>
              <g>
                <rect
                  x={rightEdge}
                  y={by}
                  width={rw}
                  height={bh}
                  rx={radius}
                  fill={rightFill}
                  stroke={CHART_TOKEN.foreground}
                  strokeOpacity={BAR_STROKE_OPACITY}
                  strokeWidth={GRID_WIDTH}
                  data-chart-tip={tipR}
                />
                {pyramidFitsValue(showValues, rw) ? (
                  <text
                    x={rightEdge + rw / 2}
                    y={by + bh / 2}
                    dy={TICK_DY}
                    textAnchor="middle"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.onFill}
                  >
                    {fmtV(rv)}
                  </text>
                ) : null}
              </g>
              {showShare ? (
                <>
                  <text
                    x={leftEdge - lw - SHARE_GAP_PX}
                    y={by + bh / 2}
                    dy={TICK_DY}
                    textAnchor="end"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {pctL}%
                  </text>
                  <text
                    x={rightEdge + rw + SHARE_GAP_PX}
                    y={by + bh / 2}
                    dy={TICK_DY}
                    textAnchor="start"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {pctR}%
                  </text>
                </>
              ) : null}
            </g>
          );
        })}
        {ticks.map((t) => (
          <g key={t}>
            <text
              x={leftEdge - scale(t)}
              y={height - AXIS_LABEL_BOTTOM_PAD}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtX(t)}
            </text>
            <text
              x={rightEdge + scale(t)}
              y={height - AXIS_LABEL_BOTTOM_PAD}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtX(t)}
            </text>
          </g>
        ))}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: left.label, color: leftColor },
            { label: right.label, color: rightColor },
          ]}
        />
      ) : null}
    </div>
  );
}
