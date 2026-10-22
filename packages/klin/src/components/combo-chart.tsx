/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  MIN_SHAPE_PX,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
  ZERO_MARK_PX,
} from "../core/theme";
import { shareTip } from "../core/tips";
import { CartesianFrame } from "../render/cartesian-frame";
import { CHART_MARGIN as MARGIN, CHART_W as W } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { COMBO_VALUE_DY, computeComboModel } from "./combo-chart.compute";
import type { ComboChartProps } from "./combo-chart.types";

export type { ComboChartProps } from "./combo-chart.types";

/**
 * Barras + líneas SSR sobre el mismo eje X (el compuesto clásico de
 * dashboards). Las barras mandan en el eje Y izquierdo; con `yAxisRight`
 * las líneas llevan escala propia con ticks a la derecha.
 */
export function ComboChart({
  data,
  xKey,
  bars,
  lines,
  yAxisRight = false,
  height = 260,
  ariaLabel,
  formatY,
  formatYR,
  curve = "monotone",
  showPoints = true,
  showValues = false,
  sortGroups = "none",
  barRadius,
  yMin,
  yMax,
  yMinR,
  yMaxR,
  gridTicks = GRID_TICKS,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  barColor,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ComboChartProps) {
  if (isBlank(data) || (isBlank(bars) && isBlank(lines))) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtY = resolveFormatter(formatY, locale);
  const fmtYR = formatYR ?? fmtY;
  const {
    margin,
    ordered,
    labels,
    lo,
    hi,
    y,
    yR,
    x0,
    x1,
    ticks,
    rightTicks,
    barColors,
    lineColors,
    y0,
    y0R,
    radius,
    barAxis,
    lineAxis,
    hasRight,
    totals,
    lineTotals,
    multi,
    legendItems,
    pathFor,
  } = computeComboModel({
    data,
    xKey,
    bars,
    lines,
    yAxisRight,
    height,
    width: W,
    baseMargin: MARGIN,
    yMin,
    yMax,
    yMinR,
    yMaxR,
    gridTicks,
    showLegend,
    curve,
    sortGroups,
    barRadius,
  });

  return (
    <CartesianFrame
      height={height}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      className={className}
      style={style}
      margin={margin}
      ticks={ticks}
      y={y}
      formatY={fmtY}
      annotations={annotations}
      annLo={lo}
      annHi={hi}
      xLabels={labels.map((label) => ({
        x: (x0(label) ?? 0) + x0.bandwidth() / 2,
        label: truncateLabel(label),
        title: label,
      }))}
      legendItems={legendItems}
    >
      {ordered.map((d, di) => {
        const group = String(d[xKey] ?? "");
        const barTotal = totals[di] ?? 0;
        const combined = barTotal + (lineTotals[di] ?? 0);
        return (
          <g key={stableKey([group], di)}>
            {bars.map((s, si) => {
              const value = toNumber(d[s.key]);
              const yFor = (barAxis[si] ?? "left") === "right" ? yR : y;
              const yZero = (barAxis[si] ?? "left") === "right" ? y0R : y0;
              const bw = bars.length > 1 ? x1.bandwidth() : x0.bandwidth();
              const bx =
                MARGIN.left +
                (x0(group) ?? 0) +
                (bars.length > 1 ? (x1(s.key) ?? 0) : 0);
              const yV = yFor(value);
              const rectY =
                value === 0
                  ? MARGIN.top + yZero - ZERO_MARK_PX / 2
                  : MARGIN.top + Math.min(yZero, yV);
              const rectH =
                value === 0
                  ? ZERO_MARK_PX
                  : Math.max(MIN_SHAPE_PX, Math.abs(yZero - yV));
              const tip = shareTip({
                label: group,
                series: s.label,
                formatted: fmtY(value),
                value,
                total: barTotal,
                multi,
                of: "grupo",
              });
              const fill = barColor?.(d, di, s, si) ?? barColors[si];
              return (
                <g key={s.key}>
                  <rect
                    x={bx}
                    y={rectY}
                    width={Math.max(MIN_SHAPE_PX, bw)}
                    height={rectH}
                    rx={radius}
                    fill={fill}
                    data-chart-tip={tip}
                  />
                  {showValues ? (
                    <text
                      x={bx + Math.max(MIN_SHAPE_PX, bw) / 2}
                      y={rectY - COMBO_VALUE_DY}
                      textAnchor="middle"
                      fontSize={TICK_FONT_SIZE}
                      fill={CHART_TOKEN.muted}
                    >
                      {fmtY(value)}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {lines.map((s, si) => {
              const color = lineColors[si] ?? CHART_TOKEN.chart1;
              const yFor = (lineAxis[si] ?? "left") === "right" ? yR : y;
              const cx = MARGIN.left + (x0(group) ?? 0) + x0.bandwidth() / 2;
              const value = toNumber(d[s.key]);
              const tip = shareTip({
                label: group,
                series: s.label,
                formatted:
                  (lineAxis[si] ?? "left") === "right"
                    ? fmtYR(value)
                    : fmtY(value),
                value,
                total: combined,
                multi,
                of: "grupo",
              });
              return (
                <g key={s.key} data-chart-tip={tip}>
                  {showPoints ? (
                    <g key={`${s.key}-pt`}>
                      <circle
                        cx={cx}
                        cy={MARGIN.top + yFor(value)}
                        r={POINT_RADIUS}
                        fill={color}
                        stroke={CHART_TOKEN.background}
                        strokeWidth={POINT_BORDER}
                        data-chart-tip={tip}
                      />
                    </g>
                  ) : null}
                </g>
              );
            })}
          </g>
        );
      })}
      {lines.map((s, si) => (
        <path
          key={`combo-line-${s.key}`}
          d={pathFor(s.key) ?? ""}
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
          fill="none"
          stroke={lineColors[si] ?? CHART_TOKEN.chart1}
          strokeWidth={LINE_WIDTH}
          strokeLinecap="round"
        />
      ))}
      {hasRight
        ? rightTicks.map((t) => (
            <g key={`yr-${t}`}>
              <text
                x={W - margin.right + TICK_GAP_PX}
                y={MARGIN.top + yR(t)}
                dy={TICK_DY}
                textAnchor="start"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {fmtYR(t)}
              </text>
            </g>
          ))
        : null}
    </CartesianFrame>
  );
}
