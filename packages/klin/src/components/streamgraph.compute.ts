/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { max } from "d3-array";
import type { ScaleLinear, ScalePoint } from "d3-scale";
import { scaleLinear, scalePoint } from "d3-scale";
import type { CurveFactory, CurveFactoryLineOnly } from "d3-shape";
import {
  curveLinear,
  curveMonotoneX,
  curveStep,
  stack,
  stackOffsetNone,
  stackOffsetSilhouette,
  stackOffsetWiggle,
  stackOrderAscending,
  stackOrderDescending,
  stackOrderInsideOut,
  stackOrderNone,
  stackOrderReverse,
} from "d3-shape";
import { toNumber } from "../core/number";
import type { ChartSeries } from "../core/series";
import { CHART_TOKEN } from "../core/theme";
import type { StreamgraphProps } from "./streamgraph.types";

export const STREAM_MARGIN = {
  top: 12,
  right: 12,
  bottom: 32,
  left: 12,
} as const;
export const DEFAULT_HEIGHT = 280;
export const POINT_PADDING = 0.5;
export const AXIS_DY = 10;
export const LAYER_OPACITY = 0.85;
export const FALLBACK_SERIES_COLOR = CHART_TOKEN.chart1;

/** Desplazamientos d3 por nombre (canónico S). */
const STREAM_OFFSETS = {
  wiggle: stackOffsetWiggle,
  silhouette: stackOffsetSilhouette,
  zero: stackOffsetNone,
} as const;

/** Órdenes d3 por nombre (canónico S). */
const STREAM_ORDERS = {
  insideOut: stackOrderInsideOut,
  none: stackOrderNone,
  reverse: stackOrderReverse,
  ascending: stackOrderAscending,
  descending: stackOrderDescending,
} as const;

/** Orden del streamgraph (claves de STREAM_ORDERS). */
export type StreamOrderKind = keyof typeof STREAM_ORDERS;

/**
 * Cómputo puro de capas apiladas (wiggle + inside-out) y dominio Y.
 * Sanitiza valores externos con toNumber para evitar NaN en el stack.
 */
export function computeStreamLayers(
  data: Array<Record<string, string | number>>,
  series: ChartSeries[],
  xKey: string,
  offset: keyof typeof STREAM_OFFSETS = "wiggle",
  order: StreamOrderKind = "insideOut",
): {
  layers: Array<Array<[number, number]>>;
  labels: string[];
  top: number;
  bottom: number;
} {
  const labels = data.map((d) => String(d[xKey] ?? ""));
  const sanitized = data.map((d) => {
    const row: Record<string, string | number> = { ...d };
    for (const s of series) row[s.key] = toNumber(d[s.key]);
    return row;
  });
  const raw = stack<Record<string, string | number>, string>()
    .keys(series.map((s) => s.key))
    .order(STREAM_ORDERS[order] ?? stackOrderInsideOut)
    .offset(STREAM_OFFSETS[offset] ?? stackOffsetWiggle)(sanitized);
  const layers: Array<Array<[number, number]>> = raw.map((serie) =>
    serie.map((point): [number, number] => [point[0] ?? 0, point[1] ?? 0]),
  );
  const top = Math.max(1, max(raw, (l) => max(l, (p) => p[1] ?? 0) ?? 0) ?? 1);
  const bottom = Math.min(
    0,
    max(raw, (l) => Math.min(...l.map((p) => p[0] ?? 0))) ?? 0,
  );
  return { layers, labels, top, bottom };
}

/** Curva d3 según `curve` (monotone suave, linear recta o step escalón). */
export function resolveStreamCurve(
  curve: StreamgraphProps["curve"],
): CurveFactory | CurveFactoryLineOnly {
  return curve === "step"
    ? curveStep
    : curve === "linear"
      ? curveLinear
      : curveMonotoneX;
}

/** Escalas X por punto e Y lineal del streamgraph. */
export function streamScales(
  labels: string[],
  bottom: number,
  top: number,
  innerW: number,
  innerH: number,
): { x: ScalePoint<string>; y: ScaleLinear<number, number> } {
  const x = scalePoint()
    .domain(labels)
    .range([0, innerW])
    .padding(POINT_PADDING);
  const y = scaleLinear().domain([bottom, top]).range([innerH, 0]);
  return { x, y };
}
