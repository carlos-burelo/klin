/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { clamp01, toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  EDGE_LABEL_FONT_SIZE,
  FONT_SEMIBOLD,
  NODE_BORDER_WIDTH,
  NODE_RADIUS,
  PERCENT_FACTOR,
  POINT_BORDER,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  AXIS_LABEL_BOTTOM_PAD,
  computeQuadrantPositions,
  DEFAULT_QUADRANT_SHOW_COUNTS,
  DEFAULT_QUADRANT_THRESHOLD_X,
  DEFAULT_QUADRANT_THRESHOLD_Y,
  H,
  LABEL_MAX_POINT,
  MARGIN,
  QUAD_FILL_HIGH,
  QUAD_FILL_LOW,
  QUAD_INDEX_DY,
  QUAD_INDEX_FONT_SIZE,
  QUAD_INDEX_FONT_WEIGHT,
  QUAD_LABEL_FONT_SIZE,
  QUAD_LABEL_PAD_BOTTOM,
  QUAD_LABEL_PAD_TOP,
  QUAD_LABEL_PAD_X,
  QUAD_POINT_LABEL_DY,
  QUAD_POINT_OPACITY,
  QUAD_RADIUS,
  W,
  Y_LABEL_X,
} from "./quadrant-chart.compute";
import type { QuadrantChartProps } from "./quadrant-chart.types";

export { computeQuadrantPositions } from "./quadrant-chart.compute";
export type {
  QuadrantChartProps,
  QuadrantPoint,
} from "./quadrant-chart.types";

/**
 * Cuadrantes SSR (matriz 2×2 con puntos). x/y en 0–100.
 */
