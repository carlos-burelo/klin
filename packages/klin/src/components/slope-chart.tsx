/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  LABEL_GAP_PX,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartSvg, CHART_W as W } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  computeSlopeModel,
  resolveSlopeColors,
  SLOPE_DOWN_SIGN,
  SLOPE_HEADER_Y,
  SLOPE_LABEL_MAX,
  SLOPE_MARGIN_LEFT,
  SLOPE_MARGIN_RIGHT,
  SLOPE_MARGIN_TOP,
  SLOPE_UP_SIGN,
  slopeRowColor,
} from "./slope-chart.compute";
import type { SlopeChartProps } from "./slope-chart.types";

export type { SlopeChartProps, SlopeDatum } from "./slope-chart.types";

/**
 * Pendientes SSR (dos ejes verticales con escala compartida; etiquetas
 * a la izquierda, valores a la derecha). Subida chart1, bajada
 * destructive, salvo color por fila. Filtra no-finitos.
 */
export function SlopeChart({
  data,
  fromLabel,
  toLabel,
  ariaLabel,
  height = 260,
  formatY,
  locale = DEFAULT_LOCALE,
  showLabels = true,
  showValues = true,
  showDelta = true,
  colorUp,
  colorDown,
  sortGroups = false,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: SlopeChartProps) {
  const { rows, ordered, fmtY, innerH, y } = computeSlopeModel({
    data,
    sortGroups,
    formatY,
    locale,
    height,
  });
  if (isBlank(rows)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const { up, down } = resolveSlopeColors(colorUp, colorDown);
  const lx = SLOPE_MARGIN_LEFT;
  const rx = W - SLOPE_MARGIN_RIGHT;

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <text
          x={lx}
          y={SLOPE_HEADER_Y}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fill={CHART_TOKEN.muted}
        >
          {truncateLabel(fromLabel)}
        </text>
        <text
          x={rx}
          y={SLOPE_HEADER_Y}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fill={CHART_TOKEN.muted}
        >
          {truncateLabel(toLabel)}
        </text>
        <line
          x1={lx}
          x2={lx}
          y1={SLOPE_MARGIN_TOP}
          y2={SLOPE_MARGIN_TOP + innerH}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
        />
        <line
          x1={rx}
          x2={rx}
          y1={SLOPE_MARGIN_TOP}
          y2={SLOPE_MARGIN_TOP + innerH}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
        />
        {ordered.map((row, i) => {
          const delta = row.to - row.from;
          const color = slopeRowColor(row, up, down);
          const sign = delta < 0 ? SLOPE_DOWN_SIGN : SLOPE_UP_SIGN;
          const tip = showDelta
            ? `${row.label}: ${fmtY(row.from)} → ${fmtY(row.to)} ` +
              `(Δ ${sign}${fmtY(Math.abs(delta))})`
            : `${row.label}: ${fmtY(row.from)} → ${fmtY(row.to)}`;
          const y1 = SLOPE_MARGIN_TOP + y(row.from);
          const y2 = SLOPE_MARGIN_TOP + y(row.to);
          return (
            <g key={stableKey([row.label], i)}>
              <line
                x1={lx}
                x2={rx}
                y1={y1}
                y2={y2}
                stroke={color}
                strokeWidth={LINE_WIDTH}
                strokeLinecap="round"
              />
              <circle
                cx={lx}
                cy={y1}
                r={POINT_RADIUS}
                fill={color}
                stroke={CHART_TOKEN.background}
                strokeWidth={POINT_BORDER}
                data-chart-tip={tip}
              />
              <circle
                cx={rx}
                cy={y2}
                r={POINT_RADIUS}
                fill={color}
                stroke={CHART_TOKEN.background}
                strokeWidth={POINT_BORDER}
                data-chart-tip={tip}
              />
              {showLabels ? (
                <text
                  x={lx - LABEL_GAP_PX}
                  y={y1}
                  dy={TICK_DY}
                  textAnchor="end"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.foreground}
                >
                  {truncateLabel(row.label, SLOPE_LABEL_MAX)}
                </text>
              ) : null}
              {showValues ? (
                <text
                  x={rx + LABEL_GAP_PX}
                  y={y2}
                  dy={TICK_DY}
                  textAnchor="start"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {fmtY(row.to)}
                </text>
              ) : null}
            </g>
          );
        })}
      </ChartSvg>
    </div>
  );
}
