/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { max, min } from "d3-array";
import { logDomain, logFloor } from "../core/domain";
import { sumNumbers, toNumber } from "../core/number";
import { type ValueScaleKind, valueScale } from "../core/scale";
import { GRID_TICKS } from "../core/theme";
import type { ScatterPoint } from "./scatter-plot.types";

export const X_TICKS = 5;
export const X_TICK_LABEL_OFFSET = 18;
export const X_LABEL_OFFSET = 2;
export const Y_LABEL_X = 12;
export const SCATTER_FILL_OPACITY = 0.75;
export const ANNOTATION_LABEL_DX = 4;
export const ANNOTATION_LABEL_DY = -4;
/** Mínimo de ticks del grid. */
export const TICKS_MIN = 1;

/** Ticks sanitizados (piso + mínimo 1; `GRID_TICKS` por defecto). */
export function resolveScatterTicks(gridTicks: unknown): number {
  return Math.max(TICKS_MIN, Math.floor(toNumber(gridTicks, GRID_TICKS)));
}

/** Radio de punto sanitizado (piso 0). */
export function resolveScatterRadius(
  pointRadius: unknown,
  fallback: number,
): number {
  return Math.max(0, toNumber(pointRadius, fallback));
}

export type CleanScatterPoint = {
  x: number;
  y: number;
  label?: string;
};

/** Filtra puntos no-finitos (convierte con toNumber). */
export function cleanScatterPoints(
  points: ScatterPoint[],
): CleanScatterPoint[] {
  return points
    .map((p) => ({
      x: toNumber(p.x, Number.NaN),
      y: toNumber(p.y, Number.NaN),
      label: p.label,
    }))
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
}

/** Dominios + escalas + elevadores log + ticks Y + medias. */
export function buildScatterScales(
  clean: CleanScatterPoint[],
  xScale: ValueScaleKind,
  yScale: ValueScaleKind,
  innerW: number,
  innerH: number,
  gridTicks: number = GRID_TICKS,
) {
  const xs = clean.map((p) => p.x);
  const ys = clean.map((p) => p.y);
  const safeTicks = resolveScatterTicks(gridTicks);
  const logX = xScale === "log";
  const logY = yScale === "log";
  const [xLo, xHi] = logX
    ? logDomain(xs)
    : ([Math.min(0, min(xs) ?? 0), max(xs) ?? 1] as const);
  const [yLo, yHi] = logY
    ? logDomain(ys)
    : ([Math.min(0, min(ys) ?? 0), max(ys) ?? 1] as const);
  const x = valueScale(logX ? "log" : "linear", [xLo, xHi], [0, innerW]).nice(
    safeTicks,
  );
  const y = valueScale(logY ? "log" : "linear", [yLo, yHi], [innerH, 0]).nice(
    safeTicks,
  );
  const lx = (v: number) => (logX ? logFloor(v, xLo) : v);
  const ly = (v: number) => (logY ? logFloor(v, yLo) : v);
  const ticks = y.ticks(safeTicks);
  const meanX = sumNumbers(xs) / xs.length;
  const meanY = sumNumbers(ys) / ys.length;
  return { x, y, lx, ly, ticks, meanX, meanY };
}
