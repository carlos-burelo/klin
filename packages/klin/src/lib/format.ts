/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { formatDefault, type ValueFormatter } from "./palette";
import { DEFAULT_LOCALE } from "./theme";

/** Formateador efectivo: override o `formatDefault` con locale (nunca undefined). */
export function resolveFormatter(
  format: ValueFormatter | undefined,
  locale: string = DEFAULT_LOCALE,
): ValueFormatter {
  return format ?? ((v: number) => formatDefault(v, locale));
}
