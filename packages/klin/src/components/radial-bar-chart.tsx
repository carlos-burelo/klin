/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_MONO,
  FONT_SEMIBOLD,
  LABEL_GAP_PX,
  PERCENT_FACTOR,
  POINT_RADIUS,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  buildRadialTrackPath,
  buildRadialValuePath,
  cleanRadialRows,
  LABEL_COL_W,
  LABEL_ROW_H,
  LABEL_TEXT_DX,
  MARGIN,
  normalizeRadialAngles,
  RADIAL_BAR_START,
  RADIAL_TOTAL_FONT_SIZE,
  RADIAL_TOTAL_LABEL_DY,
  RING_CORNER_DEFAULT,
  radialFracs,
  radialLayout,
  radialRingRadii,
  radialTotal,
  resolveRadialBarColor,
  W,
} from "./radial-bar-chart.compute";
import type { RadialBarChartProps } from "./radial-bar-chart.types";

export type {
  RadialBarChartProps,
  RadialBarDatum,
} from "./radial-bar-chart.types";

/**
 * Barras radiales SSR: anillos concéntricos con fracción
 * `value / (max ?? 100)` (clamp 0–1), pista tenue + arco de valor
 * tipo píldora, etiquetas a la izquierda con valor tabular.
 */
export function RadialBarChart({
  series,
  ariaLabel,
  height = 260,
  formatValue,
  locale = DEFAULT_LOCALE,
  showLabels = true,
  showValues = true,
  sortSlices = false,
  startAngle = RADIAL_BAR_START,
  cornerRadius = RING_CORNER_DEFAULT,
  showTotal = false,
  totalLabel = "Total",
  itemColor,
  trackColor = CHART_TOKEN.track,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: RadialBarChartProps) {
  const rows = cleanRadialRows(series, sortSlices);
  if (isBlank(series)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fracs = radialFracs(rows);

  const fmt = resolveFormatter(formatValue, locale);
  const { start, corner } = normalizeRadialAngles(startAngle, cornerRadius);
  const { outer, cx, cy, step } = radialLayout(rows.length, height);
  const total = radialTotal(fracs);

  return (
    <div
      className={
        className
          ? `flex flex-col items-center ${className}`
          : "flex flex-col items-center"
      }
      style={style}
    >
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {rows.map((s, i) => {
          const f = fracs[i] ?? { value: 0, max: 100, frac: 0 };
          const color = resolveRadialBarColor(s, i, itemColor);
          const pct = Math.round(f.frac * PERCENT_FACTOR);
          const tip = `${s.label}: ${fmt(f.value)} de ${fmt(f.max)} (${pct}%)`;
          const ly =
            cy - ((rows.length - 1) * LABEL_ROW_H) / 2 + i * LABEL_ROW_H;
          return (
            <g key={stableKey([s.label], i)} data-chart-tip={tip}>
              {showLabels ? (
                <circle
                  cx={MARGIN.left}
                  cy={ly - TICK_DY}
                  r={POINT_RADIUS}
                  fill={color}
                />
              ) : null}
              {showLabels ? (
                <text
                  x={MARGIN.left + LABEL_TEXT_DX}
                  y={ly}
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(s.label)}
                </text>
              ) : null}
              {showValues ? (
                <text
                  x={MARGIN.left + LABEL_COL_W - LABEL_GAP_PX}
                  y={ly}
                  textAnchor="end"
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fill={CHART_TOKEN.foreground}
                >
                  {fmt(f.value)}
                </text>
              ) : null}
            </g>
          );
        })}
        <g transform={`translate(${cx},${cy})`}>
          {rows.map((s, i) => {
            const f = fracs[i] ?? { value: 0, max: 100, frac: 0 };
            const { rOuter, rInner } = radialRingRadii(outer, step, i);
            const color = resolveRadialBarColor(s, i, itemColor);
            const pct = Math.round(f.frac * PERCENT_FACTOR);
            const tip = `${s.label}: ${fmt(f.value)} de ${fmt(f.max)} (${pct}%)`;
            const track = buildRadialTrackPath(rInner, rOuter);
            const value = buildRadialValuePath(
              rInner,
              rOuter,
              start,
              f.frac,
              corner,
            );
            return (
              <g key={stableKey([s.label], i)}>
                <path
                  d={track}
                  fill={trackColor}
                  data-chart-tip={f.frac > 0 ? undefined : tip}
                />
                {f.frac > 0 ? (
                  <path d={value} fill={color} data-chart-tip={tip} />
                ) : null}
              </g>
            );
          })}
        </g>
        {showTotal ? (
          <g
            transform={`translate(${cx},${cy})`}
            textAnchor="middle"
            data-chart-tip={`${totalLabel}: ${fmt(total)}`}
          >
            <text
              fontSize={RADIAL_TOTAL_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.foreground}
            >
              {fmt(total)}
            </text>
            <text
              y={RADIAL_TOTAL_LABEL_DY}
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {totalLabel}
            </text>
          </g>
        ) : null}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={rows.map((s, i) => ({
            label: s.label,
            color: resolveRadialBarColor(s, i, itemColor),
          }))}
        />
      ) : null}
    </div>
  );
}
