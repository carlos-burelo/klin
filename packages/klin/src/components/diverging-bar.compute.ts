/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScaleLinear } from "d3-scale";
import { scaleLinear } from "d3-scale";
import { seriesColor } from "../core/color";
import { topPositive } from "../core/domain";
import { toNumber } from "../core/number";
import { PERCENT_FACTOR, ZERO_MARK_PX } from "../core/theme";

export const W = 640;
export const MARGIN = { top: 8, right: 48, bottom: 28, left: 132 };

export const LABEL_MAX_X = 24;
export const ROW_H = 34;
export const ROW_TOP_OFFSET = 6;
export const BAR_VERTICAL_INSET = 12;
export const CENTER_LINE_WIDTH = 1.5;
export const MIN_HEIGHT = 140;

type SurveyRow = Record<string, string | number>;

/** Magnitudes opuestas: se grafica el valor absoluto de cada lado. */
export function magOfSide(d: SurveyRow, key: string): number {
  return Math.abs(toNumber(d[key]));
}

/** Total de la fila (suma de magnitudes, verbatim de la vista). */
export function divergingRowTotal(
  d: SurveyRow,
  leftKey: string,
  rightKey: string,
): number {
  return magOfSide(d, leftKey) + magOfSide(d, rightKey);
}

/** Diferencia absoluta entre lados (verbatim de la vista). */
export function divergingRowDiff(
  d: SurveyRow,
  leftKey: string,
  rightKey: string,
): number {
  return Math.abs(magOfSide(d, rightKey) - magOfSide(d, leftKey));
}

/** Orden de filas por total o diferencia (verbatim de la vista). */
export function orderDivergingRows(
  data: SurveyRow[],
  leftKey: string,
  rightKey: string,
  sortBy: "total" | "diff" | "none",
): SurveyRow[] {
  const ordered = [...data];
  if (sortBy === "total") {
    ordered.sort(
      (a, b) =>
        divergingRowTotal(b, leftKey, rightKey) -
        divergingRowTotal(a, leftKey, rightKey),
    );
  } else if (sortBy === "diff") {
    ordered.sort(
      (a, b) =>
        divergingRowDiff(b, leftKey, rightKey) -
        divergingRowDiff(a, leftKey, rightKey),
    );
  }
  return ordered;
}

/** Tope positivo de magnitudes (verbatim de la vista). */
export function topDivergingValue(
  ordered: SurveyRow[],
  leftKey: string,
  rightKey: string,
): number {
  return topPositive(
    ordered.flatMap((d) => [magOfSide(d, leftKey), magOfSide(d, rightKey)]),
  );
}

/** Alto del lienzo según filas salvo override (verbatim de la vista). */
export function resolveDivergingHeight(
  rowCount: number,
  heightProp: unknown,
): number {
  const autoHeight = Math.max(
    MIN_HEIGHT,
    MARGIN.top + MARGIN.bottom + rowCount * ROW_H,
  );
  return heightProp == null
    ? autoHeight
    : Math.max(MIN_HEIGHT, Math.round(toNumber(heightProp, autoHeight)));
}

/** Escala de medio lienzo (verbatim de la vista). */
export function buildDivergingScale(
  top: number,
  halfW: number,
): ScaleLinear<number, number> {
  return scaleLinear().domain([0, top]).range([0, halfW]);
}

/** Colores de cada lado (verbatim de la vista). */
export function resolveDivergingColors(
  left: string | undefined,
  right: string | undefined,
): { leftColor: string; rightColor: string } {
  return { leftColor: seriesColor(4, left), rightColor: seriesColor(0, right) };
}

/** Ancho de barra lateral (cero → 0, verbatim de la vista). */
export function divergingSideWidth(
  v: number,
  scale: (n: number) => number,
): number {
  return Math.max(v === 0 ? 0 : ZERO_MARK_PX, scale(v));
}

/** % de cada lado sobre la fila (verbatim de la vista). */
export function divergingRowShare(
  lv: number,
  rv: number,
): { pctL: number; pctR: number } {
  const total = lv + rv;
  return {
    pctL: total > 0 ? Math.round((lv / total) * PERCENT_FACTOR) : 0,
    pctR: total > 0 ? Math.round((rv / total) * PERCENT_FACTOR) : 0,
  };
}

/** Fija la anotación al tope (verbatim de la vista). */
export function clampDivergingAnnotation(value: unknown, top: number): number {
  return Math.min(top, Math.max(0, toNumber(value)));
}
