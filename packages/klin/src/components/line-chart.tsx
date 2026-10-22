/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import {
  AREA_FILL_OPACITY,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
} from "../core/theme";
import { shareTip } from "../core/tips";
import { CartesianFrame } from "../render/cartesian-frame";
import { CHART_MARGIN as MARGIN, CHART_W as W } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { computeLineModel } from "./line-chart.compute";
import type { LineChartProps } from "./line-chart.types";

export type { LineChartProps } from "./line-chart.types";

/**
 * Líneas SSR con puntos. Eje X por categorías (orden de `data`).
 * Soporta negativos y filtra no-finitos como 0 (con `connectNulls`
 * los salta uniendo vecinos).
 */
export function LineChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  curve = "monotone",
  showPoints = true,
  showArea = false,
  connectNulls = false,
  yMin,
  yMax,
  gridTicks = GRID_TICKS,
  yScale = "linear",
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: LineChartProps) {
  if (isBlank(data) || isBlank(series)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const {
    labels,
    lo,
    hi,
    y,
    x,
    ticks,
    fmtY,
    lv,
    colors,
    totals,
    legendItems,
    pathFor,
    areaFor,
  } = computeLineModel({
    data,
    xKey,
    series,
    innerW,
    innerH,
    gridTicks,
    formatY,
    locale,
    yMin,
    yMax,
    yScale,
    showLegend,
    curve,
    connectNulls,
  });

  return (
    <CartesianFrame
      height={height}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      className={className}
      style={style}
      ticks={ticks}
      y={y}
      formatY={fmtY}
      annotations={annotations}
      annLo={lo}
      annHi={hi}
      xLabels={labels.map((label) => ({ x: x(label) ?? 0, label }))}
      legendItems={legendItems}
    >
      {series.map((s, si) => (
        <g key={s.key}>
          {showArea ? (
            <path
              d={areaFor(s.key) ?? ""}
              transform={`translate(${MARGIN.left},${MARGIN.top})`}
              fill={colors[si] ?? CHART_TOKEN.chart1}
              opacity={AREA_FILL_OPACITY}
            />
          ) : null}
          <path
            d={pathFor(s.key) ?? ""}
            transform={`translate(${MARGIN.left},${MARGIN.top})`}
            fill="none"
            stroke={colors[si] ?? CHART_TOKEN.chart1}
            strokeWidth={LINE_WIDTH}
            strokeLinecap="round"
          />
          {showPoints
            ? data.map((d, di2) => {
                const label = String(d[xKey] ?? "");
                const value = connectNulls
                  ? toNumber(d[s.key], Number.NaN)
                  : toNumber(d[s.key]);
                if (connectNulls && !Number.isFinite(value)) return null;
                const total = totals[di2] ?? 0;
                const tip = shareTip({
                  label,
                  series: s.label,
                  formatted: fmtY(value),
                  value,
                  total,
                  multi: series.length >= 2,
                  of: "grupo",
                });
                return (
                  <g key={stableKey([s.key, label], di2)}>
                    <circle
                      cx={MARGIN.left + (x(label) ?? 0)}
                      cy={MARGIN.top + y(lv(value))}
                      r={POINT_RADIUS}
                      fill={colors[si] ?? CHART_TOKEN.chart1}
                      stroke={CHART_TOKEN.background}
                      strokeWidth={POINT_BORDER}
                      data-chart-tip={tip}
                    />
                  </g>
                );
              })
            : null}
        </g>
      ))}
    </CartesianFrame>
  );
}
