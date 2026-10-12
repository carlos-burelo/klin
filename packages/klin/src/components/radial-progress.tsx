/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { arc } from "d3-shape";
import type { CSSProperties } from "react";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
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

/** Props del progreso radial SSR (anillo 0–100 %). */
export type RadialProgressProps = {
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
 * Progreso radial SSR (anillo 0–100 %). Ideal para avances e indicadores.
 */
export function RadialProgress({
  value,
  ariaLabel,
  label,
  size = 160,
  thickness = 16,
  color = CHART_TOKEN.chart1,
  trackColor = CHART_TOKEN.track,
  format,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
}: RadialProgressProps) {
  const numeric = toNumber(value, Number.NaN);
  if (!Number.isFinite(numeric)) {
    return <ChartEmpty title={emptyTitle} />;
  }
  const clamped = Math.min(PERCENT_FACTOR, Math.max(0, numeric));
  const radius = size / 2;
  const inner = radius - thickness;
  const bg = arc().innerRadius(inner).outerRadius(radius)({
    innerRadius: inner,
    outerRadius: radius,
    startAngle: START,
    endAngle: START + TAU,
  });
  const fg = arc()
    .innerRadius(inner)
    .outerRadius(radius)
    .cornerRadius(thickness / 2)({
    innerRadius: inner,
    outerRadius: radius,
    startAngle: START,
    endAngle: START + (clamped / PERCENT_FACTOR) * TAU,
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
        <path d={bg ?? ""} fill={trackColor} />
        {clamped > 0 ? (
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
