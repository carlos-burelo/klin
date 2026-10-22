/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { max } from "d3-array";
import { seriesColor } from "../core/color";
import { clamp01, toNumber } from "../core/number";
import { LINE_WIDTH, POINT_RADIUS_RADAR } from "../core/theme";
import type { RadarSeries } from "./radar-chart.types";

/** Relleno exterior del lienzo, separación de etiquetas y relleno de serie. */
export const RADAR_OUTER_PAD = 44;
export const AXIS_LABEL_OFFSET = 14;
export const RADAR_FILL_OPACITY = 0.18;
/** Forma de retícula por defecto (polígonos actuales). */
export const DEFAULT_RADAR_GRID_SHAPE = "polygon" as const;

/** Forma de la retícula de niveles del radar. */
export type RadarGridShape = "polygon" | "circle";

/** Centro del radar (verbatim de la vista). */
export function radarCenter(size: number): number {
  return size / 2;
}

/** Radio útil del radar (verbatim de la vista). */
export function radarRadius(size: number): number {
  return size / 2 - RADAR_OUTER_PAD;
}

/** Tope radial ≥ 1 (verbatim de la vista). */
export function computeRadarTop(
  series: RadarSeries[],
  maxValue?: number,
): number {
  return Math.max(
    1,
    toNumber(maxValue ?? max(series.flatMap((s) => s.values)) ?? 1),
  );
}

/** Ángulo del eje i (verbatim de la vista). */
export function radarAngle(i: number, axesLength: number): number {
  return (Math.PI * 2 * i) / axesLength - Math.PI / 2;
}

/** Punto radial como "x,y" (verbatim de la vista). */
export function radarPoint(
  center: number,
  radius: number,
  top: number,
  useSqrt: boolean,
  axesLength: number,
  i: number,
  v: number,
): string {
  const ratio = Math.max(0, toNumber(v)) / top;
  const r = (useSqrt ? Math.sqrt(ratio) : ratio) * radius;
  return `${center + r * Math.cos(radarAngle(i, axesLength))},${center + r * Math.sin(radarAngle(i, axesLength))}`;
}

/** Opacidad de la serie si (verbatim de la vista). */
export function resolveRadarOpacity(
  fillOpacity: number | number[],
  si: number,
): number {
  return clamp01(
    toNumber(
      Array.isArray(fillOpacity) ? fillOpacity[si] : fillOpacity,
      RADAR_FILL_OPACITY,
    ),
  );
}

/** Colores por serie (verbatim de la vista). */
export function radarSeriesColors(series: RadarSeries[]): string[] {
  return series.map((s, i) => seriesColor(i, s.color));
}

/** Radio del nivel `frac` (círculos de retícula, verbatim de la vista). */
export function radarLevelRadius(
  radius: number,
  useSqrt: boolean,
  frac: number,
): number {
  return (useSqrt ? Math.sqrt(frac) : frac) * radius;
}

/** Grosor de línea de serie normalizado (actual LINE_WIDTH). */
export function normalizeRadarStrokeWidth(strokeWidth: unknown): number {
  return Math.max(0, toNumber(strokeWidth, LINE_WIDTH));
}

/** Radio de vértice normalizado (actual POINT_RADIUS_RADAR). */
export function normalizeRadarPointRadius(pointRadius: unknown): number {
  return Math.max(0, toNumber(pointRadius, POINT_RADIUS_RADAR));
}
