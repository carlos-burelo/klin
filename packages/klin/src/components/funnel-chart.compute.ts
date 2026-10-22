/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { topPositive } from "../core/domain";
import { toNumber } from "../core/number";
import { PERCENT_FACTOR } from "../core/theme";
import type { FunnelStage } from "./funnel-chart.types";

export const W = 640;
export const GAP = 6;
/** Ancho mínimo visible del trapecio. */
export const FUNNEL_MIN_W = 8;
/** Tipografía de la etiqueta de etapa y opacidad del valor. */
export const STAGE_LABEL_FONT_SIZE = 12;
export const STAGE_VALUE_OPACITY = 0.85;
/** Desplazamientos verticales de etiqueta y valor respecto al centro de fila. */
export const STAGE_LABEL_DY = 2;
export const STAGE_VALUE_DY = 14;

/** Base del % de la etiqueta. */
export type FunnelBaseline = "first" | "previous";

/** Conteos saneados: negativos a 0 (verbatim de la vista). */
export function cleanFunnelCounts(stages: FunnelStage[]): number[] {
  // Conteos: negativos se fijan a 0.
  return stages.map((s) => Math.max(0, toNumber(s.value)));
}

/** Tope positivo de la escala (verbatim de la vista). */
export function resolveFunnelTop(counts: number[]): number {
  return topPositive(counts);
}

/** Suma de conteos limpios. */
export function funnelTotal(counts: number[]): number {
  return counts.reduce((acc, n) => acc + n, 0);
}

/** Alto de fila según etapas (verbatim de la vista). */
export function computeFunnelRowH(
  stageCount: number,
  height: number,
  gap: number = GAP,
): number {
  return (height - gap * (stageCount - 1)) / stageCount;
}

/** Anchos del trapecio proporcionales al valor (verbatim de la vista). */
export function funnelBarWidths(
  value: number,
  next: number,
  top: number,
  minWidth: number = FUNNEL_MIN_W,
): { wTop: number; wBottom: number } {
  return {
    wTop: Math.max(minWidth, (value / top) * W),
    wBottom: Math.max(minWidth, (next / top) * W),
  };
}

/** Conversión vs inicio y vs etapa previa (verbatim de la vista). */
export function funnelPercents(
  value: number,
  first: number,
  prev: number,
  index: number,
): { conv: number; step: number } {
  const conv =
    index === 0
      ? PERCENT_FACTOR
      : Math.round(((value / first) * PERCENT_FACTOR || 0) * 10) / 10;
  const step =
    index === 0 || prev <= 0
      ? 0
      : Math.round(((value / prev) * PERCENT_FACTOR || 0) * 10) / 10;
  return { conv, step };
}

/** Separación entre etapas normalizada (GAP actual). */
export function normalizeFunnelGap(gap: unknown): number {
  return Math.max(0, toNumber(gap, GAP));
}

/** Ancho mínimo del trapecio normalizado (FUNNEL_MIN_W actual). */
export function normalizeFunnelMinWidth(minWidth: unknown): number {
  return Math.max(0, toNumber(minWidth, FUNNEL_MIN_W));
}
