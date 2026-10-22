/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScalePoint } from "d3-scale";
import { scalePoint } from "d3-scale";
import type { CurveFactory, CurveFactoryLineOnly } from "d3-shape";
import { area, curveLinear, curveMonotoneX, curveStep, line } from "d3-shape";
import { seriesColors } from "../core/color";
import { domainWithZero, logDomain, logFloor } from "../core/domain";
import type { ValueFormatter } from "../core/format";
import { resolveFormatter } from "../core/format";
import { toNumber } from "../core/number";
import type { ValueScaleKind } from "../core/scale";
import { valueScale } from "../core/scale";
import type { ChartSeries } from "../core/series";
import { AREA_FILL_OPACITY, CHART_TOKEN, PERCENT_FACTOR } from "../core/theme";

export const POINT_PADDING = 0.5;

/** Punto de área (valor, crudo y base acumulada). */
export type AreaPoint = {
  label: string;
  value: number;
  raw: number;
  base: number;
};

/** Curva de área. */
export type AreaCurveKind = "monotone" | "linear" | "step";

/** Serie precomputada del área (puntos + paths). */
export type AreaSeriesData = {
  key: string;
  label: string;
  color: string;
  pts: AreaPoint[];
  areaPath: string;
  linePath: string;
  totalRaw: number;
};

/** Entrada pura del modelo de área. */
export type ComputeAreaInput = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  innerW: number;
  innerH: number;
  stacked: boolean;
  normalize: boolean;
  curve: AreaCurveKind;
  fillOpacity?: number;
  yMin?: number;
  yMax?: number;
  gridTicks: number;
  yScale: ValueScaleKind;
  formatY?: ValueFormatter;
  locale: string;
  showLegend: boolean;
  /** Une vecinos saltando nulos (`defined` en paths; nulos como NaN). */
  connectNulls?: boolean;
};

/** Salida pura del modelo de área (escalas, dominio, series). */
export type AreaModel = {
  labels: string[];
  stackedTotals: number[];
  lo: number;
  hi: number;
  opacity: number;
  x: ScalePoint<string>;
  y: ReturnType<typeof valueScale>;
  ticks: number[];
  colors: string[];
  lv: (v: number) => number;
  log: boolean;
  fmtY: ValueFormatter;
  fmt: (v: number) => string;
  legendItems: Array<{ label: string; color: string }> | undefined;
  seriesData: AreaSeriesData[];
};

/** Etiquetas X en orden de `data` (verbatim de la vista). */
export function areaLabels(
  data: Array<Record<string, string | number>>,
  xKey: string,
): string[] {
  return data.map((d) => String(d[xKey] ?? ""));
}

/**
 * Totales apilados por grupo (negativos clamp a 0: no se apilan
 * negativos; verbatim de la vista).
 */
export function areaStackedTotals(
  data: Array<Record<string, string | number>>,
  series: ChartSeries[],
): number[] {
  return data.map((d) =>
    series.reduce((acc, s) => acc + Math.max(0, toNumber(d[s.key])), 0),
  );
}

/** Totales apilados ignorando nulos (para `connectNulls`). */
export function areaStackedTotalsSkippingNulls(
  data: Array<Record<string, string | number>>,
  series: ChartSeries[],
): number[] {
  return data.map((d) =>
    series.reduce((acc, s) => {
      const n = toNumber(d[s.key], Number.NaN);
      return acc + (Number.isFinite(n) ? Math.max(0, n) : 0);
    }, 0),
  );
}

/** Curva d3 según `curve` (verbatim de la vista). */
export function resolveAreaCurve(
  curve: AreaCurveKind,
): CurveFactory | CurveFactoryLineOnly {
  return curve === "step"
    ? curveStep
    : curve === "linear"
      ? curveLinear
      : curveMonotoneX;
}

/**
 * Modelo puro de área: dominio con variantes stacked/normalize/log
 * (NO adopta `buildValueAxis`: bloque con variantes), escalas, colores
 * y series con puntos + paths (verbatim de la vista).
 */
