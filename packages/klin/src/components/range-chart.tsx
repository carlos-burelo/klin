/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
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
  ANNOTATION_LABEL_DX,
  ANNOTATION_LABEL_DY,
  AXIS_LABEL_OFFSET,
  computeRangeModel,
  VALUE_LABEL_GAP,
} from "./range-chart.compute";
import type { RangeChartProps } from "./range-chart.types";

export type {
  RangeChartProps,
  RangeGroup,
  RangeSort,
} from "./range-chart.types";

/**
 * Rangos verticales SSR (línea low–high con topes + punto de valor
 * o punto medio si falta). Filtra no-finitos; tope DEFAULT_MAX_ROWS.
 */
export function RangeChart({
  groups,
  ariaLabel,
  height = 260,
  formatY,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  yMin,
  yMax,
  gridTicks = GRID_TICKS,
  showValues = false,
  showPoints = true,
  sortGroups = "none",
  pointRadius = POINT_RADIUS,
  capWidth,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: RangeChartProps) {
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const { ordered, blo, bhi, fmtY, dotR, y, x, ticks, capW } =
    computeRangeModel({
      groups,
      sortGroups,
      yMin,
      yMax,
      gridTicks,
      formatY,
      locale,
      pointRadius,
      capWidth,
      innerW,
      innerH,
    });
  if (isBlank(ordered)) {
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
        <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmtY} />
        {(annotations ?? []).map((a, ai) => {
          if (a.value < blo || a.value > bhi) return null;
          const ay = MARGIN.top + y(a.value);
          return (
            <g
              key={`ann-${a.value}-${ai}`}
              data-chart-tip={a.label ?? String(a.value)}
            >
              <line
                x1={MARGIN.left}
                x2={W - MARGIN.right}
                y1={ay}
                y2={ay}
                stroke={a.color ?? CHART_TOKEN.accent}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              <text
                x={W - MARGIN.right - ANNOTATION_LABEL_DX}
                y={ay}
                dy={ANNOTATION_LABEL_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={a.color ?? CHART_TOKEN.muted}
              >
                {a.label ?? String(a.value)}
              </text>
            </g>
          );
        })}
        {ordered.map((c, gi) => {
          const cx = MARGIN.left + (x(c.label) ?? 0) + x.bandwidth() / 2;
          const color = seriesColor(gi, c.color);
          const tip = c.isMid
            ? `${c.label}: min ${fmtY(c.low)} · max ${fmtY(c.high)} · ` +
              `medio ${fmtY(c.point)}`
            : `${c.label}: min ${fmtY(c.low)} · max ${fmtY(c.high)} · ` +
              `valor ${fmtY(c.point)}`;
          return (
            <g key={stableKey([c.label], gi)}>
              <text
                x={cx}
                y={height - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={c.label}
              >
                {truncateLabel(c.label)}
              </text>
              <line
                x1={cx}
                x2={cx}
                y1={MARGIN.top + y(c.high)}
                y2={MARGIN.top + y(c.low)}
                stroke={color}
                strokeWidth={LINE_WIDTH}
                data-chart-tip={tip}
              />
              <line
                x1={cx - capW / 2}
                x2={cx + capW / 2}
                y1={MARGIN.top + y(c.high)}
                y2={MARGIN.top + y(c.high)}
                stroke={color}
                strokeWidth={LINE_WIDTH}
              />
              <line
                x1={cx - capW / 2}
                x2={cx + capW / 2}
                y1={MARGIN.top + y(c.low)}
                y2={MARGIN.top + y(c.low)}
                stroke={color}
                strokeWidth={LINE_WIDTH}
              />
              {showPoints ? (
                <circle
                  cx={cx}
                  cy={MARGIN.top + y(c.point)}
                  r={dotR}
                  fill={color}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={POINT_BORDER}
                />
              ) : null}
              {showValues ? (
                <text
                  x={cx}
                  y={MARGIN.top + y(c.point) - dotR - VALUE_LABEL_GAP}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.foreground}
                >
                  {fmtY(c.point)}
                </text>
              ) : null}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={ordered.map((c, gi) => ({
            label: c.label,
            color: seriesColor(gi, c.color),
          }))}
        />
      ) : null}
    </div>
  );
}
