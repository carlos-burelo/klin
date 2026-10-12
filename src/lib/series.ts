/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

/** Serie categórica genérica (unifica Bar/HBar/VStack/Area/Line/Stream/Radar). */
export type ChartSeries = {
  key: string;
  label: string;
  color?: string;
};
