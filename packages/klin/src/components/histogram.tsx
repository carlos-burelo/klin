/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { bin, extent, quantileSorted } from "d3-array";
import { scaleLinear } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { topPositive } from "../lib/domain";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
import { sumNumbers, toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  AREA_FILL_OPACITY,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  MIN_SHAPE_PX,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { pctOf } from "../lib/tips";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { kdeOf } from "./violin-plot";

/** Props de Histogram. */
export type HistogramProps = {
  values: number[];
  ariaLabel: string;
  bins?: number;
  height?: number;
  format?: ValueFormatter;
  color?: string;
  locale?: string;
  /** Dibuja las líneas de media y mediana con su valor. */
  showMean?: boolean;
  /** Curva de densidad KDE sobre las cubetas (reusa la KDE de ViolinPlot). */
  showCurve?: boolean;
  /** Ancho de banda KDE (`auto` = Silverman). */
  bandwidth?: "auto" | number;
  /** Recorta los valores a [mínimo, máximo] (outliers fuera). */
  domain?: [number, number];
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
const MEAN_LABEL_DX = 4;
const MEAN_LABEL_DY = 12;

/**
 * Histograma SSR (distribuciones). Cubetas con `d3.bin`.
 * Filtra no-finitos; el eje X admite negativos, el Y usa tope positivo.
 */
export function Histogram({
  values,
  ariaLabel,
  bins = 12,
  height = 240,
  format,
  color,
  locale = DEFAULT_LOCALE,
  showMean = false,
  showCurve = false,
  bandwidth = "auto",
  domain,
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
  const clipLo =
    domain === undefined ? Number.NaN : toNumber(domain[0], Number.NaN);
  const clipHi =
    domain === undefined ? Number.NaN : toNumber(domain[1], Number.NaN);
  const hasClip =
    Number.isFinite(clipLo) && Number.isFinite(clipHi) && clipLo < clipHi;
  const scoped =
    hasClip && domain !== undefined
      ? clean.filter((v) => v >= clipLo && v <= clipHi)
      : clean;
  if (isBlank(scoped)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const [lo, hi] = extent(scoped);
  const binDomain: [number, number] =
    hasClip && domain !== undefined
      ? [clipLo, clipHi]
      : lo === undefined || hi === undefined || lo === hi
        ? [Math.min(0, lo ?? 0), Math.max(1, hi ?? 1)]
        : [lo, hi];

  const buckets = bin().domain(binDomain).thresholds(bins)(scoped);
  const top = topPositive(buckets.map((b) => b.length));

  const x = scaleLinear().domain(binDomain).range([0, innerW]);
  const y = scaleLinear().domain([0, top]).nice(GRID_TICKS).range([innerH, 0]);
  const ticks = y.ticks(GRID_TICKS);
  const fill = seriesColor(2, color);
  const total = scoped.length;
  const fmtTick = resolveFormatter(format, locale);
  const mean = sumNumbers(scoped) / scoped.length;
  const median =
    quantileSorted(
      [...scoped].sort((a, b) => a - b),
      0.5,
    ) ??
    scoped[0] ??
    0;
  const meanInRange = mean >= binDomain[0] && mean <= binDomain[1];
  const medianInRange = median >= binDomain[0] && median <= binDomain[1];
  const given = bandwidth === "auto" ? 0 : toNumber(bandwidth);
  const kde = showCurve ? kdeOf(scoped, given, binDomain[0], binDomain[1]) : [];
  // La rejilla KDE es uniforme: conteo ≈ densidad · n · ancho de paso.
  const kdeStep =
    kde.length > 1
      ? (binDomain[1] - binDomain[0]) / (kde.length - 1)
      : binDomain[1] - binDomain[0];
  const kdeCount = (density: number) => density * scoped.length * kdeStep;
  // La curva nunca sale del lienzo: se fija al tope del dominio Y.
  const kdeY = (density: number) =>
    y(Math.min(Math.max(0, kdeCount(density)), top));
  const curvePath =
    kde.length > 0
      ? (line<{ value: number; density: number }>()
          .x((p) => MARGIN.left + x(p.value))
          .y((p) => kdeY(p.density))
          .curve(curveMonotoneX)(kde) ?? "")
      : "";
  const curveArea =
    kde.length > 0
      ? (area<{ value: number; density: number }>()
          .x((p) => MARGIN.left + x(p.value))
          .y0(() => MARGIN.top + innerH)
          .y1((p) => kdeY(p.density))
          .curve(curveMonotoneX)(kde) ?? "")
      : "";

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
        const tip = `${fmtTick(b.x0 ?? 0)} – ${fmtTick(b.x1 ?? 0)}: ${b.length} (${pctOf(b.length, total)}% · ${total} total)`;
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
      {showCurve && kde.length > 0 ? (
        <g>
          <title>Densidad estimada (KDE)</title>
          <path d={curveArea} fill={fill} opacity={AREA_FILL_OPACITY} />
          <path
            d={curvePath}
            fill="none"
            stroke={fill}
            strokeWidth={LINE_WIDTH}
            strokeLinecap="round"
          />
        </g>
      ) : null}
      {showMean && meanInRange ? (
        <g>
          <title>{`media ${fmtTick(mean)}`}</title>
          <line
            x1={MARGIN.left + x(mean)}
            x2={MARGIN.left + x(mean)}
            y1={MARGIN.top}
            y2={MARGIN.top + innerH}
            stroke={CHART_TOKEN.accent}
            strokeWidth={ANNOTATION_WIDTH}
            strokeDasharray={ANNOTATION_DASH}
          />
          <text
            x={MARGIN.left + x(mean) + MEAN_LABEL_DX}
            y={MARGIN.top + MEAN_LABEL_DY}
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.accent}
          >
            {`media ${fmtTick(mean)}`}
          </text>
        </g>
      ) : null}
      {showMean && medianInRange ? (
        <g>
          <title>{`mediana ${fmtTick(median)}`}</title>
          <line
            x1={MARGIN.left + x(median)}
            x2={MARGIN.left + x(median)}
            y1={MARGIN.top}
            y2={MARGIN.top + innerH}
            stroke={CHART_TOKEN.foreground}
            strokeWidth={ANNOTATION_WIDTH}
            strokeDasharray={ANNOTATION_DASH}
          />
          <text
            x={MARGIN.left + x(median) + MEAN_LABEL_DX}
            y={MARGIN.top + MEAN_LABEL_DY * 2}
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.foreground}
          >
            {`mediana ${fmtTick(median)}`}
          </text>
        </g>
      ) : null}
      <text
        x={MARGIN.left + innerW / 2}
        y={height - AXIS_LABEL_OFFSET}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fill={CHART_TOKEN.muted}
      >
        {`${total} valores en ${buckets.length} intervalos`}
      </text>
    </ChartSvg>
  );
}
