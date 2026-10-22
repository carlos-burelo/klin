/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { arc } from "d3-shape";
import { clamp01, toNumber } from "../core/number";
import { PERCENT_FACTOR } from "../core/theme";

export const START = -Math.PI;
export const END = 0;
/** Tamaño del valor central, etiqueta y relleno inferior del lienzo. */
export const CENTER_VALUE_FONT_SIZE = 26;
export const CENTER_VALUE_DY = 8;
export const CENTER_LABEL_DY = 6;
export const GAUGE_BOTTOM_PAD = 22;
/** Separación de marcas y etiquetas de escala. */
export const TICK_OUTER_OFFSET = 6;
export const TICK_INNER_OFFSET = 12;
export const TICK_LABEL_OFFSET = 12;
export const TICK_LABEL_DY = 3;
/** Fracciones de la escala donde van las marcas (0–100 por defecto). */
export const GAUGE_TICK_FRACS = [0, 0.25, 0.5, 0.75, 1];
/** Margen de la punta de la aguja y radio/grosor del buje. */
export const NEEDLE_TIP_INSET = 10;
export const NEEDLE_HUB_RADIUS = 5;
export const NEEDLE_WIDTH = 3;

/** Escala normalizada del velocímetro. */
export type GaugeScale = {
  lo: number;
  hi: number;
  frac: number;
  clamped: number;
};

/** Normaliza la escala del velocímetro (verbatim de la vista). */
export function normalizeGaugeScale(
  numeric: number,
  min: number,
  max: number,
): GaugeScale {
  const lo = toNumber(min);
  const rawHi = toNumber(max);
  const hi = rawHi > lo ? rawHi : lo + PERCENT_FACTOR;
  const frac = clamp01((numeric - lo) / (hi - lo));
  const clamped = lo + frac * (hi - lo);
  return { lo, hi, frac, clamped };
}

/** Radio exterior e interior según size/thickness (verbatim de la vista). */
export function gaugeRadii(
  size: number,
  thickness: number,
): { radius: number; inner: number } {
  const radius = size / 2;
  const inner = radius - thickness;
  return { radius, inner };
}

/** Arco de fondo del semicírculo (verbatim de la vista). */
export function buildGaugeBackground(
  inner: number,
  radius: number,
): string | null {
  const datum = { innerRadius: inner, outerRadius: radius };
  return arc().innerRadius(inner).outerRadius(radius)({
    ...datum,
    startAngle: START,
    endAngle: END,
  });
}

/** Arco de valor hasta la fracción (verbatim de la vista). */
export function buildGaugeForeground(
  inner: number,
  radius: number,
  frac: number,
): string | null {
  const datum = { innerRadius: inner, outerRadius: radius };
  return arc().innerRadius(inner).outerRadius(radius)({
    ...datum,
    startAngle: START,
    endAngle: START + frac * Math.PI,
  });
}

/** Punta de la aguja en coords del svg (verbatim de la vista). */
export function gaugeNeedleTip(
  radius: number,
  frac: number,
): { x: number; y: number } {
  const needleAngle = START + frac * Math.PI;
  const needleLen = Math.max(0, radius - NEEDLE_TIP_INSET);
  return {
    x: radius + needleLen * Math.cos(needleAngle),
    y: radius + needleLen * Math.sin(needleAngle),
  };
}

/** Fracciones de marcas: clásicas por defecto, equidistantes si `tickCount`. */
export function normalizeGaugeTickFracs(tickCount: unknown): number[] {
  if (tickCount === undefined || tickCount === null) {
    return [...GAUGE_TICK_FRACS];
  }
  const n = Math.floor(toNumber(tickCount, GAUGE_TICK_FRACS.length));
  if (!Number.isFinite(n) || n <= 0) return [];
  if (n === 1) return [0];
  return Array.from({ length: n }, (_, i) => i / (n - 1));
}

/** Tramo de zona ya en fracciones 0–1 (recortado a la escala). */
export type GaugeZoneFrac = {
  fromFrac: number;
  toFrac: number;
  color: string;
};

/** Zonas en fracciones 0–1, recortadas a `[lo, hi]` (vacío si no hay). */
export function normalizeGaugeZones(
  lo: number,
  hi: number,
  zones: unknown,
): GaugeZoneFrac[] {
  if (!Array.isArray(zones) || hi <= lo) return [];
  const segs: GaugeZoneFrac[] = [];
  for (const z of zones) {
    if (z === null || typeof z !== "object") continue;
    const rec = z as { from?: unknown; to?: unknown; color?: unknown };
    if (typeof rec.color !== "string" || rec.color === "") continue;
    const from = clamp01((toNumber(rec.from, lo) - lo) / (hi - lo));
    const to = clamp01((toNumber(rec.to, lo) - lo) / (hi - lo));
    if (!(to > from)) continue;
    segs.push({ fromFrac: from, toFrac: to, color: rec.color });
  }
  return segs;
}

/** Arco de una zona entre fracciones (verbatim del fondo). */
export function buildGaugeZonePath(
  inner: number,
  radius: number,
  fromFrac: number,
  toFrac: number,
): string | null {
  const datum = { innerRadius: inner, outerRadius: radius };
  return arc().innerRadius(inner).outerRadius(radius)({
    ...datum,
    startAngle: START + fromFrac * Math.PI,
    endAngle: START + toFrac * Math.PI,
  });
}

/** Geometría de una marca de escala (verbatim de la vista). */
export type GaugeTick = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  lx: number;
  ly: number;
  value: number;
};

export function gaugeTick(
  f: number,
  radius: number,
  inner: number,
  lo: number,
  hi: number,
): GaugeTick {
  const a = START + f * Math.PI;
  const r1 = inner - TICK_OUTER_OFFSET;
  const r2 = inner - TICK_INNER_OFFSET;
  return {
    x1: radius + r1 * Math.cos(a),
    y1: radius + r1 * Math.sin(a),
    x2: radius + r2 * Math.cos(a),
    y2: radius + r2 * Math.sin(a),
    lx: radius + (r2 - TICK_LABEL_OFFSET) * Math.cos(a),
    ly: radius + (r2 - TICK_LABEL_OFFSET) * Math.sin(a),
    value: lo + f * (hi - lo),
  };
}
