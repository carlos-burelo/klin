/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { max, min } from "d3-array";
import type { ScaleLinear } from "d3-scale";
import { scaleLinear } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
import { seriesColor } from "../core/color";
import { domainWithZero } from "../core/domain";
import { formatDefault } from "../core/format";
import { toNumber } from "../core/number";
import { MIN_SHAPE_PX } from "../core/theme";
import type { SparklineProps } from "./sparkline.types";

/** Relleno lateral/vertical, holgura del dominio y estilo de línea/punto. */
export const SPARK_PAD = 2;
export const SPARK_DOMAIN_PAD_RATIO = 0.1;
export const SPARK_AREA_OPACITY = 0.18;
/** Opacidad del área en modo `area` (más presente que en `line`). */
export const SPARK_AREA_OPACITY_STRONG = 0.35;
export const SPARK_LINE_WIDTH = 1.75;
export const SPARK_END_DOT_R = 2.5;
/** Ancho mínimo de barra en modo `bar` (fracción del paso). */
export const SPARK_BAR_WIDTH_RATIO = 0.7;

/** Modelo puro de la minigráfica (escalas, paths, extremos y referencia). */
export type SparklineModel = {
  counts: number[];
  lo: number;
  hi: number;
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  stroke: string;
  linePath: string;
  areaPath: string;
  last: number;
  tip: string;
  maxIdx: number;
  extremeIdx: number[];
  showRef: boolean;
  refY: number;
  refTip: string;
  barW: number;
  isBar: boolean;
  areaOpacity: number;
};

/** Cómputo puro de la minigráfica (escalas, paths, extremos y referencia). */
export function computeSparklineModel(
  values: number[],
  width: number,
  height: number,
  kind: NonNullable<SparklineProps["kind"]>,
  reference: number | undefined,
  color: string | undefined,
  ariaLabel: string,
  locale: string,
): SparklineModel {
  // Valores crudos (negativos honestos; el dominio incluye el cero).
  const counts = values.map((v) => toNumber(v));
  const [lo, hi] = domainWithZero(counts);
  // Extremos de los datos (para tips y marcas; el dominio es otra cosa).
  const dataLo = min(counts) ?? lo;
  const dataHi = max(counts) ?? hi;
  const span = hi - lo || 1;
  const x = scaleLinear()
    .domain([0, counts.length - 1])
    .range([SPARK_PAD, width - SPARK_PAD]);
  const y = scaleLinear()
    .domain([
      lo - span * SPARK_DOMAIN_PAD_RATIO,
      hi + span * SPARK_DOMAIN_PAD_RATIO,
    ])
    .range([height - SPARK_PAD, SPARK_PAD]);

  const pts = counts.map((v, i) => ({ i, v }));
  const stroke = seriesColor(0, color);
  const linePath =
    line<{ i: number; v: number }>()
      .x((p) => x(p.i))
      .y((p) => y(p.v))
      .curve(curveMonotoneX)(pts) ?? "";
  const areaPath =
    area<{ i: number; v: number }>()
      .x((p) => x(p.i))
      .y0(height)
      .y1((p) => y(p.v))
      .curve(curveMonotoneX)(pts) ?? "";
  const last = counts[counts.length - 1] ?? 0;
  const tip = `${ariaLabel}: ${formatDefault(last, locale)} (min ${formatDefault(dataLo, locale)}, max ${formatDefault(dataHi, locale)})`;
  // Índices de mínimo y máximo (primera aparición; uno solo si la serie es plana).
  const minIdx = counts.indexOf(dataLo);
  const maxIdx = counts.indexOf(dataHi);
  const extremeIdx = [...new Set([minIdx, maxIdx])].filter((i) => i >= 0);
  const ref = toNumber(reference, Number.NaN);
  const showRef = Number.isFinite(ref);
  const refY = showRef
    ? Math.min(height - SPARK_PAD, Math.max(SPARK_PAD, y(ref)))
    : 0;
  const refTip = showRef ? `Meta: ${formatDefault(ref, locale)}` : "";
  const barStep = (width - SPARK_PAD * 2) / Math.max(1, counts.length - 1);
  const barW = Math.max(MIN_SHAPE_PX, barStep * SPARK_BAR_WIDTH_RATIO);
  const isBar = kind === "bar";
  const areaOpacity =
    kind === "area" ? SPARK_AREA_OPACITY_STRONG : SPARK_AREA_OPACITY;
  return {
    counts,
    lo,
    hi,
    x,
    y,
    stroke,
    linePath,
    areaPath,
    last,
    tip,
    maxIdx,
    extremeIdx,
    showRef,
    refY,
    refTip,
    barW,
    isBar,
    areaOpacity,
  };
}
