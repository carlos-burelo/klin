/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import type { ScaleBand, ScaleLinear } from "d3-scale";
import { scaleBand, scaleLinear } from "d3-scale";
import type { CurveFactory, CurveFactoryLineOnly } from "d3-shape";
import { curveLinear, curveMonotoneX, curveStep, line } from "d3-shape";
import { seriesColors } from "../core/color";

import { domainWithZero } from "../core/domain";
import { toNumber } from "../core/number";
import type { ChartSeries } from "../core/series";
import { sortByGroupTotal } from "../core/stacked-model";
import { BAR_RADIUS, CHART_TOKEN } from "../core/theme";
import type { CartesianLegendItem } from "../render/cartesian-frame";
import type { ChartMargin } from "../render/chart-svg";

export const GROUP_BAND_PADDING = 0.22;
export const SERIES_BAND_PADDING = 0.08;
/** Margen derecho ampliado para los ticks del eje Y derecho. */
export const RIGHT_MARGIN_WIDE = 44;
/** Desplazamiento vertical de la etiqueta de valor sobre la barra. */
export const COMBO_VALUE_DY = 4;

/** Fila del combo (categoría + valores por serie). */
export type ComboRow = Record<string, string | number>;

/** Curva de línea del combo. */
export type ComboCurveKind = "monotone" | "linear" | "step";

/** Entrada pura del modelo del combo. */
export type ComputeComboInput = {
  data: ComboRow[];
  xKey: string;
  bars: ChartSeries[];
  lines: ChartSeries[];
  yAxisRight: boolean;
  height: number;
  width: number;
  baseMargin: ChartMargin;
  yMin?: number;
  yMax?: number;
  yMinR?: number;
  yMaxR?: number;
  gridTicks: number;
  showLegend: boolean;
  curve: ComboCurveKind;
  sortGroups?: "none" | "asc" | "desc";
  barRadius?: number;
};

/** Eje efectivo de una serie (override `axis`, si no el legacy). */
export function comboSeriesAxis(
  s: ChartSeries,
  fallback: "left" | "right",
): "left" | "right" {
  return s.axis ?? fallback;
}

/** Ordena grupos por total (barras + líneas); `none` preserva orden. */
export function orderComboGroups(
  data: ComboRow[],
  bars: ChartSeries[],
  lines: ChartSeries[],
  sortGroups: "none" | "asc" | "desc",
): ComboRow[] {
  return sortByGroupTotal(data, [...bars, ...lines], sortGroups);
}

/** Salida pura del modelo del combo (escalas, dominios, colores, paths). */
export type ComboModel = {
  margin: ChartMargin;
  innerW: number;
  innerH: number;
  ordered: ComboRow[];
  labels: string[];
  lo: number;
  hi: number;
  y: ScaleLinear<number, number>;
  yR: ScaleLinear<number, number>;
  yLine: ScaleLinear<number, number>;
  x0: ScaleBand<string>;
  x1: ScaleBand<string>;
  ticks: number[];
  rightTicks: number[];
  barColors: string[];
  lineColors: string[];
  y0: number;
  y0R: number;
  radius: number;
  barAxis: Array<"left" | "right">;
  lineAxis: Array<"left" | "right">;
  hasRight: boolean;
  totals: number[];
  lineTotals: number[];
  multi: boolean;
  legendItems: CartesianLegendItem[] | undefined;
  lineCurve: CurveFactory | CurveFactoryLineOnly;
  pathFor: (key: string) => string | null;
};

/** Etiquetas X del combo (verbatim de la vista). */
export function comboLabels(data: ComboRow[], xKey: string): string[] {
  return data.map((d) => String(d[xKey] ?? ""));
}

/** Margen con derecha ampliada si hay eje Y derecho. */
export function resolveComboMargin(
  yAxisRight: boolean,
  base: ChartMargin,
): ChartMargin {
  return yAxisRight ? { ...base, right: RIGHT_MARGIN_WIDE } : base;
}

/** Curva d3 según `curve` (verbatim de la vista). */
export function resolveComboCurve(
  curve: ComboCurveKind,
): CurveFactory | CurveFactoryLineOnly {
  return curve === "step"
    ? curveStep
    : curve === "linear"
      ? curveLinear
      : curveMonotoneX;
}

/**
 * Modelo puro del combo: dominios con cero, escalas, bandas,
 * colores, totales y paths de línea (verbatim de la vista).
 */
