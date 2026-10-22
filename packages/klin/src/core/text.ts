/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { ELLIPSIS, LABEL_MAX_DEFAULT } from "./theme";

/** Trunca etiquetas de eje de forma determinista (igual en server y cliente). */
export function truncateLabel(label: string, max = LABEL_MAX_DEFAULT): string {
  if (max < 2) return ELLIPSIS;
  const chars = Array.from(label);
  return chars.length > max
    ? `${chars.slice(0, max - 1).join("")}${ELLIPSIS}`
    : label;
}
