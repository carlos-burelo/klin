/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { formatDefault, resolveFormatter } from "../core/format";
import { toNumber } from "../core/number";

import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  EDGE_LABEL_FONT_SIZE,
  FONT_SEMIBOLD,
  POINT_BORDER,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  buildGaugeBackground,
  buildGaugeForeground,
  buildGaugeZonePath,
  CENTER_LABEL_DY,
  CENTER_VALUE_DY,
  CENTER_VALUE_FONT_SIZE,
  GAUGE_BOTTOM_PAD,
  gaugeNeedleTip,
  gaugeRadii,
  gaugeTick,
  NEEDLE_HUB_RADIUS,
  NEEDLE_WIDTH,
  normalizeGaugeScale,
  normalizeGaugeTickFracs,
  normalizeGaugeZones,
  TICK_LABEL_DY,
} from "./gauge-chart.compute";
import type { GaugeChartProps } from "./gauge-chart.types";

export type { GaugeChartProps, GaugeZone } from "./gauge-chart.types";

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
  zones,
  tickCount,
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
  const { lo, hi, frac, clamped } = normalizeGaugeScale(numeric, min, max);
  const { radius, inner } = gaugeRadii(size, thickness);
  const zoneSegs = normalizeGaugeZones(lo, hi, zones);
  const bg = buildGaugeBackground(inner, radius);
  const fg = buildGaugeForeground(inner, radius, frac);
  const needleTip = gaugeNeedleTip(radius, frac);
  const fmt = format ?? ((v: number) => `${formatDefault(v, locale)}%`);
  // Ticks con el prop `format` resuelto (sin sufijo %: como hasta ahora).
  const fmtTick = resolveFormatter(format, locale);
  const tickFracs = normalizeGaugeTickFracs(tickCount);
  const tip = `${label ? `${label}: ` : ""}${fmt(clamped)}`;
  const tick = (f: number) => gaugeTick(f, radius, inner, lo, hi);

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
      <g transform={`translate(0,0)`}>
        {zoneSegs.length > 0 ? (
          zoneSegs.map((z, i) => (
            <path
              // biome-ignore lint/suspicious/noArrayIndexKey: zonas en orden de entrada
              key={`zone__${i}`}
              d={buildGaugeZonePath(inner, radius, z.fromFrac, z.toFrac) ?? ""}
              fill={z.color}
              transform={`translate(${radius},${radius})`}
            />
          ))
        ) : (
          <path
            d={bg ?? ""}
            fill={trackColor}
            transform={`translate(${radius},${radius})`}
          />
        )}
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
      {tickFracs.map((f) => {
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
