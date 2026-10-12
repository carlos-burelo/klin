/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  EDGE_LABEL_FONT_SIZE,
  FONT_MONO,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  NODE_BORDER_WIDTH,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type TimelineEvent = {
  date: string;
  label: string;
  detail?: string;
  done?: boolean;
};

/** Props de la línea de tiempo. */
export type TimelineChartProps = {
  events: TimelineEvent[];
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const TIMELINE_W = 680;
const TIMELINE_MARGIN = 24;
const TIMELINE_LANE = 76;
const TIMELINE_BASE_PAD = 56;
const TIMELINE_MID_PAD = 28;
const NODE_FONT_SIZE = 12;
const DOT_R = 7;
const DOT_INNER_R = 2.5;
const STEM_TOP_PAD = 18;
const DATE_DY = 8;
const LABEL_DY = 24;
const LABEL_BOTTOM_PAD = 10;
const DATE_BOTTOM_PAD = 24;

/**
 * Cómputo puro de posiciones X de la línea de tiempo + viewport.
 */
export function computeTimelineLayout(events: TimelineEvent[]): {
  height: number;
  midY: number;
  xs: number[];
} {
  const height = TIMELINE_LANE * 2 + TIMELINE_BASE_PAD;
  const midY = TIMELINE_LANE + TIMELINE_MID_PAD;
  const stepX =
    events.length <= 1
      ? 0
      : (TIMELINE_W - TIMELINE_MARGIN * 2) / (events.length - 1);
  return {
    height,
    midY,
    xs: events.map((_, i) => TIMELINE_MARGIN + i * stepX),
  };
}

/**
 * Línea de tiempo SSR (hitos alternados sobre un eje).
 */
export function TimelineChart({
  events,
  ariaLabel,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: TimelineChartProps) {
  if (events.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { height, midY, xs } = computeTimelineLayout(events);

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
        <title>{ariaLabel}</title>
        <line
          x1={TIMELINE_MARGIN}
          x2={TIMELINE_W - TIMELINE_MARGIN}
          y1={midY}
          y2={midY}
          stroke={CHART_TOKEN.border}
          strokeWidth={NODE_BORDER_WIDTH}
        />
        {events.map((e, i) => {
          const up = i % 2 === 0;
          const x = xs[i] ?? TIMELINE_MARGIN;
          const tip = e.detail
            ? `${e.date} · ${e.label}: ${e.detail}`
            : `${e.date} · ${e.label}`;
          const color = e.done ? CHART_TOKEN.primary : CHART_TOKEN.muted;
          return (
            <g key={stableKey([e.date, e.label], i)}>
              <title>{tip}</title>
              <line
                x1={x}
                x2={x}
                y1={midY}
                y2={
                  up
                    ? midY - TIMELINE_LANE + STEM_TOP_PAD
                    : midY + TIMELINE_LANE - STEM_TOP_PAD
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
              <text
                x={x}
                y={
                  up
                    ? midY - TIMELINE_LANE + DATE_DY
                    : midY + TIMELINE_LANE - DATE_BOTTOM_PAD
                }
                textAnchor="middle"
                fontSize={EDGE_LABEL_FONT_SIZE}
                fontFamily={FONT_MONO}
                fill={CHART_TOKEN.muted}
              >
                {e.date}
              </text>
              <text
                x={x}
                y={
                  up
                    ? midY - TIMELINE_LANE + LABEL_DY
                    : midY + TIMELINE_LANE - LABEL_BOTTOM_PAD
                }
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
    </div>
  );
}
