/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  ELLIPSIS,
  LABEL_MAX_DEFAULT,
  MISSING_VALUE,
} from "./theme";

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

/** Formateador de valores numéricos (unifica format/formatX/formatY). */
export type ValueFormatter = (value: number) => string;

/** Formato de un valor numérico (locale configurable, no-finitos → "—"). */
export function formatDefault(
  value: number,
  locale = DEFAULT_LOCALE,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 1 },
): string {
  if (!Number.isFinite(value)) return MISSING_VALUE;
  return value.toLocaleString(locale, options);
}

/** Colores resueltos para una lista de series (override respeta token/var). */
export function seriesColors(series: Array<{ color?: string }>): string[] {
  return series.map((s, i) => seriesColor(i, s.color));
}

/** Trunca etiquetas de eje de forma determinista (igual en server y cliente). */
export function truncateLabel(label: string, max = LABEL_MAX_DEFAULT): string {
  if (max < 2) return ELLIPSIS;
  const chars = Array.from(label);
  return chars.length > max
    ? `${chars.slice(0, max - 1).join("")}${ELLIPSIS}`
    : label;
}
