/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { max, min } from "d3-array";
import { hexbin } from "d3-hexbin";
import { type ScaleLinear, scaleLinear } from "d3-scale";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { GRID_TICKS } from "../core/theme";
import type { HexCell, HexPoint } from "./hexbin-plot.types";

/** Radio por defecto y radio mínimo aceptado. */
export const DEFAULT_HEX_RADIUS = 12;
export const MIN_HEX_RADIUS = 2;
/** Opacidad base de celda + tramo proporcional al conteo. */
export const HEX_MIN_OPACITY = 0.15;
export const HEX_OPACITY_SPAN = 0.75;
/** Ticks del eje X y posición de sus etiquetas. */
export const X_TICKS = 5;
export const X_TICK_LABEL_OFFSET = 18;
/** Rango mínimo cuando el dominio colapsa a un punto. */
export const UNIT_RANGE = 1;

export type CleanHexPoint = {
  x: number;
  y: number;
};

/** Limpia la muestra (no-finitos fuera, cap determinista SSR). */
export function cleanHexPoints(
  points: HexPoint[],
  maxItems = DEFAULT_MAX_ROWS,
): CleanHexPoint[] {
  const rawMax = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
  const clean: CleanHexPoint[] = [];
  for (const p of points) {
    const x = toNumber(p.x, Number.NaN);
    const y = toNumber(p.y, Number.NaN);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    clean.push({ x, y });
    if (clean.length >= safeMax) break;
  }
  return clean;
}

/** Ticks válidos (fuera de rango o no-finito → defecto). */
export function safeGridTicks(gridTicks: number): number {
  const raw = Math.floor(toNumber(gridTicks, GRID_TICKS));
  return Number.isFinite(raw) && raw > 0 ? raw : GRID_TICKS;
}

/**
 * Escalas lineales honestas (incluyen el cero, como scatter-plot).
 * NO adopta `buildValueAxis`: escalas XY dobles con dominio desde cero +
 * `.nice()`, sin variante canónica de un solo eje de valor.
 */
export function hexScales(
  clean: CleanHexPoint[],
  innerW: number,
  innerH: number,
  gridTicks = GRID_TICKS,
): { x: ScaleLinear<number, number>; y: ScaleLinear<number, number> } {
  const ticks = safeGridTicks(gridTicks);
  const xs = clean.map((p) => p.x);
  const ys = clean.map((p) => p.y);
  const loX = Math.min(0, min(xs) ?? 0);
  let hiX = max(xs) ?? UNIT_RANGE;
  if (!(hiX > loX)) hiX = loX + UNIT_RANGE;
  const loY = Math.min(0, min(ys) ?? 0);
  let hiY = max(ys) ?? UNIT_RANGE;
  if (!(hiY > loY)) hiY = loY + UNIT_RANGE;
  const x = scaleLinear().domain([loX, hiX]).nice(ticks).range([0, innerW]);
  const y = scaleLinear().domain([loY, hiY]).nice(ticks).range([innerH, 0]);
  return { x, y };
}

/** Radio válido (fuera de rango o no-finito → defecto). */
export function safeHexRadius(radius: number): number {
  const r = toNumber(radius, DEFAULT_HEX_RADIUS);
  return Number.isFinite(r) && r >= MIN_HEX_RADIUS ? r : DEFAULT_HEX_RADIUS;
}

/**
 * Cómputo puro de celdas hexagonales (d3-hexbin sobre x/y lineales;
 * sin DOM, apto SSR). Retorna celdas, total, conteo máximo y el path
 * del hexágono unitario.
 */
export function computeHexbins(
  points: HexPoint[],
  innerW: number,
  innerH: number,
  radius = DEFAULT_HEX_RADIUS,
  gridTicks = GRID_TICKS,
  maxItems = DEFAULT_MAX_ROWS,
) {
  const safeR = safeHexRadius(radius);
  const clean = cleanHexPoints(points, maxItems);
  const empty: { bins: HexCell[]; total: number; maxCount: number } = {
    bins: [],
    total: 0,
    maxCount: 0,
  };
  if (clean.length === 0 || !(innerW > 0) || !(innerH > 0)) {
    return {
      ...empty,
      hexagon: hexbin().radius(safeR).hexagon(),
      radius: safeR,
    };
  }
  const { x, y } = hexScales(clean, innerW, innerH, gridTicks);
  const pixels = clean.map((p) => ({ px: x(p.x), py: y(p.y) }));
  const generator = hexbin<{ px: number; py: number }>()
    .x((d) => d.px)
    .y((d) => d.py)
    .extent([
      [0, 0],
      [innerW, innerH],
    ])
    .radius(safeR);
  const raw = generator(pixels);
  let maxCount = 0;
  for (const b of raw) maxCount = Math.max(maxCount, b.length);
  const bins: HexCell[] = raw.map((b) => ({
    x: b.x,
    y: b.y,
    count: b.length,
  }));
  return {
    bins,
    total: clean.length,
    maxCount,
    hexagon: generator.hexagon(),
    radius: safeR,
  };
}
