/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  cleanFunnelCounts,
  computeFunnelRowH,
  FUNNEL_MIN_W,
  funnelBarWidths,
  funnelPercents,
  funnelTotal,
  GAP,
  normalizeFunnelGap,
  normalizeFunnelMinWidth,
  resolveFunnelTop,
  STAGE_LABEL_DY,
  STAGE_LABEL_FONT_SIZE,
  STAGE_VALUE_DY,
  STAGE_VALUE_OPACITY,
  W,
} from "./funnel-chart.compute";
import type { FunnelChartProps } from "./funnel-chart.types";

export type { FunnelBaseline } from "./funnel-chart.compute";
export {
  cleanFunnelCounts,
  computeFunnelRowH,
  FUNNEL_MIN_W,
  funnelBarWidths,
  funnelPercents,
  funnelTotal,
  GAP,
  normalizeFunnelGap,
  normalizeFunnelMinWidth,
  resolveFunnelTop,
  STAGE_LABEL_DY,
  STAGE_LABEL_FONT_SIZE,
  STAGE_VALUE_DY,
  STAGE_VALUE_OPACITY,
  W,
} from "./funnel-chart.compute";
export type { FunnelChartProps, FunnelStage } from "./funnel-chart.types";

/**
 * Embudo SSR (conversión por etapas). Trapecios proporcionales al valor.
 */
export function FunnelChart({
  stages,
  ariaLabel,
  height = 280,
  showDropOff = true,
  baseline = "first",
  locale = DEFAULT_LOCALE,
  format,
  itemColor,
  showLegend = false,
  gap = GAP,
  minWidth = FUNNEL_MIN_W,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: FunnelChartProps) {
  if (isBlank(stages)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const counts = cleanFunnelCounts(stages);
  const total = funnelTotal(counts);
  if (counts.length === 0 || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);

  const top = resolveFunnelTop(counts);
  const sep = normalizeFunnelGap(gap);
  const minW = normalizeFunnelMinWidth(minWidth);
  const rowH = computeFunnelRowH(stages.length, height, sep);
  const first = counts[0] ?? 1;
  const colorOf = (stage: (typeof stages)[number], i: number) =>
    stage.color ?? itemColor?.(stage, i) ?? seriesColor(i);

  const body = stages.map((stage, i) => {
    const value = counts[i] ?? 0;
    const next = counts[i + 1] ?? value;
    const { wTop, wBottom } = funnelBarWidths(value, next, top, minW);
    const y = i * (rowH + sep);
    const cx = W / 2;
    const color = colorOf(stage, i);
    const { conv, step } = funnelPercents(value, first, counts[i - 1] ?? 0, i);
    const shownPct = baseline === "previous" && i > 0 ? step : conv;
    const tip =
      i === 0
        ? `${stage.label}: ${fmt(value)} (${conv}% del inicio)`
        : showDropOff
          ? `${stage.label}: ${fmt(value)} (${conv}% del inicio · ${step}% previo)`
          : `${stage.label}: ${fmt(value)} (${conv}% del inicio)`;
    return (
      <g key={stableKey([stage.label], i)}>
        <polygon
          points={`${cx - wTop / 2},${y} ${cx + wTop / 2},${y} ${cx + wBottom / 2},${y + rowH} ${cx - wBottom / 2},${y + rowH}`}
          fill={color}
          data-chart-tip={tip}
        />
        <text
          x={cx}
          y={y + rowH / 2 - STAGE_LABEL_DY}
          textAnchor="middle"
          fontSize={STAGE_LABEL_FONT_SIZE}
          fontWeight={FONT_SEMIBOLD}
          fill={CHART_TOKEN.onFill}
        >
          {stage.label}
        </text>
        <text
          x={cx}
          y={y + rowH / 2 + STAGE_VALUE_DY}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fill={CHART_TOKEN.onFill}
          opacity={STAGE_VALUE_OPACITY}
        >
          {`${fmt(value)} · ${shownPct}%`}
        </text>
      </g>
    );
  });

  const svg = (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {body}
    </svg>
  );

  if (!showLegend) return svg;
  return (
    <div className="flex flex-col items-center">
      {svg}
      <ChartLegend
        items={stages.map((stage, i) => ({
          label: stage.label,
          color: colorOf(stage, i),
        }))}
      />
    </div>
  );
}
