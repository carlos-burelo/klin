/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
} from "../core/theme";
import { pctOf, shareTip } from "../core/tips";
import { CartesianFrame } from "../render/cartesian-frame";
import { CHART_MARGIN as MARGIN, CHART_W as W } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { computeAreaModel } from "./area-chart.compute";
import type { AreaChartProps } from "./area-chart.types";

export type { AreaChartProps } from "./area-chart.types";

/**
 * Áreas SSR (superpuestas o apiladas). Eje X por categorías.
 * Soporta negativos en modo superpuesto; en apilado/normalizado los
 * negativos se clamp a 0 (no se apilan negativos).
 */
export function AreaChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  stacked = false,
  normalize = false,
  curve = "monotone",
  showPoints = true,
  connectNulls = false,
  fillOpacity,
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
}: AreaChartProps) {
  if (isBlank(data) || isBlank(series)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const {
    labels,
    stackedTotals,
    lo,
    hi,
    opacity,
    x,
    y,
    ticks,
    lv,
    fmtY,
    fmt,
    legendItems,
    seriesData,
  } = computeAreaModel({
    data,
    xKey,
    series,
    innerW,
    innerH,
    stacked,
    normalize,
    curve,
    fillOpacity,
    yMin,
    yMax,
    gridTicks,
    yScale,
    formatY,
    locale,
    showLegend,
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
      formatY={fmt}
      annotations={annotations}
      annLo={normalize ? 0 : lo}
      annHi={normalize ? 1 : hi}
      xLabels={labels.map((label) => ({ x: x(label) ?? 0, label }))}
      legendItems={legendItems}
    >
      {seriesData.map((sd) => (
        <g
          key={sd.key}
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
          data-chart-tip={`${sd.label}: total ${fmtY(sd.totalRaw)}`}
        >
          <path d={sd.areaPath} fill={sd.color} opacity={opacity} />
          <path
            d={sd.linePath}
            fill="none"
            stroke={sd.color}
            strokeWidth={LINE_WIDTH}
            strokeLinecap="round"
          />
          {showPoints
            ? sd.pts.map((p, pi) => {
                if (connectNulls && !Number.isFinite(p.value)) return null;
                const total = stackedTotals[pi] ?? 0;
                const tip = normalize
                  ? `${p.label} · ${sd.label}: ${fmtY(p.raw)} (${pctOf(Math.max(0, p.raw), total)}%)`
                  : stacked
                    ? shareTip({
                        label: p.label,
                        series: sd.label,
                        formatted: fmtY(p.raw),
                        value: Math.max(0, p.raw),
                        total,
                        multi: series.length >= 2,
                        of: "grupo",
                      })
                    : `${p.label} · ${sd.label}: ${fmtY(p.raw)}`;
                return (
                  <g key={stableKey([sd.key, p.label], pi)}>
                    <circle
                      cx={x(p.label) ?? 0}
                      cy={y(lv(p.base + p.value))}
                      r={POINT_RADIUS}
                      fill={sd.color}
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
