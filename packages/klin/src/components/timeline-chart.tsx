/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  DIAGRAM_MIN_SCROLL,
  EDGE_LABEL_FONT_SIZE,
  FONT_MONO,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  NODE_BORDER_WIDTH,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  computeTimelineLayout,
  DATE_BOTTOM_PAD,
  DATE_DY,
  DOT_INNER_R,
  DOT_R,
  LABEL_BOTTOM_PAD,
  LABEL_DY,
  NODE_FONT_SIZE,
  STEM_TOP_PAD,
  TIMELINE_LANE,
  TIMELINE_LANE_COMPACT,
  TIMELINE_MARGIN,
  TIMELINE_W,
} from "./timeline-chart.compute";
import type { TimelineChartProps } from "./timeline-chart.types";

export { computeTimelineLayout } from "./timeline-chart.compute";
export type { TimelineChartProps, TimelineEvent } from "./timeline-chart.types";

/**
 * Línea de tiempo SSR (hitos alternados sobre un eje).
 */
export function TimelineChart({
  events,
  ariaLabel,
  side = "alternate",
  showDates = true,
  density = "comfortable",
  locale = DEFAULT_LOCALE,
  formatDate,
  sortBy,
  showLegend = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: TimelineChartProps) {
  if (isBlank(events)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const ordered =
    sortBy === "date"
      ? [...events].sort((a, b) => {
          const ta = new Date(`${a.date}T12:00:00`).getTime();
          const tb = new Date(`${b.date}T12:00:00`).getTime();
          const na = Number.isNaN(ta);
          const nb = Number.isNaN(tb);
          if (na && nb) return a.date.localeCompare(b.date);
          if (na) return 1;
          if (nb) return -1;
          return ta - tb;
        })
      : events;
  const { height, midY, xs } = computeTimelineLayout(ordered, density);
  const lane = density === "compact" ? TIMELINE_LANE_COMPACT : TIMELINE_LANE;
  /** Fecha visible: cruda por defecto; `formatDate` o locale no defecto la localizan. */
  const displayDate = (raw: string): string => {
    const parsed = new Date(`${raw}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return raw;
    if (formatDate) return formatDate(parsed);
    if (locale !== DEFAULT_LOCALE) {
      try {
        return parsed.toLocaleDateString(locale, {
          day: "numeric",
          month: "short",
        });
      } catch {
        return raw;
      }
    }
    return raw;
  };

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <svg
        viewBox={`0 0 ${TIMELINE_W} ${height}`}
        className="h-auto"
        style={{ minWidth: Math.min(TIMELINE_W, DIAGRAM_MIN_SCROLL) }}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <line
          x1={TIMELINE_MARGIN}
          x2={TIMELINE_W - TIMELINE_MARGIN}
          y1={midY}
          y2={midY}
          stroke={CHART_TOKEN.border}
          strokeWidth={NODE_BORDER_WIDTH}
        />
        {ordered.map((e, i) => {
          const up = side === "alternate" ? i % 2 === 0 : side === "left";
          const x = xs[i] ?? TIMELINE_MARGIN;
          const tip = e.detail
            ? `${e.date} · ${e.label}: ${e.detail}`
            : `${e.date} · ${e.label}`;
          const color = e.done ? CHART_TOKEN.primary : CHART_TOKEN.muted;
          return (
            <g key={stableKey([e.date, e.label], i)}>
              <line
                x1={x}
                x2={x}
                y1={midY}
                y2={
                  up ? midY - lane + STEM_TOP_PAD : midY + lane - STEM_TOP_PAD
                }
                stroke={CHART_TOKEN.border}
                strokeWidth={GRID_WIDTH}
              />
              <circle
                cx={x}
                cy={midY}
                r={DOT_R}
                fill={e.done ? CHART_TOKEN.primary : CHART_TOKEN.background}
                stroke={color}
                strokeWidth={NODE_BORDER_WIDTH}
                data-chart-tip={tip}
              />
              {e.done ? (
                <circle
                  cx={x}
                  cy={midY}
                  r={DOT_INNER_R}
                  fill={CHART_TOKEN.primaryForeground}
                />
              ) : null}
              {showDates ? (
                <text
                  x={x}
                  y={up ? midY - lane + DATE_DY : midY + lane - DATE_BOTTOM_PAD}
                  textAnchor="middle"
                  fontSize={EDGE_LABEL_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fill={CHART_TOKEN.muted}
                >
                  {displayDate(e.date)}
                </text>
              ) : null}
              <text
                x={x}
                y={up ? midY - lane + LABEL_DY : midY + lane - LABEL_BOTTOM_PAD}
                textAnchor="middle"
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(e.label, 18)}
              </text>
            </g>
          );
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Completado", color: CHART_TOKEN.primary },
            { label: "Pendiente", color: CHART_TOKEN.muted },
          ]}
        />
      ) : null}
    </div>
  );
}
