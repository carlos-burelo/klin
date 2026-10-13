/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { arc } from "d3-shape";
import type { CSSProperties } from "react";
import { resolveFormatter } from "../lib/format";
import { clamp01, toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
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
/** Fracciones de la escala donde van las marcas (0–100 por defecto). */
const GAUGE_TICK_FRACS = [0, 0.25, 0.5, 0.75, 1];
/** Margen de la punta de la aguja y radio/grosor del buje. */
const NEEDLE_TIP_INSET = 10;
const NEEDLE_HUB_RADIUS = 5;
const NEEDLE_WIDTH = 3;

/** Props del velocímetro SSR (semicírculo 0–100). */
export type GaugeChartProps = {
  /** Valor en unidades de la escala. */
  value: number;
  ariaLabel: string;
  label?: string;
  /**
   * Mínimo de la escala.
   * @default 0
   */
  min?: number;
  /**
   * Máximo de la escala (si no supera a `min`, se usa `min + 100`).
   * @default 100
   */
  max?: number;
  /**
   * Muestra aguja en lugar del arco de valor.
   * @default false
   */
  showNeedle?: boolean;
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
  /** Descripción del estado vacío. */
  emptyDescription?: string;
};

/**
 * Velocímetro SSR (semicírculo 0–100 con marcas y valor central).
 */
export function GaugeChart({
  value,
  ariaLabel,
  label,
  min = 0,
  max = 100,
  showNeedle = false,
  size = 220,
  thickness = 22,
  color = CHART_TOKEN.chart1,
  trackColor = CHART_TOKEN.track,
  format,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: GaugeChartProps) {
  const numeric = toNumber(value, Number.NaN);
  if (!Number.isFinite(numeric)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const lo = toNumber(min);
  const rawHi = toNumber(max);
  const hi = rawHi > lo ? rawHi : lo + PERCENT_FACTOR;
  const frac = clamp01((numeric - lo) / (hi - lo));
  const clamped = lo + frac * (hi - lo);
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
    endAngle: START + frac * Math.PI,
  });
  const needleAngle = START + frac * Math.PI;
  const needleLen = Math.max(0, radius - NEEDLE_TIP_INSET);
  const needleTip = {
    x: radius + needleLen * Math.cos(needleAngle),
    y: radius + needleLen * Math.sin(needleAngle),
  };
  const fmt = format ?? ((v: number) => `${formatDefault(v, locale)}%`);
  // Ticks con el prop `format` resuelto (sin sufijo %: como hasta ahora).
  const fmtTick = resolveFormatter(format, locale);
  const tip = `${label ? `${label}: ` : ""}${fmt(clamped)}`;
  const tick = (f: number) => {
    const a = START + f * Math.PI;
    const r1 = inner - TICK_OUTER_OFFSET;
    const r2 = inner - TICK_INNER_OFFSET;
    return {
      x1: radius + r1 * Math.cos(a),
      y1: radius + r1 * Math.sin(a),
      x2: radius + r2 * Math.cos(a),
      y2: radius + r2 * Math.sin(a),
      lx: radius + (r2 - TICK_LABEL_OFFSET) * Math.cos(a),
      ly: radius + (r2 - TICK_LABEL_OFFSET) * Math.sin(a),
      value: lo + f * (hi - lo),
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
        {showNeedle ? (
          frac > 0 ? (
            <g transform={`translate(${radius},${radius})`}>
              <line
                x1={0}
                y1={0}
                x2={needleTip.x - radius}
                y2={needleTip.y - radius}
                stroke={CHART_TOKEN.foreground}
                strokeWidth={NEEDLE_WIDTH}
                strokeLinecap="round"
                data-chart-tip={tip}
              />
              <circle
                cx={0}
                cy={0}
                r={NEEDLE_HUB_RADIUS}
                fill={CHART_TOKEN.foreground}
              />
            </g>
          ) : null
        ) : frac > 0 ? (
          <path
            d={fg ?? ""}
            fill={color}
            transform={`translate(${radius},${radius})`}
            data-chart-tip={tip}
          />
        ) : null}
      </g>
      {GAUGE_TICK_FRACS.map((f) => {
        const p = tick(f);
        return (
          <g key={`tick__${f}`}>
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
              {fmtTick(p.value)}
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
