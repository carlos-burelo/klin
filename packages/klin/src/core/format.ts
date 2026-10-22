/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { DEFAULT_LOCALE, MISSING_VALUE } from "./theme";

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

/** Formateador efectivo: override o `formatDefault` con locale (nunca undefined). */
export function resolveFormatter(
  format: ValueFormatter | undefined,
  locale: string = DEFAULT_LOCALE,
): ValueFormatter {
  return format ?? ((v: number) => formatDefault(v, locale));
}