export function QuadrantChart({
  points,
  ariaLabel,
  xLabel = "→ Esfuerzo",
  yLabel = "↑ Impacto",
  quads = ["Apuestas", "Ganancias rápidas", "Relleno", "Evitar"],
  showCounts = DEFAULT_QUADRANT_SHOW_COUNTS,
  thresholds = {
    x: DEFAULT_QUADRANT_THRESHOLD_X,
    y: DEFAULT_QUADRANT_THRESHOLD_Y,
  },
  format,
  height = H,
  locale = DEFAULT_LOCALE,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: QuadrantChartProps) {
  if (isBlank(points)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const rawH = toNumber(height, H);
  const safeH = Number.isFinite(rawH) && rawH > 0 ? rawH : H;
  const fmt = resolveFormatter(format, locale);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = safeH - MARGIN.top - MARGIN.bottom;
  const pos = computeQuadrantPositions(points, safeH);
  const midX =
    MARGIN.left + clamp01(toNumber(thresholds.x) / PERCENT_FACTOR) * innerW;
  const midY =
    MARGIN.top +
    (1 - clamp01(toNumber(thresholds.y) / PERCENT_FACTOR)) * innerH;
  const counts = showCounts
    ? [
        points.filter(
          (p) => toNumber(p.x) < thresholds.x && toNumber(p.y) >= thresholds.y,
        ).length,
        points.filter(
          (p) => toNumber(p.x) >= thresholds.x && toNumber(p.y) >= thresholds.y,
        ).length,
        points.filter(
          (p) => toNumber(p.x) < thresholds.x && toNumber(p.y) < thresholds.y,
        ).length,
        points.filter(
          (p) => toNumber(p.x) >= thresholds.x && toNumber(p.y) < thresholds.y,
        ).length,
      ]
    : [0, 0, 0, 0];

  const quadPos = [
    {
      x: MARGIN.left + QUAD_LABEL_PAD_X,
      y: MARGIN.top + QUAD_LABEL_PAD_TOP,
      anchor: "start" as const,
    },
    {
      x: MARGIN.left + innerW - QUAD_LABEL_PAD_X,
      y: MARGIN.top + QUAD_LABEL_PAD_TOP,
      anchor: "end" as const,
    },
    {
      x: MARGIN.left + QUAD_LABEL_PAD_X,
      y: MARGIN.top + innerH - QUAD_LABEL_PAD_BOTTOM,
      anchor: "start" as const,
    },
    {
      x: MARGIN.left + innerW - QUAD_LABEL_PAD_X,
      y: MARGIN.top + innerH - QUAD_LABEL_PAD_BOTTOM,
      anchor: "end" as const,
    },
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${safeH}`}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <rect
        x={midX}
        y={MARGIN.top}
        width={MARGIN.left + innerW - midX}
        height={midY - MARGIN.top}
        rx={QUAD_RADIUS}
        fill={CHART_TOKEN.chart1}
        fillOpacity={QUAD_FILL_HIGH}
      />
      <rect
        x={MARGIN.left}
        y={midY}
        width={midX - MARGIN.left}
        height={MARGIN.top + innerH - midY}
        rx={QUAD_RADIUS}
        fill={CHART_TOKEN.chart1}
        fillOpacity={QUAD_FILL_LOW}
      />
      <line
        x1={midX}
        x2={midX}
        y1={MARGIN.top}
        y2={MARGIN.top + innerH}
        stroke={CHART_TOKEN.border}
        strokeWidth={POINT_BORDER}
      />
      <line
        x1={MARGIN.left}
        x2={MARGIN.left + innerW}
        y1={midY}
        y2={midY}
        stroke={CHART_TOKEN.border}
        strokeWidth={POINT_BORDER}
      />
      {quads.map((q, i) => (
        <text
          key={stableKey([q, showCounts ? String(counts[i] ?? 0) : ""], i)}
          x={quadPos[i]?.x ?? 0}
          y={quadPos[i]?.y ?? 0}
          textAnchor={quadPos[i]?.anchor ?? "start"}
          fontSize={QUAD_LABEL_FONT_SIZE}
          fontWeight={FONT_SEMIBOLD}
          fill={CHART_TOKEN.muted}
        >
          {showCounts ? `${q} (${counts[i] ?? 0})` : q}
        </text>
      ))}
      {points.map((p, i) => {
        const tip = `${p.label} (${fmt(toNumber(p.x))}, ${fmt(toNumber(p.y))})`;
        const c = pos[i] ?? { cx: 0, cy: 0 };
        return (
          <g key={stableKey([p.label], i)}>
            <circle
              cx={c.cx}
              cy={c.cy}
              r={NODE_RADIUS}
              fill={p.color ?? CHART_TOKEN.primary}
              fillOpacity={QUAD_POINT_OPACITY}
              stroke={CHART_TOKEN.background}
              strokeWidth={NODE_BORDER_WIDTH}
              data-chart-tip={tip}
            />
            <text
              x={c.cx}
              y={c.cy + QUAD_INDEX_DY}
              textAnchor="middle"
              fontSize={QUAD_INDEX_FONT_SIZE}
              fontWeight={QUAD_INDEX_FONT_WEIGHT}
              fill={CHART_TOKEN.primaryForeground}
            >
              {i + 1}
            </text>
            <text
              x={c.cx}
              y={c.cy - QUAD_POINT_LABEL_DY}
              textAnchor="middle"
              fontSize={EDGE_LABEL_FONT_SIZE}
              fill={CHART_TOKEN.foreground}
            >
              {truncateLabel(p.label, LABEL_MAX_POINT)}
            </text>
          </g>
        );
      })}
      <text
        x={MARGIN.left + innerW / 2}
        y={safeH - AXIS_LABEL_BOTTOM_PAD}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fill={CHART_TOKEN.muted}
      >
        {xLabel}
      </text>
      <text
        x={Y_LABEL_X}
        y={MARGIN.top + innerH / 2}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fill={CHART_TOKEN.muted}
        transform={`rotate(-90, ${Y_LABEL_X}, ${MARGIN.top + innerH / 2})`}
      >
        {yLabel}
      </text>
    </svg>
  );
}
