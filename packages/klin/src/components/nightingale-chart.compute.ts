/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { sum } from "d3-array";
import type { PieArcDatum } from "d3-shape";
import { arc, pie } from "d3-shape";
import { seriesColor } from "../core/color";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { PERCENT_FACTOR } from "../core/theme";
import type {
  NightingaleChartProps,
  NightingaleDatum,
} from "./nightingale-chart.types";

/** Separación angular entre pétalos. */
export const NIGHTINGALE_PAD_ANGLE = 0.02;
/** Respiro exterior para las etiquetas fuera del coxcomb. */
export const NIGHTINGALE_OUTER_PAD = 52;
/** Distancia de la etiqueta al borde del radio máximo. */
export const NIGHTINGALE_LABEL_OFFSET = 12;
/** Con más pétalos que este tope, solo la leyenda etiqueta. */
export const NIGHTINGALE_MAX_OUTSIDE_LABELS = 12;
/** Umbral del coseno para anclar la etiqueta (inicio/fin/centro). */
export const NIGHTINGALE_ANCHOR_COS = 0.3;
/** Radio de esquina y ángulo inicial por defecto (arcos limpios, desde arriba-derecha). */
export const NIGHTINGALE_CORNER_DEFAULT = 0;
export const NIGHTINGALE_START_DEFAULT = 0;
/** Vuelta completa del coxcomb. */
export const NIGHTINGALE_FULL = Math.PI * 2;
/** Tamaño del total al centro y sus desplazamientos. */
export const NIGHTINGALE_TOTAL_FONT_SIZE = 22;
export const NIGHTINGALE_TOTAL_DY = 4;
export const NIGHTINGALE_TOTAL_LABEL_DY = 20;

/** Fila limpia del coxcomb (valor finitizado, índice original). */
export type NightingaleSlice = {
  label: string;
  color?: string;
  value: number;
  index: number;
};

/** Limpia y trunca filas del coxcomb (verbatim de la vista). */
export function cleanNightingaleData(
  data: NightingaleDatum[],
): NightingaleSlice[] {
  return data
    .slice(0, DEFAULT_MAX_ROWS)
    .map((d, index) => ({
      label: d.label,
      color: d.color,
      value: Math.max(0, toNumber(d.value)),
      index,
    }))
    .filter((d) => d.value > 0);
}

/** Suma de valores limpios. */
export function nightingaleTotal(clean: NightingaleSlice[]): number {
  return sum(clean, (d) => d.value);
}

/** Ordena por valor descendente solo si `sortSlices` (verbatim de la vista). */
export function orderNightingaleSlices(
  clean: NightingaleSlice[],
  sortSlices: boolean,
): NightingaleSlice[] {
  return sortSlices ? [...clean].sort((a, b) => b.value - a.value) : clean;
}

/** Normaliza ángulos del coxcomb (verbatim de la vista). */
export function normalizeNightingaleAngles(
  startAngle: unknown,
  padAngle: unknown,
  cornerRadius: unknown,
): { start: number; pad: number; corner: number } {
  const start = toNumber(startAngle, NIGHTINGALE_START_DEFAULT);
  const pad = Math.max(0, toNumber(padAngle, NIGHTINGALE_PAD_ANGLE));
  const corner = Math.max(
    0,
    toNumber(cornerRadius, NIGHTINGALE_CORNER_DEFAULT),
  );
  return { start, pad, corner };
}

/** Radio útil del coxcomb dado el ancho y alto (verbatim de la vista). */
export function nightingaleRadius(width: number, height: number): number {
  return Math.max(0, Math.min(width, height) / 2 - NIGHTINGALE_OUTER_PAD);
}

/** Generador d3-pie de ángulos iguales (verbatim de la vista). */
export function buildNightingaleArcs(
  ordered: NightingaleSlice[],
  start: number,
): PieArcDatum<NightingaleSlice>[] {
  return pie<NightingaleSlice>()
    .value(() => 1)
    .sort(null)
    .startAngle(start)
    .endAngle(start + NIGHTINGALE_FULL)(ordered);
}

/** Generador d3-arc para los pétalos (verbatim de la vista). */
export function buildNightingalePath(pad: number, corner: number) {
  return arc().padAngle(pad).cornerRadius(corner);
}

/** Radio exterior del pétalo ∝ sqrt del valor (verbatim de la vista). */
export function nightingaleOuterRadius(
  radius: number,
  value: number,
  top: number,
): number {
  return radius * Math.sqrt(value / top);
}

/** Color del pétalo por índice de serie (verbatim de la vista). */
export function resolveNightingaleColor(
  index: number,
  color: string | undefined,
): string {
  return seriesColor(index, color);
}

/** Radio interior normalizado (0 = pétalos actuales hasta el centro). */
export function normalizeNightingaleInnerRadius(innerRadius: unknown): number {
  return Math.max(0, toNumber(innerRadius, 0));
}

/** Color del pétalo: `datum.color` → `itemColor` → serie. */
export function resolveNightingaleSliceColor(
  datum: NightingaleSlice,
  itemColor: NightingaleChartProps["itemColor"],
): string {
  return (
    datum.color ?? itemColor?.(datum, datum.index) ?? seriesColor(datum.index)
  );
}

/** Porcentaje entero del pétalo sobre el total. */
export function nightingalePercent(value: number, total: number): number {
  return Math.round((value / total) * PERCENT_FACTOR);
}
