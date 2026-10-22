/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { toNumber } from "../core/number";
import { CHART_TOKEN } from "../core/theme";

export const TRACK_W = 600;
export const TRACK_H = 22;
/** Radio de la pista y opacidades de las bandas cualitativas. */
export const TRACK_RADIUS = 6;
export const BAND_OPACITY_LOW = 0.45;
export const BAND_OPACITY_MID = 0.7;
export const BAND_OPACITY_HIGH = 1;
/** Barra de valor centrada en la pista. */
export const VALUE_BAR_H = 7;
/** Grosor de la marca de meta. */
export const TARGET_WIDTH = 3;

export type BulletInputRow = {
  label: string;
  value: number;
  target: number;
  ranges: [number, number, number];
  detail?: string;
  color?: string;
  targetColor?: string;
};

/** Fila saneada (no-finitos como 0, verbatim de la vista). */
export type BulletCleanRow = {
  label: string;
  detail: string | undefined;
  value: number;
  target: number;
  ranges: [number, number, number];
  color: string | undefined;
  targetColor: string | undefined;
};

/** Segmento de banda cualitativa (verbatim de la vista). */
export type BulletSeg = { from: number; to: number; o: number };

/** Saneado de filas (verbatim de la vista). */
export function cleanBulletRows(rows: BulletInputRow[]): BulletCleanRow[] {
  return rows.map((r) => ({
    label: r.label,
    detail: r.detail,
    value: toNumber(r.value),
    target: toNumber(r.target),
    ranges: [
      toNumber(r.ranges[0]),
      toNumber(r.ranges[1]),
      toNumber(r.ranges[2]),
    ] as [number, number, number],
    color: r.color,
    targetColor: r.targetColor,
  }));
}

/** Tope de escala auto o fijo (verbatim de la vista). */
export function resolveBulletMax(
  clean: BulletCleanRow[],
  scaleMax: "auto" | number,
): number {
  return scaleMax === "auto"
    ? Math.max(1, ...clean.map((r) => Math.max(r.value, r.target, r.ranges[2])))
    : Math.max(1, toNumber(scaleMax, 1));
}

/** Rellenos + opacidades de bandas (verbatim de la vista). */
export function resolveBulletBands(
  bands: [string, string, string] | undefined,
): { bandFills: string[]; bandOpacity: number[] } {
  return {
    bandFills: [
      bands?.[0] ?? CHART_TOKEN.track,
      bands?.[1] ?? CHART_TOKEN.track,
      bands?.[2] ?? CHART_TOKEN.track,
    ],
    bandOpacity: [BAND_OPACITY_LOW, BAND_OPACITY_MID, BAND_OPACITY_HIGH],
  };
}

/** Segmentos [0,lo] [lo,mid] [mid,hi] fijados a 0 (verbatim de la vista). */
export function buildBulletSegments(
  ranges: [number, number, number],
  bandOpacity: number[],
): BulletSeg[] {
  const [lo, mid, hi] = ranges;
  return [
    {
      from: 0,
      to: Math.max(0, lo),
      o: bandOpacity[0] ?? BAND_OPACITY_LOW,
    },
    {
      from: Math.max(0, lo),
      to: Math.max(0, mid),
      o: bandOpacity[1] ?? BAND_OPACITY_MID,
    },
    {
      from: Math.max(0, mid),
      to: Math.max(0, hi),
      o: bandOpacity[2] ?? BAND_OPACITY_HIGH,
    },
  ];
}

/** Anchos dentro del riel (verbatim de la vista). */
export function resolveBulletGeometry(
  value: number,
  target: number,
  maxTotal: number,
): { valueW: number; targetX: number } {
  const valueW = Math.min(TRACK_W, Math.max(0, (value / maxTotal) * TRACK_W));
  const targetX = Math.min(TRACK_W, Math.max(0, (target / maxTotal) * TRACK_W));
  return { valueW, targetX };
}

/** Geometría de un segmento de banda (verbatim de la vista). */
export function bulletSegGeometry(
  s: BulletSeg,
  maxTotal: number,
): {
  sx: number;
  sw: number;
} {
  const sx = Math.min(TRACK_W, Math.max(0, (s.from / maxTotal) * TRACK_W));
  const sw = Math.max(
    0,
    Math.min(TRACK_W - sx, ((s.to - s.from) / maxTotal) * TRACK_W),
  );
  return { sx, sw };
}

/** Color de la barra de valor (verbatim de la vista). */
export function resolveBulletFill(color: string | undefined): string {
  return seriesColor(0, color);
}

/** Alto de pista opcional (verbatim de la vista). */
export function resolveBulletTrackStyle(
  height: number | undefined,
): { height: number } | undefined {
  return height == null ? undefined : { height: toNumber(height, TRACK_H) };
}
