/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { kdeOf } from "../core/kde";
import { toNumber } from "../core/number";
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
} from "../core/theme";
import { pctOf } from "../core/tips";
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
  BUCKET_INSET_PX,
  buildHistogramBins,
  buildHistogramKdePaths,
  buildHistogramScales,
  cleanHistogramValues,
  computeHistogramStats,
  histogramKdeStep,
  MEAN_LABEL_DX,
  MEAN_LABEL_DY,
  resolveHistogramBinDomain,
  resolveHistogramScope,
} from "./histogram.compute";
import type { HistogramProps } from "./histogram.types";

export type { HistogramKdePoint } from "./histogram.compute";
export {
  ANNOTATION_LABEL_DX,
  ANNOTATION_LABEL_DY,
  AXIS_LABEL_OFFSET,
  BUCKET_INSET_PX,
  buildHistogramBins,
  buildHistogramKdePaths,
  buildHistogramScales,
  cleanHistogramValues,
  computeHistogramStats,
  histogramKdeStep,
  MEAN_LABEL_DX,
  MEAN_LABEL_DY,
  resolveHistogramBinDomain,
  resolveHistogramScope,
} from "./histogram.compute";
export type { HistogramBinStrategy, HistogramProps } from "./histogram.types";

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
  showMedian,
  showCurve = false,
  bandwidth = "auto",
  domain,
  className,
  style,
  ariaDescribedBy,
  annotations,
  gridTicks = GRID_TICKS,
  binStrategy,
  normalize = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: HistogramProps) {
  const clean = cleanHistogramValues(values);
  const { clipLo, clipHi, hasClip, scoped } = resolveHistogramScope(
    clean,
    domain,
  );
  if (isBlank(scoped)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const binDomain = resolveHistogramBinDomain(
    scoped,
    domain,
    clipLo,
    clipHi,
    hasClip,
  );

  const { total, mean, median } = computeHistogramStats(scoped);
  const buckets = buildHistogramBins(scoped, binDomain, bins, binStrategy);
  const { top, x, y, ticks } = buildHistogramScales(
    binDomain,
    buckets,
    innerW,
    innerH,
    gridTicks,
    normalize,
    total,
  );
  const fill = seriesColor(2, color);
  // La mediana sigue a `showMean` salvo override explícito (paridad con el
  // comportamiento anterior, donde una sola prop controlaba ambas líneas).
  const showMedianLine = showMedian ?? showMean;
  const fmtTick = resolveFormatter(format, locale);
  const fmtY = normalize ? (v: number) => `${fmtTick(v)}%` : fmtTick;
  const meanInRange = mean >= binDomain[0] && mean <= binDomain[1];
  const medianInRange = median >= binDomain[0] && median <= binDomain[1];
  const given = bandwidth === "auto" ? 0 : toNumber(bandwidth);
  const kde = showCurve ? kdeOf(scoped, given, binDomain[0], binDomain[1]) : [];
  const kdeStep = histogramKdeStep(binDomain, kde.length);
  const { curvePath, curveArea } = buildHistogramKdePaths(
    kde,
    x,
    y,
    top,
    scoped.length,
    kdeStep,
    MARGIN.left,
    MARGIN.top,
    innerH,
    normalize,
    total,
  );

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
        if (a.value < 0 || a.value > top) return null;
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
      {buckets.map((b, i) => {
        const bx = MARGIN.left + (x(b.x0 ?? 0) + BUCKET_INSET_PX);
        const bw = Math.max(
          MIN_SHAPE_PX,
          x(b.x1 ?? 0) - x(b.x0 ?? 0) - BUCKET_INSET_PX * 2,
        );
        const magnitude =
          normalize && total > 0 ? (b.length / total) * 100 : b.length;
        const tip = `${fmtTick(b.x0 ?? 0)} – ${fmtTick(b.x1 ?? 0)}: ${b.length} (${pctOf(b.length, total)}% · ${total} total)`;
        return (
          <g key={`${b.x0}-${b.x1}__${i}`}>
            <rect
              x={bx}
              y={MARGIN.top + y(magnitude)}
              width={bw}
              height={Math.max(MIN_SHAPE_PX, innerH - y(magnitude))}
              rx={BAR_RADIUS}
              fill={fill}
              data-chart-tip={tip}
            />
          </g>
        );
      })}
      {showCurve && kde.length > 0 ? (
        <g data-chart-tip="Densidad estimada (KDE)">
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
        <g data-chart-tip={`media ${fmtTick(mean)}`}>
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
      {showMedianLine && medianInRange ? (
        <g data-chart-tip={`mediana ${fmtTick(median)}`}>
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
