/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand, scaleLinear } from "d3-scale";
import { seriesColor } from "../core/color";
import { domainWithZero } from "../core/domain";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  GRID_TICKS,
  GRID_WIDTH,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../core/theme";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  buildDotRows,
  DOT_AXIS_LABEL_OFFSET,
  DOT_BAND_PADDING,
  DOT_LABEL_MAX,
  DOT_MARGIN,
  DOT_SORT_NONE,
  DOT_STEM_OPACITY,
  DOT_VALUE_GAP,
  DOT_W,
  resolveDotDomain,
  resolveDotRadius,
  resolveDotTicks,
} from "./dot-plot.compute";
import type { DotPlotProps } from "./dot-plot.types";

export type { DotPlotProps } from "./dot-plot.types";

/**
 * Puntos SSR horizontales estilo Cleveland (un punto por categoría sobre
 * eje X lineal honesto con cero + tallo tenue desde la línea de cero).
 * Soporta negativos; filtra no-finitos; tope DEFAULT_MAX_ROWS.
 */
export function DotPlot({
  data,
  categoryKey,
  valueKey,
  ariaLabel,
  height = 260,
  locale = DEFAULT_LOCALE,
  format,
  color,
  itemColor,
  className,
  style,
  ariaDescribedBy,
  annotations,
  showLabels = true,
  showValues = true,
  gridTicks = GRID_TICKS,
  sortBy = DOT_SORT_NONE,
  maxItems = DEFAULT_MAX_ROWS,
  pointRadius = POINT_RADIUS_SCATTER,
  xMin,
  xMax,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: DotPlotProps) {
  const safeTicks = resolveDotTicks(gridTicks);
  const computed = buildDotRows(data, categoryKey, valueKey, sortBy, maxItems);
  if (isBlank(computed)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = DOT_W - DOT_MARGIN.left - DOT_MARGIN.right;
  const innerH = height - DOT_MARGIN.top - DOT_MARGIN.bottom;
  const [autoLo, autoHi] = domainWithZero(computed.map((r) => r.value));
  const { lo, hi } = resolveDotDomain(autoLo, autoHi, xMin, xMax);
  const x = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(safeTicks)
    .range([0, innerW]);
  const y0 = scaleBand()
    .domain(computed.map((r) => r.label))
    .range([0, innerH])
    .padding(DOT_BAND_PADDING);
  const ticks = x.ticks(safeTicks);
  const fmt = resolveFormatter(format, locale);
  const fill = seriesColor(0, color);
  const dotR = resolveDotRadius(pointRadius);
  const x0 = DOT_MARGIN.left + x(Math.min(hi, Math.max(lo, 0)));

  return (
    <ChartSvg
      width={DOT_W}
      height={height}
      ariaLabel={ariaLabel}
      className={className ? `h-auto w-full ${className}` : undefined}
      style={style}
      ariaDescribedBy={ariaDescribedBy}
    >
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={DOT_MARGIN.left + x(t)}
            x2={DOT_MARGIN.left + x(t)}
            y1={DOT_MARGIN.top}
            y2={height - DOT_MARGIN.bottom}
            stroke={CHART_TOKEN.border}
            strokeWidth={GRID_WIDTH}
          />
          <text
            x={DOT_MARGIN.left + x(t)}
            y={height - DOT_AXIS_LABEL_OFFSET}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {fmt(t)}
          </text>
        </g>
      ))}
      {(annotations ?? []).map((a, ai) => {
        const clamped = Math.min(hi, Math.max(lo, toNumber(a.value)));
        const ax = DOT_MARGIN.left + x(clamped);
        const stroke = a.color ?? CHART_TOKEN.accent;
        return (
          <g
            key={stableKey([a.label ?? `${a.value}`], ai)}
            data-chart-tip={a.label ?? fmt(a.value)}
          >
            <line
              x1={ax}
              x2={ax}
              y1={DOT_MARGIN.top}
              y2={height - DOT_MARGIN.bottom}
              stroke={stroke}
              strokeWidth={ANNOTATION_WIDTH}
              strokeDasharray={ANNOTATION_DASH}
            />
            {a.label ? (
              <text
                x={ax + TICK_GAP_PX}
                y={DOT_MARGIN.top + TICK_GAP_PX}
                fontSize={TICK_FONT_SIZE}
                fill={stroke}
              >
                {a.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {computed.map((r, ri) => {
        const cy = DOT_MARGIN.top + (y0(r.label) ?? 0) + y0.bandwidth() / 2;
        const cx = DOT_MARGIN.left + x(r.value);
        const tip = `${r.label}: ${fmt(r.value)}`;
        const c = itemColor?.(r.datum, ri) ?? fill;
        const right = r.value >= 0;
        return (
          <g key={stableKey([r.label], ri)}>
            {showLabels ? (
              <text
                x={DOT_MARGIN.left - TICK_GAP_PX}
                y={cy}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={r.label}
              >
                {truncateLabel(r.label, DOT_LABEL_MAX)}
              </text>
            ) : null}
            <line
              x1={x0}
              x2={cx}
              y1={cy}
              y2={cy}
              stroke={c}
              strokeWidth={LINE_WIDTH}
              strokeOpacity={DOT_STEM_OPACITY}
            />
            <circle
              cx={cx}
              cy={cy}
              r={dotR}
              fill={c}
              stroke={CHART_TOKEN.background}
              strokeWidth={POINT_BORDER}
              data-chart-tip={tip}
            />
            {showValues ? (
              <text
                x={cx + (right ? DOT_VALUE_GAP : -DOT_VALUE_GAP)}
                y={cy}
                dy={TICK_DY}
                textAnchor={right ? "start" : "end"}
                fontSize={TICK_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {fmt(r.value)}
              </text>
            ) : null}
          </g>
        );
      })}
    </ChartSvg>
  );
}
