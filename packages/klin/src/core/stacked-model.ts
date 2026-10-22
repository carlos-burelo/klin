/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { toNumber } from "./number";
import type { ChartSeries } from "./series";

/** Matriz cruda serie×grupo + sumas por grupo (una sola fuente para apilados). */
export type StackedMatrix = {
  raws: number[][];
  posSums: number[];
  negSums: number[];
  totals: number[];
};

/** Ordena grupos por total (suma de series); `none` preserva orden. */
export function sortByGroupTotal(
  data: Array<Record<string, string | number>>,
  series: ChartSeries[],
  order: "none" | "asc" | "desc",
): Array<Record<string, string | number>> {
  if (order === "none") return [...data];
  const totalOf = (d: Record<string, string | number>) =>
    series.reduce((acc, s) => acc + toNumber(d[s.key]), 0);
  return [...data].sort((a, b) =>
    order === "asc" ? totalOf(a) - totalOf(b) : totalOf(b) - totalOf(a),
  );
}

/** Construye matriz cruda y sumas (no-finitos como 0). */
export function buildStackedMatrix(
  data: Array<Record<string, string | number>>,
  series: ChartSeries[],
): StackedMatrix {
  const raws = data.map((d) => series.map((s) => toNumber(d[s.key])));
  const posSums = raws.map((arr) =>
    arr.reduce((acc, v) => acc + Math.max(0, v), 0),
  );
  const negSums = raws.map((arr) =>
    arr.reduce((acc, v) => acc + Math.min(0, v), 0),
  );
  const totals = raws.map((arr) => arr.reduce((acc, v) => acc + v, 0));
  return { raws, posSums, negSums, totals };
}

/** Índice del grupo con mayor total (estable, primero gana). */
export function maxTotalIndex(totals: number[]): number {
  let best = 0;
  for (let i = 1; i < totals.length; i++) {
    if ((totals[i] ?? 0) > (totals[best] ?? 0)) best = i;
  }
  return best;
}
