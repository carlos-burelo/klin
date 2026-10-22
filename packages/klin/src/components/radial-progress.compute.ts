/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { arc } from "d3-shape";
import { clamp01, toNumber } from "../core/number";
import { PERCENT_FACTOR } from "../core/theme";

export const START = -Math.PI / 2;
export const TAU = Math.PI * 2;
/** Tamaño del valor central y desplazamientos del valor/etiqueta. */
export const CENTER_VALUE_FONT_SIZE = 24;
export const CENTER_VALUE_DY = 6;
export const CENTER_VALUE_DY_WITH_LABEL = -2;
export const CENTER_LABEL_DY = 16;
/** Máximo de truncado de la etiqueta inferior. */
export const LABEL_MAX = 18;
/** Segmentos de la pista punteada y fracción de hueco entre ellos. */
export const TRACK_TICK_COUNT = 48;
export const TRACK_TICK_GAP_RATIO = 0.35;

/** Escala normalizada del progreso radial. */
export type RadialScale = {
  lo: number;
  hi: number;
  frac: number;
  clamped: number;
};

/** Normaliza la escala del progreso radial (verbatim de la vista). */
export function normalizeRadialScale(
  numeric: number,
  min: number,
  max: number,
): RadialScale {
  const lo = toNumber(min);
  const rawHi = toNumber(max);
  const hi = rawHi > lo ? rawHi : lo + PERCENT_FACTOR;
  const frac = clamp01((numeric - lo) / (hi - lo));
  const clamped = lo + frac * (hi - lo);
  return { lo, hi, frac, clamped };
}

/** Radio exterior e interior según size/thickness (verbatim de la vista). */
export function radialRadii(
  size: number,
  thickness: number,
): { radius: number; inner: number } {
  const radius = size / 2;
  const inner = radius - thickness;
  return { radius, inner };
}

/** Ángulo inicial normalizado (START = arriba actual). */
export function normalizeRadialStartAngle(startAngle: unknown): number {
  return toNumber(startAngle, START);
}

/** Arco de fondo del círculo completo (verbatim de la vista). */
export function buildRadialBackground(
  inner: number,
  radius: number,
  start: number = START,
): string | null {
  return arc().innerRadius(inner).outerRadius(radius)({
    innerRadius: inner,
    outerRadius: radius,
    startAngle: start,
    endAngle: start + TAU,
  });
}

/** Paso y hueco de los segmentos de la pista punteada (verbatim). */
export function radialTickGeometry(): { tickStep: number; tickGap: number } {
  const tickStep = TAU / TRACK_TICK_COUNT;
  const tickGap = tickStep * TRACK_TICK_GAP_RATIO;
  return { tickStep, tickGap };
}

/** Segmento i de la pista punteada (verbatim de la vista). */
export function buildRadialTick(
  inner: number,
  radius: number,
  index: number,
  tickStep: number,
  tickGap: number,
  start: number = START,
): string {
  return (
    arc().innerRadius(inner).outerRadius(radius)({
      innerRadius: inner,
      outerRadius: radius,
      startAngle: start + index * tickStep,
      endAngle: start + (index + 1) * tickStep - tickGap,
    }) ?? ""
  );
}

/** Arco de valor hasta la fracción (verbatim de la vista). */
export function buildRadialForeground(
  inner: number,
  radius: number,
  thickness: number,
  frac: number,
  start: number = START,
): string | null {
  return arc()
    .innerRadius(inner)
    .outerRadius(radius)
    .cornerRadius(thickness / 2)({
    innerRadius: inner,
    outerRadius: radius,
    startAngle: start,
    endAngle: start + frac * TAU,
  });
}
