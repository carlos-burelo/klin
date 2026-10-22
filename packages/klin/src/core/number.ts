/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

/** Convierte un valor desconocido a número finito (fallback 0). */
export function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Suma segura sobre una lista (ignora no-finitos como 0). */
export function sumNumbers(values: Array<unknown>): number {
  let acc = 0;
  for (const v of values) acc += toNumber(v);
  return acc;
}

/** Mínimo finito de una lista (Infinity si vacía/sin finitos). */
export function minFinite(values: Array<unknown>): number {
  let m = Number.POSITIVE_INFINITY;
  for (const v of values) {
    const n = toNumber(v, Number.NaN);
    if (Number.isFinite(n) && n < m) m = n;
  }
  return m;
}

/** Máximo finito de una lista (-Infinity si vacía/sin finitos). */
export function maxFinite(values: Array<unknown>): number {
  let m = Number.NEGATIVE_INFINITY;
  for (const v of values) {
    const n = toNumber(v, Number.NaN);
    if (Number.isFinite(n) && n > m) m = n;
  }
  return m;
}

/** Fija un número al rango [0, 1]. */
export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}
