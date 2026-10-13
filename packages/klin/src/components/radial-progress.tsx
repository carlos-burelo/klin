/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { arc } from "d3-shape";
import type { CSSProperties } from "react";
import { clamp01, toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

const START = -Math.PI / 2;
const TAU = Math.PI * 2;
/** Tamaño del valor central y desplazamientos del valor/etiqueta. */
const CENTER_VALUE_FONT_SIZE = 24;
const CENTER_VALUE_DY = 6;
const CENTER_VALUE_DY_WITH_LABEL = -2;
const CENTER_LABEL_DY = 16;
/** Máximo de truncado de la etiqueta inferior. */
const LABEL_MAX = 18;
/** Segmentos de la pista punteada y fracción de hueco entre ellos. */
const TRACK_TICK_COUNT = 48;
const TRACK_TICK_GAP_RATIO = 0.35;

/** Props del progreso radial SSR (anillo 0–100 %). */
export type RadialProgressProps = {
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
   * Estilo de la pista: anillo continuo o segmentos.
   * @default "full"
   */
  trackStyle?: "full" | "ticks";
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
 * Progreso radial SSR (anillo 0–100 %). Ideal para avances e indicadores.
 */
export function RadialProgress({
  value,
  ariaLabel,
  label,
  min = 0,
  max = 100,
  trackStyle = "full",
  size = 160,
  thickness = 16,
  color = CHART_TOKEN.chart1,
  trackColor = CHART_TOKEN.track,
  format,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: RadialProgressProps) {
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
  const bg = arc().innerRadius(inner).outerRadius(radius)({
    innerRadius: inner,
    outerRadius: radius,
    startAngle: START,
    endAngle: START + TAU,
  });
  const tickStep = TAU / TRACK_TICK_COUNT;
  const tickGap = tickStep * TRACK_TICK_GAP_RATIO;
  const tickPath = arc().innerRadius(inner).outerRadius(radius);
  const fg = arc()
    .innerRadius(inner)
    .outerRadius(radius)
    .cornerRadius(thickness / 2)({
    innerRadius: inner,
    outerRadius: radius,
    startAngle: START,
    endAngle: START + frac * TAU,
  });
  const fmt = format ?? ((v: number) => `${formatDefault(v, locale)}%`);
  const tip = `${label ? `${label}: ` : ""}${fmt(clamped)}`;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={
        className ? `h-auto max-w-full ${className}` : "h-auto max-w-full"
      }
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{tip}</title>
      <g transform={`translate(${radius},${radius})`}>
        {trackStyle === "ticks" ? (
          Array.from({ length: TRACK_TICK_COUNT }, (_, i) => {
            const d =
              tickPath({
                innerRadius: inner,
                outerRadius: radius,
                startAngle: START + i * tickStep,
                endAngle: START + (i + 1) * tickStep - tickGap,
              }) ?? "";
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: segmentos estáticos en orden inmutable
              <path key={`tick__${i}`} d={d} fill={trackColor} />
            );
          })
        ) : (
          <path d={bg ?? ""} fill={trackColor} />
        )}
        {frac > 0 ? (
          <path d={fg ?? ""} fill={color} data-chart-tip={tip} />
        ) : null}
      </g>
      <text
        x={radius}
        y={radius + (label ? CENTER_VALUE_DY_WITH_LABEL : CENTER_VALUE_DY)}
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
          {truncateLabel(label, LABEL_MAX)}
          <title>{label}</title>
        </text>
      ) : null}
    </svg>
  );
}
