/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScaleBand, ScaleLinear, ScalePoint } from "d3-scale";
import { scaleBand, scaleLinear, scalePoint } from "d3-scale";
import { curveMonotoneX, line } from "d3-shape";
import { seriesColor } from "../core/color";
import { topPositive } from "../core/domain";
import type { ValueFormatter } from "../core/format";
import { resolveFormatter } from "../core/format";
import { sumNumbers, toNumber } from "../core/number";
import { PERCENT_FACTOR } from "../core/theme";

export const GROUP_BAND_PADDING = 0.25;
export const CUM_POINT_PADDING = 0.5;
export const AXIS_LABEL_OFFSET = 10;
export const ANNOTATION_LABEL_DX = 4;
export const ANNOTATION_LABEL_DY = -4;
/** Etiqueta del resto agregado y umbral 80/20 por defecto. */
export const PARETO_OTHERS_LABEL = "Otros";
export const PARETO_DEFAULT_THRESHOLD = 80;

/** Fila ordenada del pareto (verbatim de la vista). */
export type ParetoRow = Record<string, string | number>;

/** Punto acumulado del pareto (etiqueta + % acumulado). */
export type ParetoCum = {
  label: string;
  pct: number;
};

/** Entrada pura del modelo de pareto. */
export type ComputeParetoInput = {
  data: ParetoRow[];
  xKey: string;
  yKey: string;
  innerW: number;
  innerH: number;
  gridTicks: number;
  formatY?: ValueFormatter;
  locale: string;
  color?: string;
  topN?: number;
  threshold?: number | null;
};

/** Salida pura del modelo de pareto (escalas, dominios, acumulado, path). */
export type ParetoModel = {
  ordered: ParetoRow[];
  total: number;
  top: number;
  y: ScaleLinear<number, number>;
  yp: ScaleLinear<number, number>;
  x: ScaleBand<string>;
  xp: ScalePoint<string>;
  ticks: number[];
  fill: string;
  lineColor: string;
  fmtY: ValueFormatter;
  thresholdPct: number | null;
  cum: ParetoCum[];
  path: string;
};

/** Conteos: negativos se fijan a 0 (verbatim de la vista). */
export function paretoCountOf(
  yKey: string,
): (d: Record<string, string | number>) => number {
  return (d: Record<string, string | number>) => Math.max(0, toNumber(d[yKey]));
}

/**
 * Filas ordenadas con agregación de resto en "Otros" (verbatim de
 * la vista).
 */
export function orderParetoRows(
  data: ParetoRow[],
  xKey: string,
  yKey: string,
  topN?: number,
): ParetoRow[] {
  const countOf = paretoCountOf(yKey);
  const ranked = [...data].sort((a, b) => countOf(b) - countOf(a));
  const rawTop = Math.floor(toNumber(topN, Number.NaN));
  return Number.isFinite(rawTop) && rawTop > 0 && ranked.length > rawTop
    ? [
        ...ranked.slice(0, rawTop),
        {
          [xKey]: PARETO_OTHERS_LABEL,
          [yKey]: sumNumbers(ranked.slice(rawTop).map(countOf)),
        },
      ]
    : ranked;
}

/** % acumulado por causa (verbatim de la vista). */
export function paretoCumOf(
  ordered: ParetoRow[],
  xKey: string,
  yKey: string,
  total: number,
): ParetoCum[] {
  const countOf = paretoCountOf(yKey);
  let acc = 0;
  return ordered.map((d) => {
    acc += total === 0 ? 0 : (countOf(d) / total) * PERCENT_FACTOR;
    return { label: String(d[xKey] ?? ""), pct: acc };
  });
}

/** Umbral % clamp a [0, 100] (`null`/`undefined` = sin línea; verbatim de la vista). */
export function resolveParetoThreshold(
  threshold?: number | null,
): number | null {
  if (threshold === null || threshold === undefined) return null;
  const rawThreshold = toNumber(threshold, Number.NaN);
  return Number.isFinite(rawThreshold)
    ? Math.min(PERCENT_FACTOR, Math.max(0, rawThreshold))
    : null;
}

/**
 * Modelo puro de pareto: orden + doble eje (conteo y %) + acumulado +
 * path (verbatim de la vista; NO adopta `buildValueAxis`: doble eje
 * con bandas custom).
 */
export function computeParetoModel(input: ComputeParetoInput): ParetoModel {
  const {
    data,
    xKey,
    yKey,
    innerW,
    innerH,
    gridTicks,
    formatY,
    locale,
    color,
    topN,
    threshold,
  } = input;
  const countOf = paretoCountOf(yKey);
  const ordered = orderParetoRows(data, xKey, yKey, topN);
  const total = sumNumbers(ordered.map(countOf));
  const top = topPositive(ordered.map(countOf));

  const y = scaleLinear().domain([0, top]).nice(gridTicks).range([innerH, 0]);
  const yp = scaleLinear().domain([0, PERCENT_FACTOR]).range([innerH, 0]);
  const x = scaleBand()
    .domain(ordered.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const ticks = y.ticks(gridTicks);
  const fill = seriesColor(0, color);
  const lineColor = seriesColor(1, undefined);
  const fmtY = resolveFormatter(formatY, locale);
  const thresholdPct = resolveParetoThreshold(threshold);

  const cum = paretoCumOf(ordered, xKey, yKey, total);
  const xp = scalePoint()
    .domain(cum.map((c) => c.label))
    .range([0, innerW])
    .padding(CUM_POINT_PADDING);
  const path =
    line<ParetoCum>()
      .x((p) => (xp(p.label) ?? 0) + x.bandwidth() / 2)
      .y((p) => yp(p.pct))
      .curve(curveMonotoneX)(cum) ?? "";

  return {
    ordered,
    total,
    top,
    y,
    yp,
    x,
    xp,
    ticks,
    fill,
    lineColor,
    fmtY,
    thresholdPct,
    cum,
    path,
  };
}
