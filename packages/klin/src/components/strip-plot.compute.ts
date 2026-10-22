/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { toNumber } from "../core/number";

export const GROUP_BAND_PADDING = 0.45;
/** Jitter por defecto (fracción del semiancho de banda). */
export const DEFAULT_JITTER = 0.7;
/** Semilla por defecto del jitter determinista. */
export const DEFAULT_JITTER_SEED = 42;
/** Opacidad de punto (las acumulaciones se leen por densidad). */
export const STRIP_FILL_OPACITY = 0.8;

/**
 * PRNG mulberry32 (determinista: mismo seed, mismos offsets en
 * servidor y cliente). Rango [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let a = toNumber(seed, DEFAULT_JITTER_SEED) >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Desplazamientos horizontales deterministas para una muestra
 * (`halfW` = semiancho útil de banda). Exportado para pruebas.
 */
export function computeStripPositions(
  count: number,
  seed: number,
  halfW: number,
): number[] {
  const rand = mulberry32(seed);
  return Array.from(
    { length: Math.max(0, count) },
    () => (rand() * 2 - 1) * halfW,
  );
}
