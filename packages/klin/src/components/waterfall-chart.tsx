/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  GRID_TICKS,
  GRID_WIDTH,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../core/theme";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { YGrid } from "../render/y-grid";
import {
  ANNOTATION_LABEL_DX,
  ANNOTATION_LABEL_DY,
  AXIS_LABEL_OFFSET,
  buildWaterfallFloats,
  buildWaterfallLabelsWithSubtotals,
  buildWaterfallScales,
  CONNECTOR_DASH,
  resolveWaterfallColors,
  resolveWaterfallDomain,
  resolveWaterfallSubtotalIndices,
  VALUE_LABEL_DY,
  waterfallSubtotalLabel,
} from "./waterfall-chart.compute";
import type { WaterfallChartProps } from "./waterfall-chart.types";

export type { WaterfallFloat } from "./waterfall-chart.compute";
export {
  ANNOTATION_LABEL_DX,
  ANNOTATION_LABEL_DY,
  AXIS_LABEL_OFFSET,
  buildWaterfallFloats,
  buildWaterfallLabels,
  buildWaterfallLabelsWithSubtotals,
  buildWaterfallScales,
  CONNECTOR_DASH,
  DOWN,
  GROUP_BAND_PADDING,
  resolveWaterfallColors,
  resolveWaterfallDomain,
  resolveWaterfallSubtotalIndices,
  TOTAL,
  UP,
  VALUE_LABEL_DY,
  waterfallSubtotalLabel,
} from "./waterfall-chart.compute";
export type {
  WaterfallChartProps,
  WaterfallStep,
} from "./waterfall-chart.types";

const W = 640;
const MARGIN = { top: 28, right: 12, bottom: 32, left: 48 };

/**
 * Cascada SSR (acumulado por deltas + total). Subidas, bajadas y conectores.
 * Soporta negativos; no-finitos cuentan como 0.
 */
export function WaterfallChart({
  steps,
  ariaLabel,
  height = 280,
  totalLabel = "Total",
  formatY,
  formatValues,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  annotations,
  showConnectors = true,
  showValues = true,
  gridTicks = GRID_TICKS,
  yMin,
  yMax,
  subtotalAt,
  positiveColor,
  negativeColor,
  totalColor,
  runningTotal = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: WaterfallChartProps) {
  if (isBlank(steps)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const { floats, total } = buildWaterfallFloats(steps);
  const { lo: autoLo, hi: autoHi } = resolveWaterfallDomain(floats);
  const lo = yMin === undefined ? autoLo : toNumber(yMin, autoLo);
  const hi = yMax === undefined ? autoHi : toNumber(yMax, autoHi);
  const ticksCount = Math.max(1, Math.round(toNumber(gridTicks, GRID_TICKS)));
  const subIndices = resolveWaterfallSubtotalIndices(subtotalAt, floats.length);
  const subSet = new Set(subIndices);

  const labels = buildWaterfallLabelsWithSubtotals(
    floats,
    totalLabel,
    subIndices,
  );
  const { y, x, ticks, bw } = buildWaterfallScales(
    labels,
    lo,
    hi,
    innerW,
    innerH,
    ticksCount,
  );
  const fmtY = resolveFormatter(formatY, locale);
  const fmtV = formatValues ? resolveFormatter(formatValues, locale) : fmtY;
  const { upColor, downColor, grandColor } = resolveWaterfallColors(
    positiveColor,
    negativeColor,
    totalColor,
  );

  const bar = (
    key: string,
    label: string,
    from: number,
    to: number,
    color: string,
    tip: string,
    dashed: boolean,
    nextLabel?: string,
  ) => {
    const yTop = y(Math.max(from, to));
    const yBase = y(Math.min(from, to));
    return (
      <g key={key}>
        <rect
          x={MARGIN.left + (x(label) ?? 0)}
          y={MARGIN.top + yTop}
          width={bw}
          height={Math.max(ZERO_MARK_PX, yBase - yTop)}
          rx={BAR_RADIUS}
          fill={color}
          data-chart-tip={tip}
        />
        {showValues ? (
          <text
            x={MARGIN.left + (x(label) ?? 0) + bw / 2}
            y={MARGIN.top + yTop - VALUE_LABEL_DY}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fontWeight={FONT_SEMIBOLD}
            fill={CHART_TOKEN.foreground}
          >
            {runningTotal ? fmtV(to) : fmtV(to - from)}
          </text>
        ) : null}
        {showConnectors && dashed && nextLabel ? (
          <line
            x1={MARGIN.left + (x(label) ?? 0) + bw}
            x2={MARGIN.left + (x(nextLabel) ?? 0)}
            y1={MARGIN.top + y(to)}
            y2={MARGIN.top + y(to)}
            stroke={CHART_TOKEN.muted}
            strokeWidth={GRID_WIDTH}
            strokeDasharray={CONNECTOR_DASH}
          />
        ) : null}
      </g>
    );
  };

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
      {floats.map((f, i) => {
        const subLabel = subSet.has(i)
          ? waterfallSubtotalLabel(f.label)
          : undefined;
        const nextLabel = subLabel ?? floats[i + 1]?.label ?? totalLabel;
        return (
          <g key={stableKey([f.label], i)}>
            {bar(
              stableKey([f.label], i),
              f.label,
              f.from,
              f.to,
              f.value >= 0 ? upColor : downColor,
              `${f.label}: ${f.value >= 0 ? "+" : ""}${fmtY(f.value)} (acumulado ${fmtY(f.to)})`,
              true,
              nextLabel,
            )}
            <text
              x={MARGIN.left + (x(f.label) ?? 0) + bw / 2}
              y={height - AXIS_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
              data-chart-tip={f.label}
            >
              {truncateLabel(f.label)}
            </text>
            {subLabel ? (
              <g key={stableKey([subLabel], i)}>
                {bar(
                  stableKey([subLabel], i),
                  subLabel,
                  0,
                  f.to,
                  grandColor,
                  `${subLabel}: ${fmtY(f.to)}`,
                  true,
                  floats[i + 1]?.label ?? totalLabel,
                )}
                <text
                  x={MARGIN.left + (x(subLabel) ?? 0) + bw / 2}
                  y={height - AXIS_LABEL_OFFSET}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                  data-chart-tip={subLabel}
                >
                  {truncateLabel(subLabel)}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
      {bar(
        stableKey([totalLabel], floats.length),
        totalLabel,
        0,
        total,
        grandColor,
        `${totalLabel}: ${fmtY(total)}`,
        false,
      )}
      <text
        x={MARGIN.left + (x(totalLabel) ?? 0) + bw / 2}
        y={height - AXIS_LABEL_OFFSET}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fill={CHART_TOKEN.muted}
      >
        {totalLabel}
      </text>
    </ChartSvg>
  );
}
