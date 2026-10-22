/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { ScalePoint } from "d3-scale";
import { scalePoint } from "d3-scale";
import { buildValueAxis } from "../core/cartesian-model";
import { seriesColor } from "../core/color";
import type { ValueFormatter } from "../core/format";
import { toNumber } from "../core/number";
import { GRID_TICKS } from "../core/theme";

export const POINT_PADDING = 0.5;
export const AXIS_LABEL_OFFSET = 10;
export const VALUE_LABEL_DY = 10;
export const LOLLIPOP_RADIUS = 5;
export const STEM_OPACITY = 0.5;
export const ANNOTATION_LABEL_DX = 4;
export const ANNOTATION_LABEL_DY = -4;

type LollipopRow = Record<string, string | number>;

/** Orden de grupos por valor (verbatim de la vista). */
export function orderLollipopGroups(
  data: LollipopRow[],
  yKey: string,
  sortGroups: "none" | "asc" | "desc",
): LollipopRow[] {
  const ordered = [...data];
  if (sortGroups !== "none") {
    ordered.sort((a, b) =>
      sortGroups === "asc"
        ? toNumber(a[yKey]) - toNumber(b[yKey])
        : toNumber(b[yKey]) - toNumber(a[yKey]),
    );
  }
  return ordered;
}

/** Eje de valor vía buildValueAxis (adopción cartesian-model). */
export function buildLollipopValueAxis(
  ordered: LollipopRow[],
  yKey: string,
  formatY: ValueFormatter | undefined,
  locale: string,
  innerH: number,
  opts?: { gridTicks?: number; yMin?: number; yMax?: number },
): {
  lo: number;
  hi: number;
  y: (value: number) => number;
  ticks: number[];
  fmtY: ValueFormatter;
} {
  const { lo, hi, y, ticks, fmt } = buildValueAxis(
    {
      values: ordered.map((d) => toNumber(d[yKey])),
      ticks: opts?.gridTicks ?? GRID_TICKS,
      format: formatY,
      locale,
      yMin: opts?.yMin,
      yMax: opts?.yMax,
    },
    [innerH, 0],
  );
  return { lo, hi, y, ticks, fmtY: fmt };
}

/** Radio de punto sanitizado (piso 0; `LOLLIPOP_RADIUS` por defecto). */
export function resolveLollipopRadius(pointRadius: unknown): number {
  return Math.max(0, toNumber(pointRadius, LOLLIPOP_RADIUS));
}

/** Escala de puntos X (verbatim de la vista). */
export function buildLollipopPoints(
  ordered: LollipopRow[],
  xKey: string,
  innerW: number,
): ScalePoint<string> {
  return scalePoint()
    .domain(ordered.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(POINT_PADDING);
}

/** Color de la serie (verbatim de la vista). */
export function resolveLollipopFill(color: string | undefined): string {
  return seriesColor(0, color);
}
