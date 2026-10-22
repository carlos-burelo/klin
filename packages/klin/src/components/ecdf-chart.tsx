/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColors } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import {
  ANNOTATION_DASH,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  PERCENT_FACTOR,
  POINT_BORDER,
  POINT_RADIUS,
} from "../core/theme";
import { CartesianFrame } from "../render/cartesian-frame";
import { CHART_MARGIN as MARGIN, CHART_W as W } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  buildEcdfPath,
  buildEcdfPoints,
  buildEcdfScales,
  cleanEcdfGroups,
  MEDIAN_P,
} from "./ecdf-chart.compute";
import type { ECDFChartProps } from "./ecdf-chart.types";

export type {
  EcdfCleanGroup,
  EcdfPoint,
  EcdfScales,
} from "./ecdf-chart.compute";
export {
  buildEcdfPath,
  buildEcdfPoints,
  buildEcdfScales,
  cleanEcdfGroups,
  MEDIAN_P,
  X_TICKS,
} from "./ecdf-chart.compute";
export type { ECDFChartProps, EcdfGroup } from "./ecdf-chart.types";

/**
 * Función de distribución empírica SSR (escalones 0–100 %).
 * Determinista; filtra no-finitos.
 */
export function ECDFChart({
  groups,
  ariaLabel,
  height = 260,
  formatX,
  formatY,
  locale = DEFAULT_LOCALE,
  showPoints = false,
  gridTicks = GRID_TICKS,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  showMedian = false,
  xMin,
  xMax,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ECDFChartProps) {
  const clean = cleanEcdfGroups(groups);
  if (isBlank(clean)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtX = resolveFormatter(formatX, locale);
  const fmtY = formatY ?? ((v: number) => `${Math.round(v * PERCENT_FACTOR)}%`);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const { x, y, ticks, xticks } = buildEcdfScales(
    clean,
    innerW,
    innerH,
    gridTicks,
    xMin,
    xMax,
  );
  const colors = seriesColors(clean.map((c) => ({ color: c.group.color })));
  const legendItems = showLegend
    ? clean.map((c, i) => ({
        label: c.group.label,
        color: colors[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;

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
      annLo={0}
      annHi={1}
      xLabels={xticks.map((t) => ({ x: x(t), label: fmtX(t) }))}
      legendItems={legendItems}
    >
      {showMedian ? (
        <g data-chart-tip={`mediana p ${fmtY(MEDIAN_P)}`}>
          <line
            x1={MARGIN.left}
            x2={W - MARGIN.right}
            y1={MARGIN.top + y(MEDIAN_P)}
            y2={MARGIN.top + y(MEDIAN_P)}
            stroke={CHART_TOKEN.muted}
            strokeWidth={LINE_WIDTH}
            strokeDasharray={ANNOTATION_DASH}
          />
        </g>
      ) : null}
      {clean.map((c, gi) => {
        const color = colors[gi] ?? CHART_TOKEN.chart1;
        const n = c.sorted.length;
        const pts = buildEcdfPoints(c.sorted);
        const d = buildEcdfPath(pts, x, y);
        return (
          <g
            key={stableKey([c.group.label], gi)}
            data-chart-tip={`${c.group.label}: n ${n}, mediana ${fmtX(c.sorted[Math.floor((n - 1) / 2)] ?? 0)}`}
          >
            <path
              d={d}
              transform={`translate(${MARGIN.left},${MARGIN.top})`}
              fill="none"
              stroke={color}
              strokeWidth={LINE_WIDTH}
              strokeLinecap="round"
            />
            {showPoints
              ? c.sorted.map((v, pi) => {
                  const p = (pi + 1) / n;
                  const tip = `${c.group.label} · ${fmtX(v)}: ${fmtY(p)}`;
                  return (
                    <g key={stableKey([c.group.label, String(pi)], pi)}>
                      <circle
                        cx={MARGIN.left + x(v)}
                        cy={MARGIN.top + y(p)}
                        r={POINT_RADIUS}
                        fill={color}
                        stroke={CHART_TOKEN.background}
                        strokeWidth={POINT_BORDER}
                        data-chart-tip={tip}
                      />
                    </g>
                  );
                })
              : null}
          </g>
        );
      })}
    </CartesianFrame>
  );
}
