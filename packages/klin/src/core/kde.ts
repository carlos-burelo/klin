/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { quantileSorted } from "d3-array";
import { toNumber } from "./number";

/** Punto de la rejilla KDE (valor → densidad). */
export type KdePoint = {
  value: number;
  density: number;
};

/** Rejilla fija de la KDE gaussiana propia. */
export const KDE_BINS = 48;
/** Factor de Silverman y exponente del tamaño muestral (h = 1.06·σ·n^-0.2). */
export const SILVERMAN_FACTOR = 1.06;
export const SILVERMAN_EXPONENT = -0.2;
/** Divisor IQR→σ del fallback robusto (σ ≈ IQR / 1.34). */
export const IQR_SIGMA_DIVISOR = 1.34;
/** Últimos recursos si σ e IQR son cero: rango/10, luego 1. */
export const KDE_FALLBACK_RANGE_FRAC = 10;
export const KDE_FALLBACK_MIN = 1;
/** Normal de la gaussiana propia (constante histórica de la lib, fijada por pin). */
export const GAUSS_NORM = 0.204_179_955_571_658_05;

/** Limpia una muestra (no-finitos fuera). */
export function cleanValues(values: number[]): number[] {
  return values
    .map((v) => toNumber(v, Number.NaN))
    .filter((v) => Number.isFinite(v));
}

/**
 * Ancho de banda Silverman (1.06·sd·n^-0.2, fallback IQR; nunca ≤ 0).
 * Puro y determinista (igual en server y cliente).
 */
export function kdeBandwidth(values: number[]): number {
  const n = values.length;
  if (n === 0) return KDE_FALLBACK_MIN;
  const fall = n ** SILVERMAN_EXPONENT;
  const mean = values.reduce((acc, v) => acc + v, 0) / n;
  const sd = Math.sqrt(
    values.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / n,
  );
  if (Number.isFinite(sd) && sd > 0) return SILVERMAN_FACTOR * sd * fall;
  const sorted = [...values].sort((a, b) => a - b);
  const first = sorted[0] ?? 0;
  const last = sorted[sorted.length - 1] ?? 0;
  const q1 = quantileSorted(sorted, 0.25) ?? first;
  const q3 = quantileSorted(sorted, 0.75) ?? first;
  const sigma = (q3 - q1) / IQR_SIGMA_DIVISOR;
  if (Number.isFinite(sigma) && sigma > 0)
    return SILVERMAN_FACTOR * sigma * fall;
  const range = last - first;
  if (Number.isFinite(range) && range > 0)
    return range / KDE_FALLBACK_RANGE_FRAC;
  return KDE_FALLBACK_MIN;
}

/**
 * KDE gaussiana propia sobre rejilla fija (`bins` puntos en [lo, hi]).
 * `bandwidth` ≤ 0 o no-finito → Silverman. Nunca devuelve NaN.
 */
export function kdeOf(
  values: number[],
  bandwidth: number,
  lo: number,
  hi: number,
  bins: number = KDE_BINS,
): KdePoint[] {
  const n = values.length;
  if (n === 0) return [];
  const h =
    Number.isFinite(bandwidth) && bandwidth > 0
      ? bandwidth
      : kdeBandwidth(values);
  const safeH = h > 0 && Number.isFinite(h) ? h : KDE_FALLBACK_MIN;
  let a = lo;
  let b = hi;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return [];
  if (a > b) [a, b] = [b, a];
  if (a === b) {
    a -= safeH;
    b += safeH;
  }
  const count = Math.max(2, Math.floor(bins) || 2);
  const step = (b - a) / (count - 1);
  const points: KdePoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const v = a + step * i;
    let s = 0;
    for (const x of values) {
      const u = (v - x) / safeH;
      s += Math.exp(-0.5 * u * u);
    }
    points.push({ value: v, density: (s * GAUSS_NORM) / (n * safeH) });
  }
  return points;
}

/** Valor de la rejilla con densidad máxima (pico de la distribución). */
export function kdePeak(points: KdePoint[]): number {
  let best = points[0];
  for (const p of points) {
    if (best === undefined || p.density > best.density) best = p;
  }
  return best?.value ?? 0;
}
