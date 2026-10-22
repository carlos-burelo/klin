/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { domainWithZero, logDomain, logFloor } from "./domain";
import { resolveFormatter, type ValueFormatter } from "./format";
import { toNumber } from "./number";
import { type ValueScaleKind, valueScale } from "./scale";
import { DEFAULT_LOCALE, GRID_TICKS, TICK_FONT_SIZE } from "./theme";

export type ValueAxisOptions = {
  /** Valores del dominio (planos o sumas apiladas, según el chart). */
  values: Array<unknown>;
  /** Ticks del grid (por defecto GRID_TICKS). */
  ticks?: number;
  /** Formato override (por defecto según locale). */
  format?: ValueFormatter;
  locale?: string;
  /** Límites fijos del dominio (si se omiten, desde los datos). */
  yMin?: number;
  yMax?: number;
  /** Escala del eje (`log` ignora no-positivos en geometría). */
  scale?: ValueScaleKind;
  /** Dominio fijo [0, 1] (apilado al 100 %). */
  percent?: boolean;
};

/** Etiqueta de valor colocada: posición y color con contraste. */
export type BarValueLabel = {
  pos: number;
  /** `true` cuando va dentro de la barra (fondo de contraste). */
  inside: boolean;
};

/** Desplazamiento de etiqueta de valor (px). */
export const VALUE_LABEL_DY = 4;
export const VALUE_LABEL_DX = 5;

/**
 * Etiqueta sobre barra vertical: fuera salvo que se recorte arriba, en cuyo
 * caso entra a la barra. `barTopY`/`plotTopY` en coords de SVG (con margen).
 */
export function placeTopValueLabel(
  barTopY: number,
  plotTopY: number,
  fontSize = TICK_FONT_SIZE,
  dy = VALUE_LABEL_DY,
): BarValueLabel {
  if (barTopY - dy - fontSize < plotTopY) {
    return { pos: barTopY + fontSize + dy, inside: true };
  }
  return { pos: barTopY - dy, inside: false };
}

/**
 * Etiqueta al final de barra horizontal: fuera salvo que se recorte a la
 * derecha, en cuyo caso entra a la barra (ancla inicio). `textW` medido.
 */
export function placeEndValueLabel(
  barEndX: number,
  plotRightX: number,
  textW: number,
  dx = VALUE_LABEL_DX,
): BarValueLabel {
  if (barEndX + dx + textW > plotRightX) {
    return { pos: barEndX - dx - textW, inside: true };
  }
  return { pos: barEndX + dx, inside: false };
}

/** Eje de valor construido: dominio + escala + ticks + formato. */
export type ValueAxis = {
  lo: number;
  hi: number;
  ticksCount: number;
  /** Escala lista (con `.nice()` aplicado). */
  y: (value: number) => number;
  ticks: number[];
  fmt: ValueFormatter;
  /** Eleva un valor al piso log (identidad en lineal). */
  lift: (value: number) => number;
  /** Verdadero si la escala efectiva es logarítmica. */
  log: boolean;
};

/**
 * Construye el eje de valor cartesiano (una sola fuente para los ~25 charts
 * cartesianos): dominio honesto con cero, overrides, log y modo percent.
 * `range` es el rango de píxeles ([innerH, 0] vertical, [0, innerW] horizontal).
 */
export function buildValueAxis(
  opts: ValueAxisOptions,
  range: [number, number],
): ValueAxis {
  const ticksCount = Math.max(1, Math.round(toNumber(opts.ticks, GRID_TICKS)));
  const percent = opts.percent ?? false;
  const [dlo, dhi] = percent ? ([0, 1] as const) : domainWithZero(opts.values);
  const log = (opts.scale ?? "linear") === "log" && !percent;
  const [llo, lhi] = log ? logDomain(opts.values) : ([dlo, dhi] as const);
  const lo = log ? llo : opts.yMin == null ? dlo : toNumber(opts.yMin, dlo);
  const hiBase = log ? lhi : opts.yMax == null ? dhi : toNumber(opts.yMax, dhi);
  const y = valueScale(
    log ? "log" : "linear",
    [lo, Math.max(hiBase, lo + 1)],
    range,
  ).nice(ticksCount);
  return {
    lo,
    hi: hiBase,
    ticksCount,
    y,
    ticks: y.ticks(ticksCount),
    fmt: resolveFormatter(opts.format, opts.locale ?? DEFAULT_LOCALE),
    lift: (v: number) => (log ? logFloor(v, lo) : v),
    log,
  };
}
