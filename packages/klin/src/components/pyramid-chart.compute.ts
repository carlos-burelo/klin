/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { scaleLinear } from "d3-scale";
import { topPositive } from "../core/domain";
import { toNumber } from "../core/number";
import { BAR_RADIUS, GRID_TICKS } from "../core/theme";

export const LABEL_BAND = 96;
/** Alto de fila, alto mínimo del lienzo y relleno vertical de barra. */
export const ROW_H = 34;
export const PYRAMID_MIN_H = 140;
export const BAR_Y_PAD = 5;
/** Máximos de truncado de etiqueta (banda central / lateral). */
export const LABEL_MAX_CENTER = 14;
export const LABEL_MAX_SIDE = 12;
/** Separación de la etiqueta del eje inferior. */
export const AXIS_LABEL_BOTTOM_PAD = 12;
/** Opacidad del borde de barra. */
export const BAR_STROKE_OPACITY = 0.25;
/** Separación de la etiqueta de % al extremo de la barra. */
export const SHARE_GAP_PX = 4;
/** Ancho mínimo de barra para pintar el valor dentro. */
export const VALUE_MIN_W = 44;

/** Fila de pirámide con conteos ya saneados (negativos a 0). */
export type PyramidRow = {
  group: string;
  l: number;
  r: number;
};

export type PyramidLabels = "left" | "center";
export type PyramidSort = "none" | "asc" | "desc";

export type PyramidMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/** Filas saneadas + orden por total (verbatim de la vista). */
export function buildPyramidRows(
  groups: string[],
  leftValues: number[],
  rightValues: number[],
  sortGroups: PyramidSort,
): PyramidRow[] {
  const rows: PyramidRow[] = groups.map((group, i) => ({
    group,
    // Conteos: negativos se fijan a 0.
    l: Math.max(0, toNumber(leftValues[i] ?? 0)),
    r: Math.max(0, toNumber(rightValues[i] ?? 0)),
  }));
  if (sortGroups !== "none") {
    rows.sort((a, b) =>
      sortGroups === "asc" ? a.l + a.r - (b.l + b.r) : b.l + b.r - (a.l + a.r),
    );
  }
  return rows;
}

/** Totales por lado (verbatim de la vista). */
export function computePyramidTotals(
  leftValues: number[],
  rightValues: number[],
): { totalL: number; totalR: number } {
  const totalL = leftValues.reduce(
    (acc, v) => acc + Math.max(0, toNumber(v)),
    0,
  );
  const totalR = rightValues.reduce(
    (acc, v) => acc + Math.max(0, toNumber(v)),
    0,
  );
  return { totalL, totalR };
}

/** Alto, banda central y geometría horizontal (verbatim de la vista). */
export function computePyramidLayout(
  rowCount: number,
  heightProp: number | undefined,
  labels: PyramidLabels,
  centerGap: number | undefined,
  width: number,
  margin: PyramidMargin,
): {
  rowH: number;
  height: number;
  band: number;
  plotW: number;
  halfW: number;
  midX: number;
  leftEdge: number;
  rightEdge: number;
} {
  const rowH = ROW_H;
  const autoHeight = Math.max(
    PYRAMID_MIN_H,
    margin.top + margin.bottom + rowCount * rowH,
  );
  const height =
    heightProp == null
      ? autoHeight
      : Math.max(PYRAMID_MIN_H, Math.round(toNumber(heightProp, autoHeight)));
  const baseBand = labels === "center" ? LABEL_BAND : 0;
  const band = centerGap == null ? baseBand : toNumber(centerGap, baseBand);
  const plotW = width - margin.left - margin.right - band;
  const halfW = plotW / 2;
  const midX = margin.left + halfW + band;
  const leftEdge = midX - band / 2;
  const rightEdge = midX + band / 2;
  return { rowH, height, band, plotW, halfW, midX, leftEdge, rightEdge };
}

/** Escala espejada + ticks positivos (verbatim de la vista). */
export function buildPyramidScale(
  leftValues: number[],
  rightValues: number[],
  halfW: number,
): { top: number; scale: (v: number) => number; ticks: number[] } {
  const top = topPositive([...leftValues, ...rightValues]);
  const scale = scaleLinear()
    .domain([0, top])
    .nice(GRID_TICKS)
    .range([0, halfW]);
  const ticks = scale.ticks(GRID_TICKS).filter((t) => t > 0);
  return { top, scale, ticks };
}

/** Radio de barra normalizado (BAR_RADIUS actual). */
export function normalizePyramidBarRadius(barRadius: unknown): number {
  return Math.max(0, toNumber(barRadius, BAR_RADIUS));
}

/** Si la barra es ancha para pintar el valor dentro. */
export function pyramidFitsValue(showValues: boolean, barW: number): boolean {
  return showValues && barW >= VALUE_MIN_W;
}
