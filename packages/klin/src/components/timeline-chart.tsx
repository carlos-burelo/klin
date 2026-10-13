/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { stableKey } from "../lib/keys";
import { truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
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
  /** Lado de las tarjetas (`left` todas arriba, `right` todas abajo). */
  side?: "alternate" | "left" | "right";
  /** Muestra la fecha sobre cada hito. */
  showDates?: boolean;
  /** Densidad vertical de carriles. */
  density?: "comfortable" | "compact";
  /** Locale para formatear fechas (con `formatDate` o locale no defecto). */
  locale?: string;
  /** Formatea la fecha del evento (por defecto cruda para preservar). */
  formatDate?: (d: Date) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const TIMELINE_W = 680;
const TIMELINE_MARGIN = 24;
const TIMELINE_LANE = 76;
/** Carril vertical en densidad compacta. */
const TIMELINE_LANE_COMPACT = 52;
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
export function computeTimelineLayout(
  events: TimelineEvent[],
  density: "comfortable" | "compact" = "comfortable",
): {
  height: number;
  midY: number;
  xs: number[];
} {
  const lane = density === "compact" ? TIMELINE_LANE_COMPACT : TIMELINE_LANE;
  const height = lane * 2 + TIMELINE_BASE_PAD;
  const midY = lane + TIMELINE_MID_PAD;
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
  side = "alternate",
  showDates = true,
  density = "comfortable",
  locale = DEFAULT_LOCALE,
  formatDate,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: TimelineChartProps) {
  if (isBlank(events)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { height, midY, xs } = computeTimelineLayout(events, density);
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
          const up = side === "alternate" ? i % 2 === 0 : side === "left";
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
    </div>
  );
}
