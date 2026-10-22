/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { clamp01, toNumber } from "../core/number";
import { PERCENT_FACTOR } from "../core/theme";
import type { ChartMargin } from "../render/chart-svg";
import type { QuadrantPoint } from "./quadrant-chart.types";

export const W = 560;
export const H = 460;
export const MARGIN: ChartMargin = { top: 36, right: 16, bottom: 36, left: 16 };
/** Posición de etiquetas de cuadrante, radio y opacidades de fondo. */
export const QUAD_LABEL_PAD_X = 10;
export const QUAD_LABEL_PAD_TOP = 18;
export const QUAD_LABEL_PAD_BOTTOM = 10;
export const QUAD_RADIUS = 8;
export const QUAD_FILL_HIGH = 0.12;
export const QUAD_FILL_LOW = 0.05;
export const QUAD_POINT_OPACITY = 0.85;
/** Tipografía de etiqueta de cuadrante e índice/label de punto. */
export const QUAD_LABEL_FONT_SIZE = 12;
export const QUAD_INDEX_FONT_SIZE = 8;
export const QUAD_INDEX_FONT_WEIGHT = 700;
export const QUAD_INDEX_DY = 3.5;
export const QUAD_POINT_LABEL_DY = 13;
/** Separación del eje inferior y posición de la etiqueta Y. */
export const AXIS_LABEL_BOTTOM_PAD = 6;
export const Y_LABEL_X = 10;
/** Máximo de truncado de etiqueta de punto. */
export const LABEL_MAX_POINT = 16;
/** Sin conteos por defecto (etiquetas limpias, como hasta ahora). */
export const DEFAULT_QUADRANT_SHOW_COUNTS = false;
/** Cruz centrada por defecto (50/50, como hasta ahora). */
export const DEFAULT_QUADRANT_THRESHOLD_X = 50;
/** Cruz centrada por defecto (50/50, como hasta ahora). */
export const DEFAULT_QUADRANT_THRESHOLD_Y = 50;

/**
 * Cómputo puro de posiciones del cuadrante ( clamp 0–100 → px ).
 * Normaliza valores externos con toNumber.
 * NO adopta `buildValueAxis`: dominio fijo 0–100, sin eje de valor.
 */
export function computeQuadrantPositions(
  points: QuadrantPoint[],
  height: number = H,
): Array<{
  cx: number;
  cy: number;
}> {
  const rawH = toNumber(height, H);
  const safeH = Number.isFinite(rawH) && rawH > 0 ? rawH : H;
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = safeH - MARGIN.top - MARGIN.bottom;
  return points.map((p) => ({
    cx: MARGIN.left + clamp01(toNumber(p.x) / PERCENT_FACTOR) * innerW,
    cy: MARGIN.top + (1 - clamp01(toNumber(p.y) / PERCENT_FACTOR)) * innerH,
  }));
}
