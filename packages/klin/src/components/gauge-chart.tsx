/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { arc } from "d3-shape";
import type { CSSProperties } from "react";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault } from "../lib/palette";
import {
  CHART_TOKEN,
  EDGE_LABEL_FONT_SIZE,
  FONT_SEMIBOLD,
  PERCENT_FACTOR,
  POINT_BORDER,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

const START = -Math.PI;
const END = 0;
/** Tamaño del valor central, etiqueta y relleno inferior del lienzo. */
const CENTER_VALUE_FONT_SIZE = 26;
const CENTER_VALUE_DY = 8;
const CENTER_LABEL_DY = 6;
const GAUGE_BOTTOM_PAD = 22;
/** Separación de marcas y etiquetas de escala. */
const TICK_OUTER_OFFSET = 6;
const TICK_INNER_OFFSET = 12;
const TICK_LABEL_OFFSET = 12;
const TICK_LABEL_DY = 3;

/** Props del velocímetro SSR (semicírculo 0–100). */
export type GaugeChartProps = {
  /** 0–100. */
  value: number;
  ariaLabel: string;
  label?: string;
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  format?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
};

/**
 * Velocímetro SSR (semicírculo 0–100 con marcas y valor central).
 */
export function GaugeChart({
  value,
  ariaLabel,
  label,
  size = 220,
  thickness = 22,
  color = CHART_TOKEN.chart1,
  trackColor = CHART_TOKEN.track,
  format,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
}: GaugeChartProps) {
  const numeric = toNumber(value, Number.NaN);
  if (!Number.isFinite(numeric)) {
    return <ChartEmpty title={emptyTitle} />;
  }
  const clamped = Math.min(PERCENT_FACTOR, Math.max(0, numeric));
  const radius = size / 2;
  const inner = radius - thickness;
  const datum = { innerRadius: inner, outerRadius: radius };
  const bg = arc().innerRadius(inner).outerRadius(radius)({
    ...datum,
    startAngle: START,
    endAngle: END,
  });
  const fg = arc().innerRadius(inner).outerRadius(radius)({
    ...datum,
    startAngle: START,
    endAngle: START + (clamped / PERCENT_FACTOR) * Math.PI,
  });
  const fmt = format ?? ((v: number) => `${formatDefault(v, locale)}%`);
  const tip = `${label ? `${label}: ` : ""}${fmt(clamped)}`;
  const tick = (v: number) => {
    const a = START + (v / PERCENT_FACTOR) * Math.PI;
    const r1 = inner - TICK_OUTER_OFFSET;
    const r2 = inner - TICK_INNER_OFFSET;
    return {
      x1: radius + r1 * Math.cos(a),
      y1: radius + r1 * Math.sin(a),
      x2: radius + r2 * Math.cos(a),
      y2: radius + r2 * Math.sin(a),
      lx: radius + (r2 - TICK_LABEL_OFFSET) * Math.cos(a),
      ly: radius + (r2 - TICK_LABEL_OFFSET) * Math.sin(a),
    };
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${radius + GAUGE_BOTTOM_PAD}`}
      width={size}
      height={radius + GAUGE_BOTTOM_PAD}
      className={
        className ? `h-auto max-w-full ${className}` : "h-auto max-w-full"
      }
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{tip}</title>
      <g transform={`translate(0,0)`}>
        <path
          d={bg ?? ""}
          fill={trackColor}
          transform={`translate(${radius},${radius})`}
        />
        {clamped > 0 ? (
          <path
            d={fg ?? ""}
            fill={color}
            transform={`translate(${radius},${radius})`}
            data-chart-tip={tip}
          />
        ) : null}
      </g>
      {[0, 25, 50, 75, 100].map((t) => {
        const p = tick(t);
        return (
          <g key={t}>
            <line
              x1={p.x1}
              y1={p.y1}
              x2={p.x2}
              y2={p.y2}
              stroke={CHART_TOKEN.muted}
              strokeWidth={POINT_BORDER}
            />
            <text
              x={p.lx}
              y={p.ly}
              dy={TICK_LABEL_DY}
              textAnchor="middle"
              fontSize={EDGE_LABEL_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {t}
            </text>
          </g>
        );
      })}
      <text
        x={radius}
        y={radius - CENTER_VALUE_DY}
        textAnchor="middle"
        fontSize={CENTER_VALUE_FONT_SIZE}
        fontWeight={FONT_SEMIBOLD}
        fill={CHART_TOKEN.foreground}
      >
        {fmt(clamped)}
      </text>
      {label ? (
        <text
          x={radius}
          y={radius + CENTER_LABEL_DY}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fill={CHART_TOKEN.muted}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}
