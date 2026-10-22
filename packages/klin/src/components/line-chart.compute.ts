/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScalePoint } from "d3-scale";
import { scalePoint } from "d3-scale";
import type { CurveFactory, CurveFactoryLineOnly } from "d3-shape";
import { area, curveLinear, curveMonotoneX, curveStep, line } from "d3-shape";
import type { ValueAxis } from "../core/cartesian-model";
import { buildValueAxis } from "../core/cartesian-model";
import { seriesColors } from "../core/color";
import type { ValueFormatter } from "../core/format";
import { toNumber } from "../core/number";
import type { ValueScaleKind } from "../core/scale";
import type { ChartSeries } from "../core/series";
import { CHART_TOKEN } from "../core/theme";

export const POINT_PADDING = 0.5;

/** Punto de línea (etiqueta + valor). */
export type LinePoint = {
  label: string;
  value: number;
};

/** Curva de línea. */
export type LineCurveKind = "monotone" | "linear" | "step";

/** Entrada pura del modelo de línea. */
export type ComputeLineInput = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  innerW: number;
  innerH: number;
  gridTicks: number;
  formatY?: ValueFormatter;
  locale: string;
  yMin?: number;
  yMax?: number;
  yScale: ValueScaleKind;
  showLegend: boolean;
  curve: LineCurveKind;
  /** Une vecinos saltando nulos (`defined` en paths; nulos como NaN). */
  connectNulls?: boolean;
};

/** Salida pura del modelo de línea (escalas, dominio, colores, paths). */
export type LineModel = {
  labels: string[];
  lo: number;
  hi: number;
  y: ValueAxis["y"];
  x: ScalePoint<string>;
  ticks: number[];
  fmtY: ValueFormatter;
  lv: (v: number) => number;
  log: boolean;
  colors: string[];
  totals: number[];
  legendItems: Array<{ label: string; color: string }> | undefined;
  lineCurve: CurveFactory | CurveFactoryLineOnly;
  pathFor: (key: string) => string | null;
  areaFor: (key: string) => string | null;
};

/** Etiquetas X en orden de `data` (verbatim de la vista). */
export function lineLabels(
  data: Array<Record<string, string | number>>,
  xKey: string,
): string[] {
  return data.map((d) => String(d[xKey] ?? ""));
}

/** Totales por grupo para el tip compartido (verbatim de la vista). */
export function lineTotals(
  data: Array<Record<string, string | number>>,
  series: ChartSeries[],
): number[] {
  return data.map((d) =>
    series.reduce((acc, s) => acc + toNumber(d[s.key]), 0),
  );
}

/** Curva d3 según `curve` (verbatim de la vista). */
export function resolveLineCurve(
  curve: LineCurveKind,
): CurveFactory | CurveFactoryLineOnly {
  return curve === "step"
    ? curveStep
    : curve === "linear"
      ? curveLinear
      : curveMonotoneX;
}

/**
 * Modelo puro de línea: eje vía `buildValueAxis` (dominio+escala+ticks+
 * formato), banda X, colores, totales y paths (verbatim de la vista).
 */
export function computeLineModel(input: ComputeLineInput): LineModel {
  const {
    data,
    xKey,
    series,
    innerW,
    innerH,
    gridTicks,
    formatY,
    locale,
    yMin,
    yMax,
    yScale,
    showLegend,
    curve,
    connectNulls,
  } = input;
  const labels = lineLabels(data, xKey);
  const gaps = connectNulls ?? false;
  const numOf = (v: unknown) => (gaps ? toNumber(v, Number.NaN) : toNumber(v));

  const flat = data.flatMap((d) => series.map((s) => numOf(d[s.key])));
  const axis = buildValueAxis(
    {
      values: flat,
      ticks: gridTicks,
      format: formatY,
      locale,
      yMin,
      yMax,
      scale: yScale,
    },
    [innerH, 0],
  );
  const { lo, hi, y, ticks, fmt: fmtY, lift: lv, log } = axis;

  const x = scalePoint()
    .domain(labels)
    .range([0, innerW])
    .padding(POINT_PADDING);
  const colors = seriesColors(series);
  const totals = lineTotals(data, series);
  const legendItems = showLegend
    ? series.map((s, i) => ({
        label: s.label,
        color: colors[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;

  const lineCurve = resolveLineCurve(curve);

  const pathFor = (key: string) =>
    line<LinePoint>()
      .defined((p) => !gaps || Number.isFinite(p.value))
      .x((p) => x(p.label) ?? 0)
      .y((p) => y(lv(p.value)))
      .curve(lineCurve)(
      data.map((d) => ({
        label: String(d[xKey] ?? ""),
        value: numOf(d[key]),
      })),
    );

  const areaFor = (key: string) =>
    area<LinePoint>()
      .defined((p) => !gaps || Number.isFinite(p.value))
      .x((p) => x(p.label) ?? 0)
      .y0(() => y(lo))
      .y1((p) => y(lv(p.value)))
      .curve(lineCurve as CurveFactory)(
      data.map((d) => ({
        label: String(d[xKey] ?? ""),
        value: numOf(d[key]),
      })),
    );

  return {
    labels,
    lo,
    hi,
    y,
    x,
    ticks,
    fmtY,
    lv,
    log,
    colors,
    totals,
    legendItems,
    lineCurve,
    pathFor,
    areaFor,
  };
}
