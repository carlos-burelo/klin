/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  NODE_BORDER_WIDTH,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartSvg, CHART_W as W } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  buildNightingaleArcs,
  buildNightingalePath,
  cleanNightingaleData,
  NIGHTINGALE_ANCHOR_COS,
  NIGHTINGALE_CORNER_DEFAULT,
  NIGHTINGALE_LABEL_OFFSET,
  NIGHTINGALE_MAX_OUTSIDE_LABELS,
  NIGHTINGALE_PAD_ANGLE,
  NIGHTINGALE_START_DEFAULT,
  NIGHTINGALE_TOTAL_DY,
  NIGHTINGALE_TOTAL_FONT_SIZE,
  NIGHTINGALE_TOTAL_LABEL_DY,
  nightingaleOuterRadius,
  nightingalePercent,
  nightingaleRadius,
  nightingaleTotal,
  normalizeNightingaleAngles,
  normalizeNightingaleInnerRadius,
  orderNightingaleSlices,
  resolveNightingaleSliceColor,
} from "./nightingale-chart.compute";
import type { NightingaleChartProps } from "./nightingale-chart.types";

export type {
  NightingaleChartProps,
  NightingaleDatum,
} from "./nightingale-chart.types";

/**
 * Coxcomb SSR: ángulos iguales (pie sin orden), radio ∝ sqrt(value)
 * para que el área sea proporcional al valor.
 * Filtra no-finitos y valores <= 0; sin datos o total <= 0 → ChartEmpty.
 */
export function NightingaleChart({
  data,
  ariaLabel,
  height = 260,
  format,
  locale = DEFAULT_LOCALE,
  showLabels = true,
  showValues = false,
  sortSlices = false,
  padAngle = NIGHTINGALE_PAD_ANGLE,
  cornerRadius = NIGHTINGALE_CORNER_DEFAULT,
  startAngle = NIGHTINGALE_START_DEFAULT,
  showTotal = false,
  totalLabel = "Total",
  itemColor,
  innerRadius = 0,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: NightingaleChartProps) {
  const clean = cleanNightingaleData(data);
  const total = nightingaleTotal(clean);
  if (clean.length === 0 || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const ordered = orderNightingaleSlices(clean, sortSlices);

  const fmt = resolveFormatter(format, locale);
  const radius = nightingaleRadius(W, height);
  const top = Math.max(1, ...ordered.map((d) => d.value));
  const cx = W / 2;
  const cy = height / 2;
  const { start, pad, corner } = normalizeNightingaleAngles(
    startAngle,
    padAngle,
    cornerRadius,
  );
  const slices = buildNightingaleArcs(ordered, start);
  const draw = buildNightingalePath(pad, corner);
  const inner = normalizeNightingaleInnerRadius(innerRadius);
  const showOutside = ordered.length <= NIGHTINGALE_MAX_OUTSIDE_LABELS;

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
        <g transform={`translate(${cx},${cy})`}>
          {slices.map((a, i) => {
            const datum = a.data;
            const outer = nightingaleOuterRadius(radius, datum.value, top);
            const color = resolveNightingaleSliceColor(datum, itemColor);
            const pct = nightingalePercent(datum.value, total);
            const tip = `${datum.label}: ${fmt(datum.value)} (${pct}% del total)`;
            const mid = (a.startAngle + a.endAngle) / 2;
            const cos = Math.cos(mid - Math.PI / 2);
            const lx =
              (radius + NIGHTINGALE_LABEL_OFFSET) * Math.cos(mid - Math.PI / 2);
            const ly =
              (radius + NIGHTINGALE_LABEL_OFFSET) * Math.sin(mid - Math.PI / 2);
            return (
              <g key={stableKey([datum.label], i)}>
                <path
                  d={
                    draw({
                      innerRadius: Math.min(inner, outer),
                      outerRadius: outer,
                      startAngle: a.startAngle,
                      endAngle: a.endAngle,
                    }) ?? ""
                  }
                  fill={color}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={NODE_BORDER_WIDTH}
                  data-chart-tip={tip}
                />
                {showOutside && showLabels ? (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={
                      cos > NIGHTINGALE_ANCHOR_COS
                        ? "start"
                        : cos < -NIGHTINGALE_ANCHOR_COS
                          ? "end"
                          : "middle"
                    }
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                    data-chart-tip={datum.label}
                  >
                    {showValues
                      ? `${truncateLabel(datum.label)} · ${fmt(datum.value)}`
                      : truncateLabel(datum.label)}
                  </text>
                ) : null}
              </g>
            );
          })}
          {showTotal ? (
            <g textAnchor="middle">
              <text
                y={-NIGHTINGALE_TOTAL_DY}
                fontSize={NIGHTINGALE_TOTAL_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {fmt(total)}
              </text>
              <text
                y={NIGHTINGALE_TOTAL_LABEL_DY}
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {totalLabel}
              </text>
            </g>
          ) : null}
        </g>
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={ordered.map((d) => ({
            label: `${d.label} · ${fmt(d.value)}`,
            color: resolveNightingaleSliceColor(d, itemColor),
          }))}
        />
      ) : null}
    </div>
  );
}
