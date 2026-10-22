/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { Chords } from "d3-chord";
import { chord } from "d3-chord";
import { toNumber } from "../core/number";
import type { ChordLayoutOptions } from "./chord-diagram.types";

/** Cap SSR de la matriz (trunca determinista a 12x12). */
export const MAX_CHORD = 12;

/** Separación entre grupos vecinos (radianes). */
export const CHORD_PAD_ANGLE = 0.05;
/** Grosor del anillo de grupos y reserva radial para etiquetas. */
export const RING_THICKNESS = 18;
export const LABEL_MARGIN = 64;
export const LABEL_DX = 12;
/** Coseno mínimo para alinear etiqueta a un lado (si no, centrada). */
export const ANCHOR_EPS = 0.2;
/** Radio exterior mínimo (evita colapso con alturas diminutas). */
export const MIN_OUTER_RADIUS = 48;
/** Grosores de trazo del anillo y de la cinta. */
export const RING_STROKE = 1.5;
export const RIBBON_STROKE = 1;

/** Separación válida entre grupos (no-finita o negativa → defecto). */
export function resolveChordPadAngle(padAngle: number | undefined): number {
  const raw = toNumber(padAngle, CHORD_PAD_ANGLE);
  return Number.isFinite(raw) && raw >= 0 ? raw : CHORD_PAD_ANGLE;
}

/**
 * Cómputo puro del layout chord (trunca determinista a MAX_CHORD,
 * clamp a >= 0 con toNumber; nunca toca el DOM).
 */
export function computeChordLayout(
  labels: string[],
  matrix: number[][],
  opts?: ChordLayoutOptions,
) {
  const rawMax = Math.floor(toNumber(opts?.maxItems ?? MAX_CHORD, MAX_CHORD));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0
      ? Math.min(rawMax, MAX_CHORD)
      : MAX_CHORD;
  const order = labels.slice(0, safeMax).map((_, i) => i);
  if (opts?.sortGroups) {
    const totals = order.map((i) => {
      let acc = 0;
      for (const j of order) {
        acc += Math.max(0, toNumber(matrix[i]?.[j]));
        acc += Math.max(0, toNumber(matrix[j]?.[i]));
      }
      return acc;
    });
    order.sort((a, b) => (totals[b] ?? 0) - (totals[a] ?? 0));
  }
  const capped = order.map((i) => labels[i] ?? "");
  const n = capped.length;
  const clean: number[][] = [];
  for (let i = 0; i < n; i += 1) {
    const src = order[i] ?? i;
    const row = matrix[src] ?? [];
    const cleanRow: number[] = [];
    for (let j = 0; j < n; j += 1) {
      cleanRow.push(Math.max(0, toNumber(row[order[j] ?? j])));
    }
    clean.push(cleanRow);
  }
  const layout = chord().padAngle(resolveChordPadAngle(opts?.padAngle));
  const chords: Chords = layout(clean);
  let total = 0;
  for (const row of clean) {
    for (const v of row) total += v;
  }
  return { labels: capped, matrix: clean, chords, total };
}
