/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max, min } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  GRID_TICKS,
  LINE_WIDTH,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Orden de las velas por cierre (none conserva el orden de entrada). */
export type CandleSort = "none" | "asc" | "desc";

/** Props de CandlestickChart. */
export type CandlestickChartProps = {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  openKey: string;
  highKey: string;
  lowKey: string;
  closeKey: string;
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /** Mínimo fijo del dominio Y (indefinido = automático con cero). */
  yMin?: number;
  /** Máximo fijo del dominio Y (indefinido = automático). */
  yMax?: number;
  /** Ticks del grid horizontal (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Muestra el valor de cierre sobre cada vela. */
  showValues?: boolean;
  /** Orden de las velas por precio de cierre. */
  sortGroups?: CandleSort;
  /** Radio del cuerpo de la vela (por defecto BAR_RADIUS). */
  barRadius?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

const CANDLE_BAND_PADDING = 0.35;
const CANDLE_MAX_WIDTH = 28;
const TICKS_MIN = 1;
/** Separación entre la etiqueta de valor y el máximo de la vela. */
const VALUE_LABEL_GAP = 4;
const AXIS_LABEL_OFFSET = 10;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;

type Candle = {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

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
  locale = "es-MX",
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
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: CandlestickChartProps) {
  const computed: Candle[] = [];
  for (const d of data.slice(0, DEFAULT_MAX_ROWS)) {
    const open = toNumber(d[openKey], Number.NaN);
    const high = toNumber(d[highKey], Number.NaN);
    const low = toNumber(d[lowKey], Number.NaN);
    const close = toNumber(d[closeKey], Number.NaN);
    if (![open, high, low, close].every(Number.isFinite)) continue;
    computed.push({ label: String(d[labelKey] ?? ""), open, high, low, close });
  }
  if (computed.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const ordered =
    sortGroups === "none"
      ? computed
      : [...computed].sort((a, b) =>
          sortGroups === "asc" ? a.close - b.close : b.close - a.close,
        );

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const lows = ordered.map((c) => c.low);
  const highs = ordered.map((c) => c.high);
  const fixedLo = toNumber(yMin, Number.NaN);
  const fixedHi = toNumber(yMax, Number.NaN);
  const blo = Number.isFinite(fixedLo) ? fixedLo : (min(lows) ?? 0);
  const rawHi = Number.isFinite(fixedHi) ? fixedHi : (max(highs) ?? 1);
  const bhi = rawHi <= blo ? blo + 1 : rawHi;
  const fmtY = formatY ?? ((v: number) => formatDefault(v, locale));
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(gridTicks, GRID_TICKS)),
  );
  const y = scaleLinear().domain([blo, bhi]).nice(safeTicks).range([innerH, 0]);
  const x = scaleBand()
    .domain(ordered.map((c) => c.label))
    .range([0, innerW])
    .padding(CANDLE_BAND_PADDING);
  const ticks = y.ticks(safeTicks);
  const bodyW = Math.min(CANDLE_MAX_WIDTH, x.bandwidth());
  const bodyRx = Math.max(0, toNumber(barRadius, BAR_RADIUS));

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
            <g key={`ann-${a.value}-${ai}`}>
              <title>{a.label ?? String(a.value)}</title>
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
          const color = bullish ? CHART_TOKEN.chart1 : CHART_TOKEN.destructive;
          const top = Math.min(y(c.open), y(c.close));
          const tip =
            `${c.label}: O ${fmtY(c.open)} · H ${fmtY(c.high)} · ` +
            `L ${fmtY(c.low)} · C ${fmtY(c.close)}`;
          return (
            <g key={stableKey([c.label], ci)}>
              <title>{tip}</title>
              <text
                x={cx}
                y={height - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{c.label}</title>
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
            { label: "Alcista", color: CHART_TOKEN.chart1 },
            { label: "Bajista", color: CHART_TOKEN.destructive },
          ]}
        />
      ) : null}
    </div>
  );
}
