/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { toNumber } from "../core/number";
import { PERCENT_FACTOR } from "../core/theme";
import type {
  StackedBarProps,
  StackRow,
  StackSegment,
} from "./stacked-bar.types";

export const TRACK_W = 600;
export const TRACK_H = 24;

/** Clave del segmento principal para el % (verbatim de la vista). */
export function mainSegmentKey(
  segments: StackSegment[],
  percentOf: string | undefined,
): string {
  return percentOf ?? segments[0]?.key ?? "";
}

/** Colores por segmento (verbatim de la vista). */
export function segmentColors(segments: StackSegment[]): string[] {
  return segments.map((s, i) => seriesColor(i, s.color));
}

/** Suma de segmentos por fila (verbatim de la vista). */
export function totalOfStack(
  values: Record<string, number>,
  segments: StackSegment[],
): number {
  return segments.reduce((acc, s) => acc + toNumber(values[s.key]), 0);
}

/** Tope global de totales (verbatim de la vista). */
export function maxStackedTotal(
  rows: StackRow[],
  segments: StackSegment[],
): number {
  return Math.max(1, ...rows.map((r) => totalOfStack(r.values, segments)));
}

/** Alto de barra, radio y modo compacto (verbatim de la vista). */
export function resolveStackedBarHeight(barHeight: unknown): {
  barH: number;
  barRadius: number;
  defaultH: boolean;
} {
  const barH = barHeight == null ? TRACK_H : toNumber(barHeight, TRACK_H);
  return { barH, barRadius: barH / 2, defaultH: barH === TRACK_H };
}

/** Estilo exterior con alto fijo opcional (verbatim de la vista). */
export function resolveStackedOuterStyle(
  style: StackedBarProps["style"],
  height: unknown,
): StackedBarProps["style"] {
  return height == null ? style : { ...style, height: toNumber(height) };
}

/** Total y % del segmento principal en la fila (verbatim de la vista). */
export function stackedRowShare(
  row: StackRow,
  segments: StackSegment[],
  mainKey: string,
): { total: number; percent: number } {
  const total = totalOfStack(row.values, segments);
  const main = toNumber(row.values[mainKey]);
  return {
    total,
    percent: total === 0 ? 0 : Math.round((main / total) * PERCENT_FACTOR),
  };
}

/** Denominador de la pista según escala (verbatim de la vista). */
export function stackedRowDenom(
  scale: "row" | "global",
  total: number,
  maxTotal: number,
): number {
  return scale === "row" ? (total === 0 ? 1 : total) : maxTotal;
}
