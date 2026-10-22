/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { sum } from "d3-array";
import type { Arc, PieArcDatum } from "d3-shape";
import { arc, pie } from "d3-shape";
import { seriesColor } from "../core/color";
import { toNumber } from "../core/number";

import { PERCENT_FACTOR, TICK_FONT_SIZE } from "../core/theme";
import { fitText, measureText } from "../render/measure";
import type {
  DonutChartProps,
  DonutDatum,
  DonutLabelMode,
} from "./donut-chart.types";

/** Tamaño del total al centro de la dona. */
export const CENTER_VALUE_FONT_SIZE = 22;
/** Desplazamiento vertical del total y de la etiqueta "Total". */
export const CENTER_VALUE_DY = 4;
export const CENTER_LABEL_DY = 14;
/** Píldora de fondo del total cuando no hay agujero (torta): legibilidad. */
export const TOTAL_PILL_PAD_X = 12;
export const TOTAL_PILL_PAD_Y = 10;
export const TOTAL_PILL_RX = 10;
/** Margen extra para vetar etiquetas internas bajo la píldora. */
export const TOTAL_PILL_HIT_PAD = 4;

/** Píldora del total: dimensiones y si se pinta. */
export type TotalPill = {
  show: boolean;
  w: number;
  h: number;
};

/**
 * Resuelve la píldora del total: siempre sin agujero; con agujero solo si el
 * texto no cabe en él. Pura y determinista.
 */
export function resolveTotalPill(
  textW: number,
  holeDiam: number,
  fontSize = CENTER_VALUE_FONT_SIZE,
  tickSize = TICK_FONT_SIZE,
): TotalPill {
  const w = textW + TOTAL_PILL_PAD_X * 2;
  const h = fontSize + tickSize + TOTAL_PILL_PAD_Y * 2;
  const show = holeDiam <= 0 || w > holeDiam;
  return { show, w, h };
}

/** Si un punto cae bajo la píldora (etiqueta interna vetada). */
export function totalPillHits(pill: TotalPill, x: number, y: number): boolean {
  if (!pill.show) return false;
  return (
    Math.abs(x) <= pill.w / 2 + TOTAL_PILL_HIT_PAD &&
    Math.abs(y) <= pill.h / 2 + TOTAL_PILL_HIT_PAD
  );
}
/** Vuelta completa en radianes (rotación de rebanadas). */
export const TAU = Math.PI * 2;
/** Longitud mínima de arco (px) para pintar el % dentro de la rebanada. */
export const INNER_LABEL_MIN_ARC = 30;

/** Fila limpia de dona (valor finitizado, índice original). */
export type DonutSlice = {
  label: string;
  color?: string;
  value: number;
  index: number;
};

/** Filtra no-finitos y valores <= 0 (verbatim de la vista). */
export function cleanDonutData(data: DonutDatum[]): DonutSlice[] {
  return data
    .map((d, index) => ({
      label: d.label,
      color: d.color,
      value: toNumber(d.value),
      index,
    }))
    .filter((d) => d.value > 0);
}

/** Suma de valores limpios. */
export function donutTotal(clean: DonutSlice[]): number {
  return sum(clean, (d) => d.value);
}

/** Normaliza ángulos de la dona (verbatim de la vista). */
export function normalizeDonutAngles(
  startAngle: unknown,
  padAngle: unknown,
  cornerRadius: unknown,
): { start: number; pad: number; corners: number } {
  const start = toNumber(startAngle);
  const pad = Math.max(0, toNumber(padAngle));
  const corners = Math.max(0, toNumber(cornerRadius));
  return { start, pad, corners };
}

/** Radio exterior e intermedio según size/thickness. */
export function donutLayout(
  size: number,
  thickness: number,
): { radius: number; midRadius: number } {
  const radius = size / 2;
  const midRadius = radius - thickness / 2;
  return { radius, midRadius };
}

/** Ordena de mayor a menor solo si `sortSlices` (respeta entrada por defecto). */
export function orderDonutSlices(
  clean: DonutSlice[],
  sortSlices: boolean,
): DonutSlice[] {
  return sortSlices ? [...clean].sort((a, b) => b.value - a.value) : clean;
}

/** Generador d3-pie con vuelta completa desde `start`. */
export function buildDonutArcs(
  ordered: DonutSlice[],
  start: number,
  pad: number,
): PieArcDatum<DonutSlice>[] {
  const pieGen = pie<DonutSlice>()
    .value((d) => d.value)
    .padAngle(pad)
    .startAngle(start)
    .endAngle(start + TAU)
    .sort(null);
  return pieGen(ordered);
}

