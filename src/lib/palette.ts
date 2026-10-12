/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { ELLIPSIS, LABEL_MAX_DEFAULT, MISSING_VALUE } from "./theme";

/** Paleta por defecto: tokens del tema (claro/oscuro automáticos). */
export const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

/** Color de la serie N, salvo override explícito (token o var). */
export function seriesColor(index: number, override?: string): string {
  if (override) return override;
  return CHART_PALETTE[index % CHART_PALETTE.length] ?? "var(--chart-1)";
}

/** Formateador de valores numéricos (unifica formatY/formatX/formatValue). */
export type ValueFormatter = (value: number) => string;

/** Formato de un valor numérico (locale configurable, no-finitos → "—"). */
export function formatDefault(
  value: number,
  locale = "es-MX",
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
