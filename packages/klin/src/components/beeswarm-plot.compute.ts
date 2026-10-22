/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { forceCollide, forceSimulation, forceX, forceY } from "d3-force";
import { scaleLinear } from "d3-scale";
import { domainWithZero } from "../core/domain";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { GRID_TICKS, NETWORK_SEED, POINT_RADIUS_SCATTER } from "../core/theme";
import type {
  BeeswarmPoint,
  PositionedBeeswarmPoint,
} from "./beeswarm-plot.types";

export const BEESWARM_TICKS = 300;
export const BEESWARM_FORCE_X = 1;
export const BEESWARM_FORCE_Y = 0.1;
export const BEESWARM_COLLIDE_PAD = 1;
export const BEESWARM_X_TICKS = 5;
export const BEESWARM_AXIS_LABEL_OFFSET = 10;
/** Mínimo de ticks y separación de la etiqueta de valor. */
export const TICKS_MIN = 1;
export const VALUE_LABEL_GAP = 4;

/** LCG determinista: mismo enjambre, mismo dibujo (SSR estable). */
function seededRandom(seed: number): () => number {
  const LCG_MULT = 1664525;
  const LCG_INCR = 1013904223;
  const LCG_MOD = 4294967296;
  let s = seed >>> 0;
  return () => {
    s = (s * LCG_MULT + LCG_INCR) >>> 0;
    return s / LCG_MOD;
  };
}

/** Escala X lineal del enjambre (dominio honesto con cero o recorte fijo). */
export function beeswarmScale(
  values: number[],
  innerW: number,
  domain?: [number, number],
  ticks: number = GRID_TICKS,
) {
  const auto = domainWithZero(values);
  const fixedLo =
    domain === undefined ? Number.NaN : toNumber(domain[0], Number.NaN);
  const fixedHi =
    domain === undefined ? Number.NaN : toNumber(domain[1], Number.NaN);
  const lo = Number.isFinite(fixedLo) ? fixedLo : auto[0];
  const hi = Number.isFinite(fixedHi) ? fixedHi : auto[1];
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(ticks, GRID_TICKS)),
  );
  return scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(safeTicks)
    .range([0, innerW]);
}

/**
 * Cómputo puro de posiciones (fuerza X al valor escalado, Y al centro,
 * colisión radio+1; BEESWARM_TICKS ticks con semilla fija).
 * Trunca determinista a los primeros DEFAULT_MAX_ROWS puntos para SSR.
 */
export function computeBeeswarmPositions(
  points: BeeswarmPoint[],
  innerW: number,
  innerH: number,
  radius = POINT_RADIUS_SCATTER,
  seed = NETWORK_SEED,
  domain?: [number, number],
  ticks: number = GRID_TICKS,
): PositionedBeeswarmPoint[] {
  const r = Math.max(0, toNumber(radius, POINT_RADIUS_SCATTER));
  const clean: BeeswarmPoint[] = [];
  for (const p of points) {
    const value = toNumber(p.value, Number.NaN);
    if (!Number.isFinite(value)) continue;
    clean.push({ value, label: p.label, color: p.color });
    if (clean.length >= DEFAULT_MAX_ROWS) break;
  }
  if (clean.length === 0 || !(innerW > 0) || !(innerH > 0)) return [];

  const x = beeswarmScale(
    clean.map((p) => p.value),
    innerW,
    domain,
    ticks,
  );
  const centerY = innerH / 2;
  type SimNode = {
    value: number;
    label?: string;
    color?: string;
    x: number;
    y: number;
  };
  const simNodes: SimNode[] = clean.map((p) => ({
    ...p,
    x: x(p.value),
    y: centerY,
  }));
  const sim = forceSimulation(simNodes)
    .randomSource(seededRandom(seed))
    .force("x", forceX<SimNode>((d) => x(d.value)).strength(BEESWARM_FORCE_X))
    .force("y", forceY<SimNode>(centerY).strength(BEESWARM_FORCE_Y))
    .force("collide", forceCollide<SimNode>(r + BEESWARM_COLLIDE_PAD))
    .stop();
  for (let i = 0; i < BEESWARM_TICKS; i++) sim.tick();

  return simNodes.map((n) => ({
    value: n.value,
    label: n.label,
    color: n.color,
    x: n.x,
    y: Math.min(Math.max(n.y, r), innerH - r),
  }));
}
