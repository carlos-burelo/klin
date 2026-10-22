/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { max, min } from "d3-array";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { BAR_RADIUS, GRID_TICKS } from "../core/theme";

export const CANDLE_BAND_PADDING = 0.35;
export const CANDLE_MAX_WIDTH = 28;
export const TICKS_MIN = 1;
/** Separación entre la etiqueta de valor y el máximo de la vela. */
export const VALUE_LABEL_GAP = 4;
export const AXIS_LABEL_OFFSET = 10;
export const ANNOTATION_LABEL_DX = 4;
export const ANNOTATION_LABEL_DY = -4;

export type Candle = {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

/** Filas OHLC limpias (filtra no-finitas; tope DEFAULT_MAX_ROWS). */
export function buildCandles(
  data: Array<Record<string, string | number>>,
  labelKey: string,
  openKey: string,
  highKey: string,
  lowKey: string,
  closeKey: string,
): Candle[] {
  const computed: Candle[] = [];
  for (const d of data.slice(0, DEFAULT_MAX_ROWS)) {
    const open = toNumber(d[openKey], Number.NaN);
    const high = toNumber(d[highKey], Number.NaN);
    const low = toNumber(d[lowKey], Number.NaN);
    const close = toNumber(d[closeKey], Number.NaN);
    if (![open, high, low, close].every(Number.isFinite)) continue;
    computed.push({ label: String(d[labelKey] ?? ""), open, high, low, close });
  }
  return computed;
}

/** Ordena por cierre (`none` conserva el orden de entrada). */
export function orderCandles(
  computed: Candle[],
  sortGroups: "none" | "asc" | "desc",
): Candle[] {
  return sortGroups === "none"
    ? computed
    : [...computed].sort((a, b) =>
        sortGroups === "asc" ? a.close - b.close : b.close - a.close,
      );
}

/** Dominio Y OHLC (overrides fijos o min/max; alto > bajo). */
export function candleDomain(
  ordered: Candle[],
  yMin: number | undefined,
  yMax: number | undefined,
): { blo: number; bhi: number } {
  const lows = ordered.map((c) => c.low);
  const highs = ordered.map((c) => c.high);
  const fixedLo = toNumber(yMin, Number.NaN);
  const fixedHi = toNumber(yMax, Number.NaN);
  const blo = Number.isFinite(fixedLo) ? fixedLo : (min(lows) ?? 0);
  const rawHi = Number.isFinite(fixedHi) ? fixedHi : (max(highs) ?? 1);
  const bhi = rawHi <= blo ? blo + 1 : rawHi;
  return { blo, bhi };
}

/** Ticks sanitizados (piso, mínimo TICKS_MIN). */
export function resolveCandleTicks(gridTicks: number): number {
  return Math.max(TICKS_MIN, Math.floor(toNumber(gridTicks, GRID_TICKS)));
}

/** Radio del cuerpo sanitizado (piso en 0). */
export function resolveCandleRadius(barRadius: number): number {
  return Math.max(0, toNumber(barRadius, BAR_RADIUS));
}
