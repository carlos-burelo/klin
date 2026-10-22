/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import {
  type HierarchyRectangularNode,
  hierarchy,
  partition,
} from "d3-hierarchy";
import type { Arc } from "d3-shape";
import { arc } from "d3-shape";
import { seriesColor } from "../core/color";
import { DEFAULT_MAX_LEAVES } from "../core/limits";
import { toNumber } from "../core/number";
import type { SunburstChartProps, SunburstNode } from "./sunburst-chart.types";

/** Cap de anillos (alias de DEFAULT_MAX_LEAVES, compat). */
export const MAX_SUNBURST_RINGS = DEFAULT_MAX_LEAVES;

export const DEFAULT_SIZE = 300;
export const RING_PAD = 8;
export const MIN_ARC_SPAN = 0.35;
export const MIN_RING_W = 22;
export const RING_OPACITY = 0.75;
export const FULL_CIRCLE = 2 * Math.PI;
export const HALF_CIRCLE_DEG = 180;
/** Muestra la etiqueta central con el total (comportamiento por defecto). */
export const DEFAULT_SUNBURST_SHOW_ROOT_LABEL = true;
/** Radio de esquina de arcos (0 = bordes rectos actuales). */
export const DEFAULT_SUNBURST_CORNER_RADIUS = 0;
/** Separación angular entre arcos (0 = sin separación actual). */
export const DEFAULT_SUNBURST_PAD_ANGLE = 0;
/** Truncado de la etiqueta de arco. */
export const SUNBURST_LABEL_MAX = 12;

type SunburstDatum = {
  label: string;
  value?: number;
  color?: string;
  children?: SunburstNode[];
};

export type SunburstRing = HierarchyRectangularNode<SunburstDatum>;

/**
 * Cómputo puro del layout sunburst (partición radial).
 * Trunca a los N anillos de mayor valor para SSR.
 */
export function computeSunburstLayout(
  data: SunburstNode[],
  size: number,
  depth?: number,
) {
  const root = hierarchy<SunburstDatum>({ label: "root", children: data })
    .sum((d) => toNumber(d.value))
    .sort((a, b) => toNumber(b.value) - toNumber(a.value));
  const proot = partition<SunburstDatum>().size([FULL_CIRCLE, size / 2])(root);
  const rings = (
    proot
      .descendants()
      .filter(
        (d) =>
          d.depth > 0 &&
          toNumber(d.value) > 0 &&
          (depth === undefined || d.depth <= depth),
      ) as SunburstRing[]
  )
    .sort((a, b) => toNumber(b.value) - toNumber(a.value))
    .slice(0, MAX_SUNBURST_RINGS);
  const tops = data.map((d) => d.label);
  return { rings, root, tops };
}

/** Generador d3-arc para los anillos (verbatim de la vista). */
export function buildSunburstPath(
  cornerRadius: number,
  padAngle: number,
): Arc<unknown, SunburstRing> {
  return arc<SunburstRing>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1)
    .cornerRadius(cornerRadius)
    .padAngle(padAngle);
}

/** Color del anillo por grupo superior (verbatim de la vista). */
export function resolveSunburstColor(
  topIndex: number,
  color: string | undefined,
  node?: SunburstNode,
  depth?: number,
  itemColor?: SunburstChartProps["itemColor"],
): string {
  return (
    color || (node && itemColor?.(node, depth ?? 0)) || seriesColor(topIndex)
  );
}
