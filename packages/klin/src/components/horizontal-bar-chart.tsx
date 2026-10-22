/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { placeEndValueLabel, VALUE_LABEL_DX } from "../core/cartesian-model";
import { seriesColors } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { maxTotalIndex } from "../core/stacked-model";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  MIN_SHAPE_PX,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
  ZERO_MARK_PX,
} from "../core/theme";
import { shareTip } from "../core/tips";
import type { ChartMargin } from "../render/chart-svg";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { measureText } from "../render/measure";
import {
  AXIS_LABEL_OFFSET,
  buildHorizontalBands,
  buildHorizontalValueAxis,
  DEFAULT_LABEL_WIDTH,
  HIGHLIGHT_WIDTH,
  LABEL_MAX_X,
  orderHorizontalGroups,
  resolveHorizontalHeight,
  resolveHorizontalMargin,
  resolveHorizontalRowHeight,
  totalOfGroup,
  W,
} from "./horizontal-bar-chart.compute";
import type { HorizontalBarChartProps } from "./horizontal-bar-chart.types";

export type { HorizontalBarChartProps } from "./horizontal-bar-chart.types";

/**
 * Barras horizontales agrupadas SSR. Altura automática según filas.
 * Soporta negativos (origen en cero) y filtra no-finitos como 0.
 */
export function HorizontalBarChart({
  data,
  yKey,
  series,
  ariaLabel,
  locale = DEFAULT_LOCALE,
  formatX,
  formatValues,
  annotations,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  height: heightProp,
  barRadius = BAR_RADIUS,
  showValues = true,
  sortGroups = "none",
  gridTicks = GRID_TICKS,
  labelWidth = DEFAULT_LABEL_WIDTH,
  xMin,
  xMax,
  xScale = "linear",
  highlightMax = false,
  barColor,
  id,
}: HorizontalBarChartProps) {
  if (isBlank(data) || isBlank(series)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const radius = toNumber(barRadius, BAR_RADIUS);
  const ticksCount = Math.max(1, Math.round(toNumber(gridTicks, GRID_TICKS)));
  const margin: ChartMargin = resolveHorizontalMargin(labelWidth);
  const ordered = orderHorizontalGroups(data, series, sortGroups);

  const rowH = resolveHorizontalRowHeight(series.length);
  const height = resolveHorizontalHeight(
    ordered.length,
    rowH,
    margin,
    heightProp,
  );
  const innerW = W - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const { lo, hi, x, ticks, fmtX, lv, log } = buildHorizontalValueAxis(
    ordered,
    series,
    ticksCount,
    formatX,
    locale,
    innerW,
    xMin,
    xMax,
    xScale,
  );
  const fmtV = formatValues ? resolveFormatter(formatValues, locale) : fmtX;
  const x0 = x(log ? lo : 0);
  const { y0, y1 } = buildHorizontalBands(ordered, series, yKey, innerH);

  const colors = seriesColors(series);
  const totals = ordered.map((d) => totalOfGroup(d, series));
  const maxGroup = maxTotalIndex(totals);

  return (
    <div id={id} className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={margin.left + x(t)}
              x2={margin.left + x(t)}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={margin.left + x(t)}
              y={height - AXIS_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtX(t)}
            </text>
          </g>
        ))}
        {(annotations ?? []).map((a, ai) => {
          const clamped = Math.min(hi, Math.max(lo, toNumber(a.value)));
          const ax = margin.left + x(clamped);
          const stroke = a.color ?? CHART_TOKEN.accent;
          return (
            <g
              key={stableKey([a.label ?? `${a.value}`], ai)}
              data-chart-tip={a.label ?? fmtX(a.value)}
            >
              <line
                x1={ax}
                x2={ax}
                y1={margin.top}
                y2={height - margin.bottom}
                stroke={stroke}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              {a.label ? (
                <text
                  x={ax + TICK_GAP_PX}
                  y={margin.top + TICK_GAP_PX}
                  fontSize={TICK_FONT_SIZE}
                  fill={stroke}
                >
                  {a.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {ordered.map((d, di) => {
          const group = String(d[yKey] ?? "");
          const total = totals[di] ?? totalOfGroup(d, series);
          const isMax = highlightMax && di === maxGroup;
          const hl = isMax
            ? { stroke: CHART_TOKEN.accent, strokeWidth: HIGHLIGHT_WIDTH }
            : {};
          return (
            <g key={stableKey([group], di)}>
              <text
                x={margin.left - TICK_GAP_PX}
                y={margin.top + (y0(group) ?? 0) + y0.bandwidth() / 2}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={group}
              >
                {truncateLabel(group, LABEL_MAX_X)}
              </text>
              {series.map((s, si) => {
                const value = toNumber(d[s.key]);
                const xv = x(lv(value));
                const bw = Math.abs(xv - x0);
                const bx = margin.left + Math.min(x0, xv);
                const w =
                  value === 0 && !log
                    ? ZERO_MARK_PX
                    : Math.max(MIN_SHAPE_PX, bw);
                const by = margin.top + (y0(group) ?? 0) + (y1(s.key) ?? 0);
                const tip = shareTip({
                  label: group,
                  series: s.label,
                  formatted: fmtX(value),
                  value,
                  total,
                  multi: series.length >= 2,
                  of: "grupo",
                });
                const fill =
                  barColor?.(d, di, s, si) ?? colors[si] ?? CHART_TOKEN.chart1;
                const valueText = fmtV(value);
                const vl = placeEndValueLabel(
                  bx + w,
                  W - margin.right,
                  measureText(valueText, TICK_FONT_SIZE),
                  VALUE_LABEL_DX,
                );
                return (
                  <g key={s.key}>
                    <rect
                      x={bx}
                      y={by}
                      width={w}
                      height={Math.max(ZERO_MARK_PX, y1.bandwidth())}
                      rx={radius}
                      fill={fill}
                      data-chart-tip={tip}
                      {...hl}
                    />
                    {showValues ? (
                      <text
                        x={vl.pos}
                        y={by + y1.bandwidth() / 2}
                        dy={TICK_DY}
                        fontSize={TICK_FONT_SIZE}
                        fill={
                          vl.inside ? CHART_TOKEN.background : CHART_TOKEN.muted
                        }
                      >
                        {valueText}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={series.map((s, i) => ({
            label: s.label,
            color: colors[i] ?? CHART_TOKEN.chart1,
          }))}
        />
      ) : null}
    </div>
  );
}
