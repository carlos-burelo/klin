/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { CHART_TOKEN } from "./theme";

/** Paleta por defecto: tokens del tema (claro/oscuro automáticos). */
export const CHART_PALETTE = [
  CHART_TOKEN.chart1,
  CHART_TOKEN.chart2,
  CHART_TOKEN.chart3,
  CHART_TOKEN.chart4,
  CHART_TOKEN.chart5,
] as const;

/** Color de la serie N, salvo override explícito (token o var). */
export function seriesColor(index: number, override?: string): string {
  if (override) return override;
  return CHART_PALETTE[index % CHART_PALETTE.length] ?? CHART_TOKEN.chart1;
}

/** Colores resueltos para una lista de series (override respeta token/var). */
export function seriesColors(series: Array<{ color?: string }>): string[] {
  return series.map((s, i) => seriesColor(i, s.color));
}