export function computeComboModel(input: ComputeComboInput): ComboModel {
  const {
    data,
    xKey,
    bars,
    lines,
    yAxisRight,
    height,
    width,
    baseMargin,
    yMin,
    yMax,
    yMinR,
    yMaxR,
    gridTicks,
    showLegend,
    curve,
    sortGroups = "none",
    barRadius,
  } = input;
  const ordered = orderComboGroups(data, bars, lines, sortGroups);
  const barAxis = bars.map((s) => comboSeriesAxis(s, "left"));
  const lineAxis = lines.map((s) =>
    comboSeriesAxis(s, yAxisRight ? "right" : "left"),
  );
  const hasRight =
    yAxisRight ||
    barAxis.some((a) => a === "right") ||
    lineAxis.some((a) => a === "right");
  const margin = resolveComboMargin(hasRight, baseMargin);
  const innerW = width - margin.left - margin.right;
  const innerH = height - baseMargin.top - baseMargin.bottom;
  const labels = comboLabels(ordered, xKey);

  const hasAxisOverride =
    bars.some((s) => s.axis != null) ||
    lines.some((s) => s.axis != null) ||
    yMinR !== undefined ||
    yMaxR !== undefined;
  let leftFlat: number[];
  let rightFlat: number[];
  if (!hasAxisOverride) {
    leftFlat = ordered.flatMap((d) => bars.map((s) => toNumber(d[s.key])));
    rightFlat = ordered.flatMap((d) => lines.map((s) => toNumber(d[s.key])));
  } else {
    const leftBars = bars.filter((_, i) => barAxis[i] === "left");
    const leftLines = lines.filter((_, i) => lineAxis[i] === "left");
    const rightBars = bars.filter((_, i) => barAxis[i] === "right");
    const rightLines = lines.filter((_, i) => lineAxis[i] === "right");
    leftFlat = ordered.flatMap((d) => [
      ...leftBars.map((s) => toNumber(d[s.key])),
      ...leftLines.map((s) => toNumber(d[s.key])),
    ]);
    rightFlat = ordered.flatMap((d) => [
      ...rightBars.map((s) => toNumber(d[s.key])),
      ...rightLines.map((s) => toNumber(d[s.key])),
    ]);
  }
  const [autoLo, autoHi] = domainWithZero(leftFlat);
  const lo = yMin === undefined ? autoLo : toNumber(yMin, autoLo);
  const hi = Math.max(
    yMax === undefined ? autoHi : toNumber(yMax, autoHi),
    lo + 1,
  );
  const [rightAutoLo, rightAutoHi] = domainWithZero(rightFlat);
  const loR = yMinR === undefined ? rightAutoLo : toNumber(yMinR, rightAutoLo);
  const hiR = Math.max(
    yMaxR === undefined ? rightAutoHi : toNumber(yMaxR, rightAutoHi),
    loR + 1,
  );
  const y = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(gridTicks)
    .range([innerH, 0]);
  const yR = scaleLinear()
    .domain([loR, Math.max(hiR, loR + 1)])
    .nice(gridTicks)
    .range([innerH, 0]);
  const yLine = yAxisRight ? yR : y;
  const x0 = scaleBand()
    .domain(labels)
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const x1 = scaleBand()
    .domain(bars.map((s) => s.key))
    .range([0, x0.bandwidth()])
    .padding(SERIES_BAND_PADDING);

  const ticks = y.ticks(gridTicks);
  const rightTicks = hasRight ? yR.ticks(gridTicks) : [];
  const barColors = seriesColors(bars);
  const lineColors = seriesColors(lines);
  const y0 = y(0);
  const y0R = yR(0);
  const radius = toNumber(barRadius, BAR_RADIUS);
  const totals = ordered.map((d) =>
    bars.reduce((acc, s) => acc + toNumber(d[s.key]), 0),
  );
  const lineTotals = ordered.map((d) =>
    lines.reduce((acc, s) => acc + toNumber(d[s.key]), 0),
  );
  const multi = bars.length + lines.length >= 2;
  const legendItems = showLegend
    ? [
        ...bars.map((s, i) => ({
          label: s.label,
          color: barColors[i] ?? CHART_TOKEN.chart1,
        })),
        ...lines.map((s, i) => ({
          label: s.label,
          color: lineColors[i] ?? CHART_TOKEN.chart1,
        })),
      ]
    : undefined;

  const lineCurve = resolveComboCurve(curve);
  const lineAxisByKey = new Map(
    lines.map((s, i) => [s.key, lineAxis[i]] as const),
  );
  const pathFor = (key: string) => {
    const axis = lineAxisByKey.get(key) ?? (yAxisRight ? "right" : "left");
    const yFor = axis === "right" ? yR : y;
    return line<{ label: string; value: number }>()
      .x((p) => (x0(p.label) ?? 0) + x0.bandwidth() / 2)
      .y((p) => yFor(p.value))
      .curve(lineCurve)(
      ordered.map((d) => ({
        label: String(d[xKey] ?? ""),
        value: toNumber(d[key]),
      })),
    );
  };

  return {
    margin,
    innerW,
    innerH,
    ordered,
    labels,
    lo,
    hi,
    y,
    yR,
    yLine,
    x0,
    x1,
    ticks,
    rightTicks,
    barColors,
    lineColors,
    y0,
    y0R,
    radius,
    barAxis,
    lineAxis,
    hasRight,
    totals,
    lineTotals,
    multi,
    legendItems,
    lineCurve,
    pathFor,
  };
}
