/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { max, min } from "d3-array";
import type { ScaleBand, ScaleLinear } from "d3-scale";
import { scaleBand, scaleLinear } from "d3-scale";
import { toNumber } from "../core/number";
import { CHART_TOKEN, GRID_TICKS } from "../core/theme";

export const UP = CHART_TOKEN.chart1;
export const DOWN = CHART_TOKEN.chart5;
export const TOTAL = CHART_TOKEN.primary;

export const GROUP_BAND_PADDING = 0.3;
export const AXIS_LABEL_OFFSET = 10;
export const VALUE_LABEL_DY = 6;
export const CONNECTOR_DASH = "3 3";
export const ANNOTATION_LABEL_DX = 4;
export const ANNOTATION_LABEL_DY = -4;

export type WaterfallInputStep = { label: string; value: number };

/** Barra flotante con acumulado (verbatim de la vista). */
export type WaterfallFloat = {
  label: string;
  value: number;
  from: number;
  to: number;
};

/** Acumulado por deltas + total (verbatim de la vista). */
export function buildWaterfallFloats(steps: WaterfallInputStep[]): {
  floats: WaterfallFloat[];
  total: number;
} {
  let acc = 0;
  const floats = steps.map((s) => {
    const value = toNumber(s.value);
    const from = acc;
    acc += value;
    return { label: s.label, value, from, to: acc };
  });
  return { floats, total: acc };
}

/** Dominio con cero incluido (verbatim de la vista). */
export function resolveWaterfallDomain(floats: WaterfallFloat[]): {
  lo: number;
  hi: number;
} {
  const lo = Math.min(0, min(floats, (f) => Math.min(f.from, f.to)) ?? 0);
  const hi = Math.max(0, max(floats, (f) => Math.max(f.from, f.to)) ?? 1);
  return { lo, hi };
}

/** Etiquetas con total final (verbatim de la vista). */
export function buildWaterfallLabels(
  floats: WaterfallFloat[],
  totalLabel: string,
): string[] {
  return [...floats.map((f) => f.label), totalLabel];
}

/** Índices de subtotal saneados (enteros válidos, únicos, ordenados). */
export function resolveWaterfallSubtotalIndices(
  subtotalAt: unknown,
  count: number,
): number[] {
  if (!Array.isArray(subtotalAt)) return [];
  const set = new Set<number>();
  for (const v of subtotalAt) {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isInteger(n) || n < 0 || n >= count) continue;
    set.add(n);
  }
  return [...set].sort((a, b) => a - b);
}

/** Etiqueta de subtotal tras un step (mismo acumulado, estilo total). */
export function waterfallSubtotalLabel(label: string): string {
  return `${label} (subtotal)`;
}

/** Etiquetas con subtotales intercalados + total final. */
export function buildWaterfallLabelsWithSubtotals(
  floats: WaterfallFloat[],
  totalLabel: string,
  subtotalIndices: number[],
): string[] {
  const sub = new Set(subtotalIndices);
  const labels: string[] = [];
  floats.forEach((f, i) => {
    labels.push(f.label);
    if (sub.has(i)) labels.push(waterfallSubtotalLabel(f.label));
  });
  labels.push(totalLabel);
  return labels;
}

/** Escalas de cascada (verbatim de la vista). */
export function buildWaterfallScales(
  labels: string[],
  lo: number,
  hi: number,
  innerW: number,
  innerH: number,
  ticksCount: number = GRID_TICKS,
): {
  y: ScaleLinear<number, number>;
  x: ScaleBand<string>;
  ticks: number[];
  bw: number;
} {
  const y = scaleLinear().domain([lo, hi]).nice(ticksCount).range([innerH, 0]);
  const x = scaleBand()
    .domain(labels)
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const ticks = y.ticks(ticksCount);
  const bw = x.bandwidth();
  return { y, x, ticks, bw };
}

/** Colores de deltas + total (verbatim de la vista). */
export function resolveWaterfallColors(
  positiveColor: string | undefined,
  negativeColor: string | undefined,
  totalColor: string | undefined,
): { upColor: string; downColor: string; grandColor: string } {
  return {
    upColor: positiveColor ?? UP,
    downColor: negativeColor ?? DOWN,
    grandColor: totalColor ?? TOTAL,
  };
}
