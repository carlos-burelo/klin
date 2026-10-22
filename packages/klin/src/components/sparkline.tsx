/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { formatDefault } from "../core/format";
import { stableKey } from "../core/keys";

import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  MIN_SHAPE_PX,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  computeSparklineModel,
  SPARK_END_DOT_R,
  SPARK_LINE_WIDTH,
  SPARK_PAD,
} from "./sparkline.compute";
import type { SparklineProps } from "./sparkline.types";

export type { SparklineProps } from "./sparkline.types";

/**
 * Minigráfica SSR para celdas de tabla y KPIs (sin ejes).
 */
export function Sparkline({
  values,
  ariaLabel,
  kind = "line",
  showLastDot = true,
  showMinMax = false,
  reference,
  width = 120,
  height = 36,
  color,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: SparklineProps) {
  if (values.length < 2) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const {
    counts,
    x,
    y,
    stroke,
    linePath,
    areaPath,
    last,
    tip,
    maxIdx,
    extremeIdx,
    showRef,
    refY,
    refTip,
    barW,
    isBar,
    areaOpacity,
  } = computeSparklineModel(
    values,
    width,
    height,
    kind,
    reference,
    color,
    ariaLabel,
    locale,
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className ? `h-auto ${className}` : "h-auto"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {isBar ? (
        <g>
          {counts.map((v, i) => {
            const bx = x(i) - barW / 2;
            const by = y(v);
            const bh = Math.max(MIN_SHAPE_PX, height - by);
            const barTip = formatDefault(v, locale);
            return (
              <g key={stableKey(["barra", v], i)}>
                <rect
                  x={bx}
                  y={by}
                  width={barW}
                  height={bh}
                  rx={BAR_RADIUS}
                  fill={stroke}
                  data-chart-tip={
                    i === counts.length - 1 && !showLastDot ? tip : barTip
                  }
                />
              </g>
            );
          })}
        </g>
      ) : (
        <>
          <path d={areaPath} fill={stroke} opacity={areaOpacity} />
          <path
            d={linePath}
            fill="none"
            stroke={stroke}
            strokeWidth={SPARK_LINE_WIDTH}
            strokeLinecap="round"
            data-chart-tip={showLastDot ? undefined : tip}
          />
        </>
      )}
      {showRef ? (
        <line
          x1={SPARK_PAD}
          x2={width - SPARK_PAD}
          y1={refY}
          y2={refY}
          stroke={CHART_TOKEN.muted}
          strokeWidth={ANNOTATION_WIDTH}
          strokeDasharray={ANNOTATION_DASH}
          data-chart-tip={refTip}
        />
      ) : null}
      {showMinMax
        ? extremeIdx.map((i) => {
            const v = counts[i] ?? 0;
            const isMax = i === maxIdx;
            const mmTip = `${isMax ? "Máx" : "Mín"}: ${formatDefault(v, locale)}`;
            return (
              <g key={stableKey(["extremo", v], i)}>
                <circle
                  cx={x(i)}
                  cy={y(v)}
                  r={SPARK_END_DOT_R}
                  fill={isMax ? stroke : CHART_TOKEN.muted}
                  data-chart-tip={mmTip}
                />
              </g>
            );
          })
        : null}
      {showLastDot ? (
        <circle
          cx={x(counts.length - 1)}
          cy={y(last)}
          r={SPARK_END_DOT_R}
          fill={stroke}
          data-chart-tip={tip}
        />
      ) : null}
    </svg>
  );
}
