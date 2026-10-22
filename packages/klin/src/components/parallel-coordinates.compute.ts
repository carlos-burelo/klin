/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScaleLinear, ScalePoint } from "d3-scale";
import { scaleLinear, scalePoint } from "d3-scale";
import { line } from "d3-shape";
import { seriesColors } from "../core/color";
import type { ValueFormatter } from "../core/format";
import { resolveFormatter } from "../core/format";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { CHART_TOKEN } from "../core/theme";
import type { ParallelAxis, ParallelRow } from "./parallel-coordinates.types";

export const AXIS_LABEL_OFFSET = 10;
export const AXIS_PAD_TOP = 28;
export const AXIS_PAD_BOTTOM = 28;
/** Ancho de etiqueta de eje y truncado de vértices. */
export const AXIS_LABEL_MAX = 12;
export const VERTEX_OPACITY = 0.9;

/** Fila limpia del paralelo (valores finitos por eje). */
export type ParallelCleanRow = {
  row: ParallelRow;
  vals: Map<string, number>;
  index: number;
};

/** Entrada pura del modelo de paralelas. */
export type ComputeParallelInput = {
  axes: ParallelAxis[];
  rows: ParallelRow[];
  innerW: number;
  top: number;
  bottom: number;
  marginLeft: number;
  format?: ValueFormatter;
  locale: string;
  showLegend: boolean;
  maxItems?: number;
};

/** Salida pura del modelo de paralelas (escalas, dominios, paths). */
export type ParallelModel = {
  clean: ParallelCleanRow[];
  fmt: ValueFormatter;
  x: ScalePoint<string>;
  y: ScaleLinear<number, number>;
  domains: Map<string, [number, number]>;
  norm: (key: string, v: number) => number;
  palette: string[];
  legendItems: Array<{ label: string; color: string }> | undefined;
  pathFor: (vals: Map<string, number>) => string;
};

/** Filas limpias con tope determinista (verbatim de la vista). */
export function cleanParallelRows(
  rows: ParallelRow[],
  axes: ParallelAxis[],
  maxItems: number = DEFAULT_MAX_ROWS,
): ParallelCleanRow[] {
  const rawMax = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
  return rows
    .slice(0, safeMax)
    .map((row, i) => {
      const vals = new Map<string, number>();
      for (const a of axes) {
        const v = toNumber(row.values[a.key], Number.NaN);
        if (Number.isFinite(v)) vals.set(a.key, v);
      }
      return { row, vals, index: i };
    })
    .filter((c) => c.vals.size > 0);
}

/** Dominio por eje sobre valores finitos (constante → punto medio). */
export function buildParallelDomains(
  axes: ParallelAxis[],
  clean: ParallelCleanRow[],
): Map<string, [number, number]> {
  const domains = new Map<string, [number, number]>();
  for (const a of axes) {
    let lo = Number.POSITIVE_INFINITY;
    let hi = Number.NEGATIVE_INFINITY;
    for (const c of clean) {
      const v = c.vals.get(a.key);
      if (v === undefined) continue;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    domains.set(a.key, lo <= hi ? [lo, hi] : [0, 1]);
  }
  return domains;
}

/** Normalizador por eje a [0, 1] (verbatim de la vista). */
export function createParallelNorm(
  domains: Map<string, [number, number]>,
): (key: string, v: number) => number {
  return (key: string, v: number): number => {
    const [lo, hi] = domains.get(key) ?? [0, 1];
    if (!(hi > lo)) return 0.5;
    return Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
  };
}

/** Escalas X (punto) e Y (lineal 0–1) (verbatim de la vista). */
export function buildParallelScales(
  axes: ParallelAxis[],
  innerW: number,
  top: number,
  bottom: number,
): { x: ScalePoint<string>; y: ScaleLinear<number, number> } {
  const x = scalePoint()
    .domain(axes.map((a) => a.key))
    .range([0, innerW])
    .padding(0.5);
  const y = scaleLinear().domain([0, 1]).range([bottom, top]);
  return { x, y };
}

/** Paleta por fila (verbatim de la vista). */
export function buildParallelPalette(clean: ParallelCleanRow[]): string[] {
  return seriesColors(clean.map((c) => ({ color: c.row.color })));
}

/**
 * Modelo puro de paralelas: limpieza, dominios, escalas, colores
 * y paths (verbatim de la vista).
 */
export function computeParallelModel(
  input: ComputeParallelInput,
): ParallelModel {
  const {
    axes,
    rows,
    innerW,
    top,
    bottom,
    marginLeft,
    format,
    locale,
    showLegend,
    maxItems,
  } = input;
  const clean = cleanParallelRows(rows, axes, maxItems ?? DEFAULT_MAX_ROWS);
  const fmt = resolveFormatter(format, locale);
  const { x, y } = buildParallelScales(axes, innerW, top, bottom);
  const domains = buildParallelDomains(axes, clean);
  const norm = createParallelNorm(domains);
  const palette = buildParallelPalette(clean);
  const legendItems = showLegend
    ? clean.map((c, i) => ({
        label: c.row.label ?? `Fila ${i + 1}`,
        color: palette[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;
  const pathFor = (vals: Map<string, number>) =>
    line<{ key: string; t: number }>()
      .x((p) => marginLeft + (x(p.key) ?? 0))
      .y((p) => y(p.t))(
      axes.map((a) => ({ key: a.key, t: norm(a.key, vals.get(a.key) ?? 0) })),
    ) ?? "";
  return { clean, fmt, x, y, domains, norm, palette, legendItems, pathFor };
}
