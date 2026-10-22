/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import {
  type HierarchyRectangularNode,
  hierarchy,
  treemap,
  treemapDice,
  treemapSlice,
  treemapSquarify,
} from "d3-hierarchy";
import { seriesColor } from "../core/color";
import { DEFAULT_MAX_LEAVES } from "../core/limits";
import { toNumber } from "../core/number";
import { CHART_WIDTH } from "../core/theme";
import type { TreemapNode } from "./treemap-chart.types";

/** Cap de hojas (alias de DEFAULT_MAX_LEAVES, compat). */
export const MAX_TREEMAP_LEAVES = DEFAULT_MAX_LEAVES;

export const TREEMAP_H = 360;
export const TREEMAP_GAP = 3;
export const NODE_FONT_SIZE = 12;
export const LABEL_X = 8;
export const LABEL_DY = 20;
export const VALUE_DY = 36;
export const MIN_LABEL_W = 64;
export const MIN_LABEL_H = 30;
export const VALUE_OPACITY = 0.85;
/** Partición por defecto (equivale al tile clásico de d3). */
export const DEFAULT_TREEMAP_TILING = "squarify" as const;
/** Muestra valores bajo la etiqueta (comportamiento actual). */
export const DEFAULT_TREEMAP_SHOW_VALUES = true;
/** Funciones de partición por modo. */
export const TREEMAP_TILING_FNS = {
  squarify: treemapSquarify,
  slice: treemapSlice,
  dice: treemapDice,
} as const;

export type TreemapTiling = keyof typeof TREEMAP_TILING_FNS;

type TreemapDatum = {
  label: string;
  value?: number;
  color?: string;
  children?: TreemapNode[];
};

export type TreemapLeaf = HierarchyRectangularNode<TreemapDatum>;

/**
 * Cómputo puro del layout treemap. Ordena hojas por valor desc y
 * trunca a las primeras N para SSR.
 */
export function computeTreemapLayout(
  data: TreemapNode[],
  tiling: TreemapTiling = DEFAULT_TREEMAP_TILING,
  height: number = TREEMAP_H,
  gap: number = TREEMAP_GAP,
): {
  leaves: TreemapLeaf[];
  topLabels: string[];
} {
  const pad = Math.max(0, toNumber(gap, TREEMAP_GAP));
  const root: TreemapLeaf = treemap<TreemapDatum>()
    .size([CHART_WIDTH, height])
    .paddingOuter(pad)
    .paddingInner(pad)
    .tile(TREEMAP_TILING_FNS[tiling] ?? treemapSquarify)
    .round(true)(
    hierarchy<TreemapDatum>({
      label: "root",
      children: data,
    })
      .sum((d) => toNumber(d.value))
      .sort((a, b) => toNumber(b.value) - toNumber(a.value)),
  );

  const leaves = root
    .leaves()
    .filter((l) => toNumber(l.value) > 0)
    .sort((a, b) => toNumber(b.value) - toNumber(a.value))
    .slice(0, MAX_TREEMAP_LEAVES);
  const topLabels = data.map((d) => d.label);
  return { leaves, topLabels };
}

/** Separación entre celdas normalizada (TREEMAP_GAP actual). */
export function normalizeTreemapGap(gap: unknown): number {
  return Math.max(0, toNumber(gap, TREEMAP_GAP));
}

/** Color de celda: grupo superior, o paleta por profundidad (verbatim de la vista). */
export function resolveTreemapColor(
  topIndex: number,
  topColor: string | undefined,
  leafColor: string | undefined,
  depth: number,
  depthColors: string[] | undefined,
): string {
  const baseColor = seriesColor(topIndex, topColor ?? leafColor);
  return depthColors !== undefined && depthColors.length > 0
    ? (depthColors[depth % depthColors.length] ?? baseColor)
    : baseColor;
}
