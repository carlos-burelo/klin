/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { max, min } from "d3-array";
import { type ContourMultiPolygon, contourDensity } from "d3-contour";
import { type ScaleLinear, scaleLinear } from "d3-scale";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { GRID_TICKS } from "../core/theme";
import type {
  DensityPoint,
  PositionedDensityPoint,
} from "./density-contour-plot.types";

/** Ancho de banda gaussiano y niveles por defecto; tope de niveles. */
export const DEFAULT_BANDWIDTH = 20;
export const DEFAULT_LEVELS = 6;
export const MAX_LEVELS = 12;
export const MIN_LEVELS = 1;
/** Opacidad base de contorno + tramo escalonado por nivel. */
export const CONTOUR_MIN_OPACITY = 0.12;
export const CONTOUR_OPACITY_SPAN = 0.55;
/** Ticks del eje X y posición de sus etiquetas. */
export const X_TICKS = 5;
export const X_TICK_LABEL_OFFSET = 18;
/** Rango mínimo cuando el dominio colapsa a un punto. */
export const UNIT_RANGE = 1;

export type CleanDensityPoint = {
  x: number;
  y: number;
  label?: string;
};

/** Limpia la muestra (no-finitos fuera, cap determinista SSR). */
export function cleanDensityPoints(
  points: DensityPoint[],
  maxItems = DEFAULT_MAX_ROWS,
): CleanDensityPoint[] {
  const rawMax = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
  const clean: CleanDensityPoint[] = [];
  for (const p of points) {
    const x = toNumber(p.x, Number.NaN);
    const y = toNumber(p.y, Number.NaN);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    clean.push({ x, y, label: p.label });
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
export function densityScales(
  clean: CleanDensityPoint[],
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

/**
 * Cómputo puro de contornos de densidad (d3-contour sobre el grid del
 * viewBox + puntos posicionados; sin DOM, apto SSR).
 */
export function computeDensityContours(
  points: DensityPoint[],
  innerW: number,
  innerH: number,
  bandwidth = DEFAULT_BANDWIDTH,
  thresholds = DEFAULT_LEVELS,
  gridTicks = GRID_TICKS,
  maxItems = DEFAULT_MAX_ROWS,
) {
  const clean = cleanDensityPoints(points, maxItems);
  const empty: {
    contours: ContourMultiPolygon[];
    positioned: PositionedDensityPoint[];
  } = { contours: [], positioned: [] };
  if (clean.length === 0 || !(innerW > 0) || !(innerH > 0)) return empty;
  const { x, y } = densityScales(clean, innerW, innerH, gridTicks);
  const positioned: PositionedDensityPoint[] = clean.map((p) => ({
    ...p,
    px: x(p.x),
    py: y(p.y),
  }));
  const rawBw = toNumber(bandwidth, DEFAULT_BANDWIDTH);
  const safeBw =
    Number.isFinite(rawBw) && rawBw > 0 ? rawBw : DEFAULT_BANDWIDTH;
  const rawLevels =
    Math.floor(toNumber(thresholds, DEFAULT_LEVELS)) || DEFAULT_LEVELS;
  const levels = Math.min(MAX_LEVELS, Math.max(MIN_LEVELS, rawLevels));
  const contours = contourDensity<PositionedDensityPoint>()
    .x((d) => d.px)
    .y((d) => d.py)
    .size([Math.round(innerW), Math.round(innerH)])
    .bandwidth(safeBw)
    .thresholds(levels)(positioned);
  return { contours, positioned };
}

/** Anillos GeoJSON del contorno → path SVG (coordenadas ya en píxeles). */
export function contourPath(contour: ContourMultiPolygon): string {
  const parts: string[] = [];
  for (const polygon of contour.coordinates) {
    for (const ring of polygon) {
      const line = ring.map((pt) => `${pt[0] ?? 0},${pt[1] ?? 0}`).join("L");
      if (line.length > 0) parts.push(`M${line}Z`);
    }
  }
  return parts.join("");
}