export function computeAreaModel(input: ComputeAreaInput): AreaModel {
  const {
    data,
    xKey,
    series,
    innerW,
    innerH,
    stacked,
    normalize,
    curve,
    fillOpacity,
    yMin,
    yMax,
    gridTicks,
    yScale,
    formatY,
    locale,
    showLegend,
    connectNulls,
  } = input;
  const labels = areaLabels(data, xKey);
  const gaps = connectNulls ?? false;
  const numOf = (v: unknown) => (gaps ? toNumber(v, Number.NaN) : toNumber(v));
  // En apilado/normalize los negativos se clamp a 0: no se apilan negativos.
  const stackedTotals = gaps
    ? areaStackedTotalsSkippingNulls(data, series)
    : areaStackedTotals(data, series);
  const flat = data.flatMap((d) => series.map((s) => numOf(d[s.key])));
  const [autoLo, autoHi] = domainWithZero(
    stacked || normalize ? stackedTotals : flat,
  );
  const log = yScale === "log" && !normalize;
  const [llo, lhi] = log
    ? logDomain(stacked ? stackedTotals : flat)
    : ([autoLo, autoHi] as const);
  const lo = normalize
    ? autoLo
    : log
      ? llo
      : yMin === undefined
        ? autoLo
        : toNumber(yMin, autoLo);
  const hi = normalize
    ? autoHi
    : log
      ? lhi
      : yMax === undefined
        ? autoHi
        : toNumber(yMax, autoHi);
  const opacity = toNumber(fillOpacity ?? AREA_FILL_OPACITY, AREA_FILL_OPACITY);
  const areaCurve = resolveAreaCurve(curve);

  const x = scalePoint()
    .domain(labels)
    .range([0, innerW])
    .padding(POINT_PADDING);
  const y = valueScale(
    normalize ? "linear" : log ? "log" : "linear",
    normalize ? [0, 1] : [lo, Math.max(hi, lo + 1)],
    [innerH, 0],
  ).nice(gridTicks);
  const ticks = y.ticks(gridTicks);
  const colors = seriesColors(series);
  const lv = (v: number) => (log && !normalize ? logFloor(v, lo) : v);
  const fmtY = resolveFormatter(formatY, locale);
  const fmt = normalize
    ? (v: number) => `${Math.round(v * PERCENT_FACTOR)}%`
    : fmtY;

  // Base acumulada por etiqueta cuando es apilada.
  const bases = new Map<string, number>(labels.map((l) => [l, 0]));

  const seriesData: AreaSeriesData[] = series.map((s, si) => {
    const color = colors[si] ?? CHART_TOKEN.chart1;
    const pts = data.map((d, di) => {
      const label = String(d[xKey] ?? "");
      const raw = numOf(d[s.key]);
      const finite = Number.isFinite(raw);
      // En apilado/normalize los negativos se clamp a 0.
      const clamped = finite ? Math.max(0, raw) : 0;
      const total = stackedTotals[di] ?? 0;
      const value = !finite
        ? Number.NaN
        : normalize && total > 0
          ? clamped / total
          : stacked || normalize
            ? clamped
            : raw;
      const base = stacked || normalize ? (bases.get(label) ?? 0) : 0;
      if (stacked || normalize)
        bases.set(
          label,
          base + (normalize && !finite ? 0 : normalize ? value : clamped),
        );
      return { label, value, raw, base };
    });
    const definedOf = (p: AreaPoint) =>
      !gaps || (Number.isFinite(p.value) && Number.isFinite(p.base + p.value));
    const areaPath =
      area<AreaPoint>()
        .defined(definedOf)
        .x((p) => x(p.label) ?? 0)
        .y0((p) => y(lv(p.base)))
        .y1((p) => y(lv(p.base + p.value)))
        .curve(areaCurve as CurveFactory)(pts) ?? "";
    const linePath =
      line<AreaPoint>()
        .defined(definedOf)
        .x((p) => x(p.label) ?? 0)
        .y((p) => y(lv(p.base + p.value)))
        .curve(areaCurve)(pts) ?? "";
    return {
      key: s.key,
      label: s.label,
      color,
      pts,
      areaPath,
      linePath,
      totalRaw: pts.reduce(
        (a, p) => a + (Number.isFinite(p.raw) ? p.raw : 0),
        0,
      ),
    };
  });

  const legendItems = showLegend
    ? series.map((s, i) => ({
        label: s.label,
        color: colors[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;

  return {
    labels,
    stackedTotals,
    lo,
    hi,
    opacity,
    x,
    y,
    ticks,
    colors,
    lv,
    log,
    fmtY,
    fmt,
    legendItems,
    seriesData,
  };
}
