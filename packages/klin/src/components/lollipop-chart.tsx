/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  GRID_TICKS,
  LINE_WIDTH,
  NODE_BORDER_WIDTH,
  TICK_FONT_SIZE,
} from "../core/theme";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
} from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { YGrid } from "../render/y-grid";
import {
  ANNOTATION_LABEL_DX,
  ANNOTATION_LABEL_DY,
  AXIS_LABEL_OFFSET,
  buildLollipopPoints,
  buildLollipopValueAxis,
  LOLLIPOP_RADIUS,
  orderLollipopGroups,
  resolveLollipopFill,
  resolveLollipopRadius,
  STEM_OPACITY,
  VALUE_LABEL_DY,
} from "./lollipop-chart.compute";
import type { LollipopChartProps } from "./lollipop-chart.types";

export type { LollipopChartProps } from "./lollipop-chart.types";

/**
 * Paleta SSR (puntos sobre palos): una serie con valores rotulados.
 * Soporta negativos (dominio con cero, tallo desde la línea de cero).
 */
export function LollipopChart({
  data,
  xKey,
  yKey,
  ariaLabel,
  height = 260,
  formatY,
  color,
  itemColor,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  stemStyle = "solid",
  sortGroups = "none",
  showValues = true,
  pointRadius = LOLLIPOP_RADIUS,
  gridTicks = GRID_TICKS,
  yMin,
  yMax,
}: LollipopChartProps) {
  if (isBlank(data)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const ordered = orderLollipopGroups(data, yKey, sortGroups);

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const { lo, hi, y, ticks, fmtY } = buildLollipopValueAxis(
    ordered,
    yKey,
    formatY,
    locale,
    innerH,
    { gridTicks, yMin, yMax },
  );
  const y0 = y(0);
  const x = buildLollipopPoints(ordered, xKey, innerW);
  const fill = resolveLollipopFill(color);
  const dotR = resolveLollipopRadius(pointRadius);

  return (
    <ChartSvg
      width={W}
      height={height}
      ariaLabel={ariaLabel}
      className={className ? `h-auto w-full ${className}` : undefined}
      style={style}
      ariaDescribedBy={ariaDescribedBy}
    >
      <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmtY} />
      {(annotations ?? []).map((a, ai) => {
        if (a.value < lo || a.value > hi) return null;
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
      {ordered.map((d, di) => {
        const group = String(d[xKey] ?? "");
        const value = toNumber(d[yKey]);
        const cx = MARGIN.left + (x(group) ?? 0);
        const tip = `${group}: ${fmtY(value)}`;
        const c = itemColor?.(d, di) ?? fill;
        return (
          <g key={stableKey([group], di)}>
            <line
              x1={cx}
              x2={cx}
              y1={MARGIN.top + y0}
              y2={MARGIN.top + y(value)}
              stroke={c}
              strokeWidth={LINE_WIDTH}
              strokeOpacity={STEM_OPACITY}
              strokeDasharray={
                stemStyle === "dashed" ? ANNOTATION_DASH : undefined
              }
            />
            <circle
              cx={cx}
              cy={MARGIN.top + y(value)}
              r={dotR}
              fill={c}
              stroke={CHART_TOKEN.background}
              strokeWidth={NODE_BORDER_WIDTH}
              data-chart-tip={tip}
            />
            {showValues ? (
              <text
                x={cx}
                y={MARGIN.top + y(value) - VALUE_LABEL_DY}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {fmtY(value)}
              </text>
            ) : null}
            <text
              x={cx}
              y={height - AXIS_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
              data-chart-tip={group}
            >
              {truncateLabel(group)}
            </text>
          </g>
        );
      })}
    </ChartSvg>
  );
}
