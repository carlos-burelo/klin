/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
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

/** Número con formato es-MX (1,234.5). */
export function formatDefault(value: number): string {
  return value.toLocaleString("es-MX", { maximumFractionDigits: 1 });
}

/** Trunca etiquetas de eje de forma determinista (igual en server y cliente). */
export function truncateLabel(label: string, max = 14): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}