/** Generador d3-arc para las rebanadas. */
export function buildDonutPath(
  radius: number,
  thickness: number,
  corners: number,
): Arc<unknown, PieArcDatum<DonutSlice>> {
  return arc<PieArcDatum<DonutSlice>>()
    .innerRadius(radius - thickness)
    .outerRadius(radius)
    .cornerRadius(corners);
}

/** Color de rebanada: `datum.color` → `itemColor` → serie. */
export function resolveDonutSliceColor(
  datum: DonutSlice,
  itemColor: DonutChartProps["itemColor"],
): string {
  return (
    datum.color ?? itemColor?.(datum, datum.index) ?? seriesColor(datum.index)
  );
}

/** Porcentaje entero de la rebanada sobre el total. */
export function donutPercent(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * PERCENT_FACTOR) : 0;
}

/** Si el arco es grande para pintar el % dentro (verbatim de la vista). */
export function donutFitsInner(
  withInner: boolean,
  midRadius: number,
  a: PieArcDatum<DonutSlice>,
): boolean {
  return (
    withInner &&
    midRadius > 0 &&
    (a.endAngle - a.startAngle) * midRadius >= INNER_LABEL_MIN_ARC
  );
}

/** Separación de la etiqueta externa al borde y codo del conector. */
export const OUTER_LABEL_OFFSET = 14;
export const OUTER_LABEL_ELBOW = 4;
/** Margen al viewBox y separación vertical mínima entre etiquetas (×fuente). */
export const OUTER_LABEL_PAD = 4;
export const OUTER_LABEL_GAP_RATIO = 1.15;
/** Ancho máximo de carril lateral y colchón vertical del lienzo con etiquetas. */
export const OUTER_LANE_MAX = 90;
export const OUTER_V_PAD = 16;
/** Despeje mínimo entre el borde del círculo y la etiqueta. */
export const OUTER_LABEL_CLEAR = 8;

/** Punto y ancla de la etiqueta externa (lado según el ángulo medio). */
export function donutOuterPoint(
  a: PieArcDatum<DonutSlice>,
  radius: number,
): { x: number; y: number; anchor: "start" | "end"; leader: string } {
  const mid = (a.startAngle + a.endAngle) / 2;
  const edge = arc<PieArcDatum<DonutSlice>>()
    .innerRadius(radius)
    .outerRadius(radius)
    .centroid(a);
  const right = Math.cos(mid - Math.PI / 2) >= 0;
  const lx = edge[0] + (right ? OUTER_LABEL_OFFSET : -OUTER_LABEL_OFFSET);
  const anchor = right ? "start" : "end";
  const tx = lx + (right ? OUTER_LABEL_ELBOW : -OUTER_LABEL_ELBOW);
  return {
    x: tx,
    y: edge[1],
    anchor,
    leader: `M ${edge[0]} ${edge[1]} L ${lx} ${edge[1]} L ${tx} ${edge[1]}`,
  };
}

/** Etiqueta externa colocada: texto que cabe, punto anclado y conector. */
export type DonutOuterLabel = {
  /** Índice del arco en `arcs` (para mapear en la vista). */
  index: number;
  text: string;
  x: number;
  y: number;
  anchor: "start" | "end";
  leader: string;
};

/** Resultado del layout externo: etiquetas + carril lateral medido. */
export type DonutOuterLayout = {
  labels: DonutOuterLabel[];
  /** Ancho reservado por lado (0 = sin etiquetas). */
  lane: number;
};

/**
 * Coloca etiquetas externas con carriles laterales: el lienzo se ensancha lo
 * medido (topado), el texto se trunca al carril, se sujeta al viewBox y se
 * apila por lado con separación mínima. Puro y determinista. Las rebanadas
 * sin texto o sin hueco no generan etiqueta (sin conectores huérfanos).
 */
