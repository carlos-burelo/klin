/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { GRID_TICKS } from "../core/theme";
import type { TernaryPoint } from "./ternary-plot.types";

/** Mitad del lado (x del vértice A) y altura del equilátero unitario. */
export const TERNARY_HALF = 0.5;
export const TERNARY_ALT = Math.sqrt(3) / 2;
/** Separación vértice-etiqueta. */
export const VERTEX_LABEL_GAP = 8;

export type TernaryClean = {
  a: number;
  b: number;
  c: number;
  label?: string;
  color?: string;
};

export type TernaryXY = { x: number; y: number };

/** Niveles de rejilla válidos (fuera de rango o no-finito → defecto). */
export function safeTernaryLevels(gridLevels: number): number {
  const raw = Math.floor(toNumber(gridLevels, GRID_TICKS));
  return Number.isFinite(raw) && raw > 0 ? raw : GRID_TICKS;
}

/** Tope de puntos válido (fuera de rango o no-finito → defecto). */
export function safeTernaryMax(maxItems: number): number {
  const raw = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_MAX_ROWS;
}

/**
 * Limpia puntos ternarios (normaliza a/b/c a suma 1; suma <= 0 fuera;
 * cap determinista SSR). Verbatim de la vista.
 */
export function cleanTernaryPoints(
  points: TernaryPoint[],
  maxItems = DEFAULT_MAX_ROWS,
): TernaryClean[] {
  const safeMax = safeTernaryMax(maxItems);
  const clean: TernaryClean[] = [];
  for (const p of points.slice(0, safeMax)) {
    const sum = toNumber(p.a) + toNumber(p.b) + toNumber(p.c);
    if (!(sum > 0)) continue;
    clean.push({
      a: toNumber(p.a) / sum,
      b: toNumber(p.b) / sum,
      c: toNumber(p.c) / sum,
      label: p.label,
      color: p.color,
    });
  }
  return clean;
}

/**
 * Geometría pura del triángulo equilátero (lado, alto, origen y
 * proyección baricéntrica → px). Verbatim de la vista.
 * NO adopta `buildValueAxis`: sin eje de valor, proyección ternaria fija.
 */
export function ternaryLayout(innerW: number, innerH: number) {
  const side = Math.min(innerW, innerH / TERNARY_ALT);
  const triH = side * TERNARY_ALT;
  return { side, triH };
}

/** Origen del triángulo centrado en el área interna. Verbatim de la vista. */
export function ternaryOrigin(
  innerW: number,
  innerH: number,
  side: number,
  triH: number,
  marginLeft: number,
  marginTop: number,
): TernaryXY {
  return {
    x: marginLeft + (innerW - side) / 2,
    y: marginTop + (innerH - triH) / 2,
  };
}

/** Proyección baricéntrica (a,b,c) → px. Verbatim de la vista. */
export function ternaryToXY(
  a: number,
  b: number,
  c: number,
  ox: number,
  oy: number,
  side: number,
  triH: number,
): TernaryXY {
  return {
    x: ox + side * (TERNARY_HALF * a + c),
    y: oy + triH * (b + c),
  };
}

/** Fracciones de rejilla por lado. Verbatim de la vista. */
export function ternaryLevels(safeLevels: number): number[] {
  const levels: number[] = [];
  for (let k = 1; k < safeLevels; k++) levels.push(k / safeLevels);
  return levels;
}
