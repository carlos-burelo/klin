/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import type { CSSProperties } from "react";
import type { ChartMargin } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { clamp01, toNumber } from "../lib/number";
import { formatDefault, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  EDGE_LABEL_FONT_SIZE,
  FONT_SEMIBOLD,
  NODE_BORDER_WIDTH,
  NODE_RADIUS,
  PERCENT_FACTOR,
  POINT_BORDER,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Punto del cuadrante (x/y en 0–100 con etiqueta). */
export type QuadrantPoint = {
  x: number;
  y: number;
  label: string;
};

/** Props de cuadrantes SSR (matriz 2×2 con puntos). */
export type QuadrantChartProps = {
  points: QuadrantPoint[];
  ariaLabel: string;
  xLabel?: string;
  yLabel?: string;
  /** [arriba-izq, arriba-der, abajo-izq, abajo-der]. */
  quads?: [string, string, string, string];
  /** Muestra el nº de puntos junto a cada etiqueta de cuadrante. */
  showCounts?: boolean;
  /** Posición de la cruz en escala 0–100 (por defecto centrada, como hasta ahora). */
  thresholds?: { x: number; y: number };
  locale?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const W = 560;
const H = 460;
const MARGIN: ChartMargin = { top: 36, right: 16, bottom: 36, left: 16 };
/** Posición de etiquetas de cuadrante, radio y opacidades de fondo. */
const QUAD_LABEL_PAD_X = 10;
const QUAD_LABEL_PAD_TOP = 18;
const QUAD_LABEL_PAD_BOTTOM = 10;
const QUAD_RADIUS = 8;
const QUAD_FILL_HIGH = 0.12;
const QUAD_FILL_LOW = 0.05;
const QUAD_POINT_OPACITY = 0.85;
/** Tipografía de etiqueta de cuadrante e índice/label de punto. */
const QUAD_LABEL_FONT_SIZE = 12;
const QUAD_INDEX_FONT_SIZE = 8;
const QUAD_INDEX_FONT_WEIGHT = 700;
const QUAD_INDEX_DY = 3.5;
const QUAD_POINT_LABEL_DY = 13;
/** Separación del eje inferior y posición de la etiqueta Y. */
const AXIS_LABEL_BOTTOM_PAD = 6;
const Y_LABEL_X = 10;
/** Máximo de truncado de etiqueta de punto. */
const LABEL_MAX_POINT = 16;
/** Sin conteos por defecto (etiquetas limpias, como hasta ahora). */
const DEFAULT_QUADRANT_SHOW_COUNTS = false;
/** Cruz centrada por defecto (50/50, como hasta ahora). */
const DEFAULT_QUADRANT_THRESHOLD_X = 50;
/** Cruz centrada por defecto (50/50, como hasta ahora). */
const DEFAULT_QUADRANT_THRESHOLD_Y = 50;

/**
 * Cómputo puro de posiciones del cuadrante ( clamp 0–100 → px ).
 * Normaliza valores externos con toNumber.
 */
export function computeQuadrantPositions(points: QuadrantPoint[]): Array<{
  cx: number;
  cy: number;
}> {
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = H - MARGIN.top - MARGIN.bottom;
  return points.map((p) => ({
    cx: MARGIN.left + clamp01(toNumber(p.x) / PERCENT_FACTOR) * innerW,
    cy: MARGIN.top + (1 - clamp01(toNumber(p.y) / PERCENT_FACTOR)) * innerH,
  }));
}

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
  locale = "es-MX",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: QuadrantChartProps) {
  if (points.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = H - MARGIN.top - MARGIN.bottom;
  const pos = computeQuadrantPositions(points);
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
      viewBox={`0 0 ${W} ${H}`}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{ariaLabel}</title>
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
        const tip = `${p.label} (${formatDefault(toNumber(p.x), locale)}, ${formatDefault(toNumber(p.y), locale)})`;
        const c = pos[i] ?? { cx: 0, cy: 0 };
        return (
          <g key={stableKey([p.label], i)}>
            <title>{tip}</title>
            <circle
              cx={c.cx}
              cy={c.cy}
              r={NODE_RADIUS}
              fill={CHART_TOKEN.primary}
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
        y={H - AXIS_LABEL_BOTTOM_PAD}
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
