/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { PERCENT_FACTOR } from "./theme";

/** Porcentaje entero 0–100 (total no positivo → 0, nunca NaN). */
export function pctOf(value: number, total: number): number {
  if (!(total > 0)) return 0;
  return Math.round((value / total) * PERCENT_FACTOR);
}

export type ShareTipOptions = {
  /** Contexto (grupo, categoría, fecha). */
  label: string;
  /** Nombre de la serie. */
  series: string;
  /** Valor ya formateado. */
  formatted: string;
  /** Valor crudo para el porcentaje. */
  value: number;
  /** Total de referencia (grupo o global). */
  total: number;
  /** Con una sola serie no hay parte que reportar. */
  multi: boolean;
  /** Base del porcentaje. */
  of: "grupo" | "total";
};

/** Tooltip canónico `contexto · serie: valor (parte)`. Sin ruido si no aplica. */
export function shareTip(o: ShareTipOptions): string {
  const base = `${o.label} · ${o.series}: ${o.formatted}`;
  if (!o.multi || !(o.total > 0)) return base;
  return `${base} (${pctOf(o.value, o.total)}% del ${o.of})`;
}
