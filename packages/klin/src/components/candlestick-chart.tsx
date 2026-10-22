/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand, scaleLinear } from "d3-scale";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
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
  buildCandles,
  CANDLE_BAND_PADDING,
  CANDLE_MAX_WIDTH,
  candleDomain,
  orderCandles,
  resolveCandleRadius,
  resolveCandleTicks,
  VALUE_LABEL_GAP,
} from "./candlestick-chart.compute";
import type { CandlestickChartProps } from "./candlestick-chart.types";

export type { Candle } from "./candlestick-chart.compute";
export type {
  CandleSort,
  CandlestickChartProps,
} from "./candlestick-chart.types";

/**
 * Velas OHLC SSR (mecha high-low + cuerpo open-close).
 * Alcista (close >= open) en chart1, bajista en destructive.
 * Filtra filas no-finitas; tope en DEFAULT_MAX_ROWS.
 */
export function CandlestickChart({
  data,
  labelKey,
  openKey,
  highKey,
  lowKey,
  closeKey,
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
  sortGroups = "none",
  barRadius = BAR_RADIUS,
  bullColor = CHART_TOKEN.chart1,
  bearColor = CHART_TOKEN.destructive,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: CandlestickChartProps) {
  const computed = buildCandles(
    data,
    labelKey,
    openKey,
    highKey,
    lowKey,
    closeKey,
  );
  if (isBlank(computed)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const ordered = orderCandles(computed, sortGroups);

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const { blo, bhi } = candleDomain(ordered, yMin, yMax);
  const fmtY = resolveFormatter(formatY, locale);
  const safeTicks = resolveCandleTicks(gridTicks);
  const y = scaleLinear().domain([blo, bhi]).nice(safeTicks).range([innerH, 0]);
  const x = scaleBand()
    .domain(ordered.map((c) => c.label))
    .range([0, innerW])
    .padding(CANDLE_BAND_PADDING);
  const ticks = y.ticks(safeTicks);
  const bodyW = Math.min(CANDLE_MAX_WIDTH, x.bandwidth());
  const bodyRx = resolveCandleRadius(barRadius);

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
        {ordered.map((c, ci) => {
          const cx = MARGIN.left + (x(c.label) ?? 0) + x.bandwidth() / 2;
          const bullish = c.close >= c.open;
          const color = bullish ? bullColor : bearColor;
          const top = Math.min(y(c.open), y(c.close));
          const tip =
            `${c.label}: O ${fmtY(c.open)} · H ${fmtY(c.high)} · ` +
            `L ${fmtY(c.low)} · C ${fmtY(c.close)}`;
          return (
            <g key={stableKey([c.label], ci)}>
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
              />
              <rect
                x={cx - bodyW / 2}
                y={MARGIN.top + top}
                width={bodyW}
                height={Math.max(
                  ZERO_MARK_PX,
                  Math.abs(y(c.open) - y(c.close)),
                )}
                rx={bodyRx}
                fill={color}
                data-chart-tip={tip}
              />
              {showValues ? (
                <text
                  x={cx}
                  y={MARGIN.top + y(c.high) - VALUE_LABEL_GAP}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.foreground}
                >
                  {fmtY(c.close)}
                </text>
              ) : null}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Alcista", color: bullColor },
            { label: "Bajista", color: bearColor },
          ]}
        />
      ) : null}
    </div>
  );
}