export function layoutDonutOuterLabels(
  arcs: PieArcDatum<DonutSlice>[],
  radius: number,
  _size: number,
  textFor: (datum: DonutSlice, index: number) => string,
  fontSize = TICK_FONT_SIZE,
): DonutOuterLayout {
  type Raw = {
    index: number;
    text: string;
    anchor: "start" | "end";
    edgeY: number;
  };
  const raws: Raw[] = [];
  arcs.forEach((a, i) => {
    const raw = textFor(a.data, i);
    if (!raw) return;
    const mid = (a.startAngle + a.endAngle) / 2;
    const edge = arc<PieArcDatum<DonutSlice>>()
      .innerRadius(radius)
      .outerRadius(radius)
      .centroid(a);
    const right = Math.cos(mid - Math.PI / 2) >= 0;
    // Trunca a la capacidad real del carril (topado menos despeje y margen):
    // así el clamp posterior siempre tiene solución.
    const text = fitText(
      raw,
      OUTER_LANE_MAX - OUTER_LABEL_CLEAR - OUTER_LABEL_PAD,
      fontSize,
    );
    if (!text) return;
    raws.push({
      index: i,
      text,
      anchor: right ? "start" : "end",
      edgeY: edge[1],
    });
  });
  if (raws.length === 0) return { labels: [], lane: 0 };
  // Carril = lo medido (topado); todas caben por construcción.
  const lane = Math.min(
    OUTER_LANE_MAX,
    Math.max(
      0,
      ...raws.map(
        (r) =>
          measureText(r.text, fontSize) +
          OUTER_LABEL_OFFSET +
          OUTER_LABEL_ELBOW +
          OUTER_LABEL_PAD,
      ),
    ),
  );
  const gap = fontSize * OUTER_LABEL_GAP_RATIO;
  const minY = -(radius + OUTER_V_PAD) + fontSize;
  const maxY = radius + OUTER_V_PAD - fontSize;
  // Cotas en coords relativas al centro: el carril vive FUERA del círculo
  // ([radius+CLEAR, radius+lane-PAD-w] a la derecha, espejo a la izquierda).
  const placed: DonutOuterLabel[] = raws.map((r) => {
    const a = arcs[r.index];
    const edge: [number, number] = a
      ? arc<PieArcDatum<DonutSlice>>()
          .innerRadius(radius)
          .outerRadius(radius)
          .centroid(a)
      : [0, r.edgeY];
    const want =
      edge[0] +
      (r.anchor === "start"
        ? OUTER_LABEL_OFFSET + OUTER_LABEL_ELBOW
        : -(OUTER_LABEL_OFFSET + OUTER_LABEL_ELBOW));
    const w = measureText(r.text, fontSize);
    const lo = radius + OUTER_LABEL_CLEAR;
    const hi = radius + lane - OUTER_LABEL_PAD - w;
    const x =
      r.anchor === "start"
        ? Math.min(Math.max(want, lo), Math.max(lo, hi))
        : -Math.min(Math.max(-want, lo), Math.max(lo, hi));
    return {
      index: r.index,
      text: r.text,
      x,
      y: r.edgeY,
      anchor: r.anchor,
      leader: "",
    };
  });
  // Apilado por lado con hueco mínimo, sujeto al lienzo.
  for (const anchor of ["start", "end"] as const) {
    const side = placed
      .filter((pp) => pp.anchor === anchor)
      .sort((aa, bb) => aa.y - bb.y);
    let prev = -Infinity;
    for (const q of side) {
      q.y = Math.min(maxY, Math.max(minY, Math.max(q.y, prev + gap)));
      prev = q.y;
    }
  }
  // Conectores: borde de rebanada → codo → etiqueta.
  const labels = placed.map((q) => {
    const a = arcs[q.index];
    if (!a) return { ...q, leader: "" };
    const edge = arc<PieArcDatum<DonutSlice>>()
      .innerRadius(radius)
      .outerRadius(radius)
      .centroid(a);
    const lx =
      q.x + (q.anchor === "start" ? -OUTER_LABEL_ELBOW : OUTER_LABEL_ELBOW);
    return {
      ...q,
      leader: `M ${edge[0]} ${edge[1]} L ${lx} ${edge[1]} L ${q.x} ${q.y}`,
    };
  });
  return { labels, lane };
}

/** Etiqueta de leyenda: con valor (actual) o solo etiqueta. */
export function donutLegendLabel(
  label: string,
  formattedValue: string,
  showValues = true,
): string {
  return showValues ? `${label} · ${formattedValue}` : label;
}

/** Texto de la etiqueta interna según el modo (porcentaje, valor o nombre). */
export function donutInnerLabel(
  datum: DonutSlice,
  mode: DonutLabelMode,
  fmt: (value: number) => string,
  total: number,
): string {
  switch (mode) {
    case "value":
      return fmt(datum.value);
    case "label":
      return datum.label;
    case "percent":
      return `${donutPercent(datum.value, total)}%`;
    case "none":
      return "";
  }
}
