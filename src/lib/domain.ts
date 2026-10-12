/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { maxFinite, minFinite } from "./number";

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
