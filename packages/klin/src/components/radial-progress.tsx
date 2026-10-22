/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { formatDefault } from "../core/format";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  buildRadialBackground,
  buildRadialForeground,
  buildRadialTick,
  CENTER_LABEL_DY,
  CENTER_VALUE_DY,
  CENTER_VALUE_DY_WITH_LABEL,
  CENTER_VALUE_FONT_SIZE,
  LABEL_MAX,
  normalizeRadialScale,
  normalizeRadialStartAngle,
  radialRadii,
  radialTickGeometry,
  START,
  TRACK_TICK_COUNT,
} from "./radial-progress.compute";
import type { RadialProgressProps } from "./radial-progress.types";

export type { RadialScale } from "./radial-progress.compute";
export {
  buildRadialBackground,
  buildRadialForeground,
  buildRadialTick,
  CENTER_LABEL_DY,
  CENTER_VALUE_DY,
  CENTER_VALUE_DY_WITH_LABEL,
  CENTER_VALUE_FONT_SIZE,
  LABEL_MAX,
  normalizeRadialScale,
  normalizeRadialStartAngle,
  radialRadii,
  radialTickGeometry,
  START,
  TAU,
  TRACK_TICK_COUNT,
  TRACK_TICK_GAP_RATIO,
} from "./radial-progress.compute";
export type { RadialProgressProps } from "./radial-progress.types";

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
  startAngle = START,
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
  const { frac, clamped } = normalizeRadialScale(numeric, min, max);
  const start = normalizeRadialStartAngle(startAngle);
  const { radius, inner } = radialRadii(size, thickness);
  const bg = buildRadialBackground(inner, radius, start);
  const { tickStep, tickGap } = radialTickGeometry();
  const fg = buildRadialForeground(inner, radius, thickness, frac, start);
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
      <g transform={`translate(${radius},${radius})`}>
        {trackStyle === "ticks" ? (
          Array.from({ length: TRACK_TICK_COUNT }, (_, i) => {
            const d = buildRadialTick(
              inner,
              radius,
              i,
              tickStep,
              tickGap,
              start,
            );
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
          data-chart-tip={label}
        >
          {truncateLabel(label, LABEL_MAX)}
        </text>
      ) : null}
    </svg>
  );
}
