/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../core/theme";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  AXIS_TICK_OFFSET,
  buildRidgelineScale,
  buildRidgePath,
  cleanRidgelineRows,
  MARGIN,
  normalizeRidgelineDotR,
  normalizeRidgelineOverlap,
  normalizeRidgelineTicks,
  orderRidgelineRows,
  RIDGE_FILL_OPACITY,
  RIDGE_LABEL_W,
  RIDGE_OVERLAP_DEFAULT,
  RIDGE_PEAK_FRAC,
  resolveRidgelineDomain,
  resolveRidgelineHeight,
  resolveRidgelineRows,
  ridgePoints,
  TICK_MARK_H,
  W,
} from "./ridgeline-plot.compute";
import type { RidgelinePlotProps } from "./ridgeline-plot.types";

export type {
  RidgelinePlotProps,
  RidgelineSeries,
  RidgelineSort,
} from "./ridgeline-plot.types";

/**
 * Crestas SSR (una densidad por fila, misma KDE que el violín).
 * Filas apiladas con solape, eje X común abajo. Filtra no-finitos.
 */
export function RidgelinePlot({
  series,
  ariaLabel,
  height = 260,
  overlap = RIDGE_OVERLAP_DEFAULT,
  formatX,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  gridTicks = GRID_TICKS,
  sortGroups = "none",
  pointRadius = POINT_RADIUS,
  showSampleSize = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: RidgelinePlotProps) {
  const safeH = resolveRidgelineHeight(height);
  const base = cleanRidgelineRows(series);
  if (base.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const plotX0 = RIDGE_LABEL_W;
  const plotW = W - RIDGE_LABEL_W - MARGIN.right;
  const innerH = safeH - MARGIN.top - MARGIN.bottom;
  const { glo, ghi } = resolveRidgelineDomain(base);
  const fmtX = resolveFormatter(formatX, locale);
  const safeTicks = normalizeRidgelineTicks(gridTicks);
  const dotR = normalizeRidgelineDotR(pointRadius);
  const { x, ticks } = buildRidgelineScale(glo, ghi, safeTicks, plotW);
  const ordered = orderRidgelineRows(base, sortGroups, glo, ghi);
  const ov = normalizeRidgelineOverlap(overlap);
  const n = ordered.length;
  const { rowH, step } = resolveRidgelineRows(innerH, n, ov);
  const axisY = MARGIN.top + innerH;

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={safeH}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <line
          x1={plotX0}
          x2={W - MARGIN.right}
          y1={axisY}
          y2={axisY}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
        />
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={plotX0 + x(t)}
              x2={plotX0 + x(t)}
              y1={axisY}
              y2={axisY + TICK_MARK_H}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={plotX0 + x(t)}
              y={axisY + AXIS_TICK_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtX(t)}
            </text>
          </g>
        ))}
        {ordered.map(({ entry, clean, oi, peak }, ri) => {
          const baseY = MARGIN.top + rowH + ri * step;
          const color = seriesColor(oi, entry.color);
          const ridge = buildRidgePath(
            ridgePoints(clean, glo, ghi),
            plotX0,
            x,
            baseY,
            rowH,
          );
          const tip = `${entry.label}: n ${clean.length} · pico en ${fmtX(peak)}`;
          return (
            <g key={stableKey([entry.label], ri)}>
              <text
                x={plotX0 - TICK_GAP_PX}
                y={baseY - rowH / 2}
                dy={TICK_GAP_PX / 2}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={entry.label}
              >
                {showSampleSize
                  ? `${truncateLabel(entry.label)} (n ${clean.length})`
                  : truncateLabel(entry.label)}
              </text>
              <path
                d={ridge}
                fill={color}
                fillOpacity={RIDGE_FILL_OPACITY}
                stroke={color}
                strokeWidth={LINE_WIDTH}
                strokeLinejoin="round"
                data-chart-tip={tip}
              />
              <circle
                cx={plotX0 + x(peak)}
                cy={baseY - rowH * RIDGE_PEAK_FRAC}
                r={dotR}
                fill={CHART_TOKEN.background}
                stroke={color}
                strokeWidth={POINT_BORDER}
              />
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={ordered.map(({ entry, oi }) => ({
            label: entry.label,
            color: seriesColor(oi, entry.color),
          }))}
        />
      ) : null}
    </div>
  );
}
