/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { maxFinite, minFinite, toNumber } from "./number";

/**
 * Dominio lineal que siempre incluye el 0 (barras/líneas honestas con
 * negativos). Filtra no-finitos; vacío o todo-cero → [0, 1].
 */
export function domainWithZero(
  values: Array<unknown>,
  fallback: readonly [number, number] = [0, 1] as const,
): [number, number] {
  const lo = minFinite(values);
  const hi = maxFinite(values);
  if (!Number.isFinite(lo) || !Number.isFinite(hi))
    return [fallback[0], fallback[1]];
  const d0 = Math.min(0, lo);
  const d1 = Math.max(0, hi);
  if (d0 === d1) return [fallback[0], fallback[1]];
  return [d0, d1];
}

/** Tope positivo para escalas de conteo (histograma, funnel). */
export function topPositive(values: Array<unknown>, fallback = 1): number {
  const hi = maxFinite(values);
  if (!Number.isFinite(hi)) return fallback;
  return Math.max(fallback, Math.max(0, hi));
}

/**
 * Dominio logarítmico sobre valores positivos (escalas `log`).
 * Ignora ceros, negativos y no-finitos; sin positivos → [1, 10].
 */
export function logDomain(
  values: Array<unknown>,
  fallback: readonly [number, number] = [1, 10] as const,
): [number, number] {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;
  for (const v of values) {
    const n = toNumber(v, Number.NaN);
    if (!Number.isFinite(n) || n <= 0) continue;
    if (n < lo) lo = n;
    if (n > hi) hi = n;
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi))
    return [fallback[0], fallback[1]];
  if (lo === hi) return [lo / 10, hi * 10];
  return [lo, hi];
}

/**
 * Fija un valor al piso del dominio log (los no-positivos se dibujan
 * en la base; el tip conserva el valor crudo).
 */
export function logFloor(value: number, floor: number): number {
  if (!Number.isFinite(value) || value <= 0) return floor;
  return value;
}
