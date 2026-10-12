/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { bin, extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { topPositive } from "../lib/domain";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  GRID_TICKS,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Props de Histogram. */
export type HistogramProps = {
  values: number[];
  ariaLabel: string;
  bins?: number;
  height?: number;
  formatTick?: ValueFormatter;
  color?: string;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
};

const BUCKET_INSET_PX = 1;
const AXIS_LABEL_OFFSET = 10;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;

/**
 * Histograma SSR (distribuciones). Cubetas con `d3.bin`.
 * Filtra no-finitos; el eje X admite negativos, el Y usa tope positivo.
 */
export function Histogram({
  values,
  ariaLabel,
  bins = 12,
  height = 240,
  formatTick,
  color,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: HistogramProps) {
  const clean = values
    .map((v) => toNumber(v, Number.NaN))
    .filter((v) => Number.isFinite(v));
  if (clean.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const [lo, hi] = extent(clean);
  const domain: [number, number] =
    lo === undefined || hi === undefined || lo === hi
      ? [Math.min(0, lo ?? 0), Math.max(1, hi ?? 1)]
      : [lo, hi];

  const buckets = bin().domain(domain).thresholds(bins)(clean);
  const top = topPositive(buckets.map((b) => b.length));

  const x = scaleLinear().domain(domain).range([0, innerW]);
  const y = scaleLinear().domain([0, top]).nice(GRID_TICKS).range([innerH, 0]);
  const ticks = y.ticks(GRID_TICKS);
  const fill = seriesColor(2, color);
  const total = clean.length;
  const fmtTick = formatTick ?? ((v: number) => formatDefault(v, locale));

  return (
    <ChartSvg
      width={W}
      height={height}
      ariaLabel={ariaLabel}
      className={className ? `h-auto w-full ${className}` : undefined}
      style={style}
      ariaDescribedBy={ariaDescribedBy}
    >
      <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmtTick} />
      {(annotations ?? []).map((a, ai) => {
        if (a.value < 0 || a.value > top) return null;
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
      {buckets.map((b, i) => {
        const bx = MARGIN.left + (x(b.x0 ?? 0) + BUCKET_INSET_PX);
        const bw = Math.max(
          MIN_SHAPE_PX,
          x(b.x1 ?? 0) - x(b.x0 ?? 0) - BUCKET_INSET_PX * 2,
        );
        const tip = `${fmtTick(b.x0 ?? 0)} – ${fmtTick(b.x1 ?? 0)}: ${b.length} (${total > 0 ? Math.round((b.length / total) * PERCENT_FACTOR) : 0}% · ${total} total)`;
        return (
          <g key={`${b.x0}-${b.x1}__${i}`}>
            <title>{tip}</title>
            <rect
              x={bx}
              y={MARGIN.top + y(b.length)}
              width={bw}
              height={Math.max(MIN_SHAPE_PX, innerH - y(b.length))}
              rx={BAR_RADIUS}
              fill={fill}
              data-chart-tip={tip}
            />
          </g>
        );
      })}
      <text
        x={MARGIN.left + innerW / 2}
        y={height - AXIS_LABEL_OFFSET}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fill={CHART_TOKEN.muted}
      >
        {`${clean.length} valores en ${buckets.length} intervalos`}
      </text>
    </ChartSvg>
  );
}
