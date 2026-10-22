/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

/** Sin % por defecto (solo valores absolutos, como hasta ahora). */
export const DEFAULT_VENN_SHOW_PERCENT = false;

/**
 * Cómputo puro de la geometría fija del Venn (centros + regiones).
 * NO adopta `buildValueAxis`: sin eje de valor, geometría fija por tamaño.
 */
export function computeVennGeometry(
  count: 2 | 3,
  size: number,
): {
  r: number;
  pad: number;
  cy: number;
  centers: Array<{ x: number; y: number }>;
  regions: Array<{ sets: number[]; x: number; y: number }>;
} {
  const r = size * 0.26;
  const pad = 34;
  const cy = size / 2;
  const centers =
    count === 2
      ? [
          { x: size * 0.36, y: cy },
          { x: size * 0.64, y: cy },
        ]
      : [
          { x: size * 0.5, y: size * 0.36 },
          { x: size * 0.34, y: size * 0.64 },
          { x: size * 0.66, y: size * 0.64 },
        ];
  const regions =
    count === 2
      ? [
          { sets: [0], x: size * 0.24, y: cy },
          { sets: [1], x: size * 0.76, y: cy },
          { sets: [0, 1], x: size * 0.5, y: cy },
        ]
      : [
          { sets: [0], x: size * 0.5, y: size * 0.2 },
          { sets: [1], x: size * 0.22, y: size * 0.72 },
          { sets: [2], x: size * 0.78, y: size * 0.72 },
          { sets: [0, 1], x: size * 0.4, y: size * 0.5 },
          { sets: [0, 2], x: size * 0.6, y: size * 0.5 },
          { sets: [1, 2], x: size * 0.5, y: size * 0.72 },
          { sets: [0, 1, 2], x: size * 0.5, y: size * 0.57 },
        ];
  return { r, pad, cy, centers, regions };
}
