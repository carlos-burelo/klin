/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import type { TimelineEvent } from "./timeline-chart.types";

export const TIMELINE_W = 680;
export const TIMELINE_MARGIN = 24;
export const TIMELINE_LANE = 76;
/** Carril vertical en densidad compacta. */
export const TIMELINE_LANE_COMPACT = 52;
export const TIMELINE_BASE_PAD = 56;
export const TIMELINE_MID_PAD = 28;
export const NODE_FONT_SIZE = 12;
export const DOT_R = 7;
export const DOT_INNER_R = 2.5;
export const STEM_TOP_PAD = 18;
export const DATE_DY = 8;
export const LABEL_DY = 24;
export const LABEL_BOTTOM_PAD = 10;
export const DATE_BOTTOM_PAD = 24;

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
