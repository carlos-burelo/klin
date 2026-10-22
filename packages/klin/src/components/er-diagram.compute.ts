/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { layoutDag } from "../core/dag/layout";
import type { DagLayout } from "../core/dag/types";
import { DIAGRAM_MIN_SCROLL } from "../core/theme";
import { fitNodeWidth } from "../render/measure";
import type { ErEntity, ErRelation } from "./er-diagram.types";

export const NODE_FONT_SIZE = 12;
export const NODE_RX_PROCESS = 8;
export const HEADER = 30;
export const ROW = 22;
export const BODY_PAD = 6;
export const MIN_NODE_H = 60;
export const NODE_FIT = { min: 170, max: 280, size: 11, pad: 40 } as const;
export const LAYOUT = {
  GAP_X: 60,
  GAP_Y: 72,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
export const TITLE_DY = 20;
export const ATTR_X = 10;
export const ATTR_DY = 16;
/** Sangría del borde interior de entidad débil. */
export const ER_WEAK_INSET = 4;
/** Pata de gallo: largo de púa, apertura y separación del borde. */
export const ER_CROWFOOT_LEN = 12;
export const ER_CROWFOOT_SPREAD = 6;
export const ER_CROWFOOT_GAP = 6;
/** Truncado de la etiqueta de entidad. */
export const ER_LABEL_MAX = 22;

/** Atributos visibles de una entidad + ocultos por `attributeLimit`. */
export function erAttributeView(
  attributes: ErEntity["attributes"],
  attributeLimit?: number,
): { shown: ErEntity["attributes"]; hidden: number } {
  if (attributeLimit === undefined) return { shown: attributes, hidden: 0 };
  const limit = Math.max(0, Math.floor(attributeLimit));
  const shown = attributes.slice(0, limit);
  return { shown, hidden: attributes.length - shown.length };
}
/** Indica si el lado destino de una cardinalidad (`1:N`) es múltiple. */
export function isManySide(label: string | undefined): boolean {
  if (!label) return false;
  const side = label.split(":")[1]?.trim().toUpperCase();
  return side === "N" || side === "M" || side === "*";
}

/**
 * Cómputo puro del layout ER (alturas por atributo + DAG con cap SSR).
 */
export function computeErLayout(
  entities: ErEntity[],
  relations: ErRelation[],
  direction: "TB" | "LR" = "LR",
  attributeLimit?: number,
): {
  layout: DagLayout;
  byId: Map<string, ErEntity>;
  heights: Map<string, number>;
  width: number;
  height: number;
} {
  const limit =
    attributeLimit === undefined
      ? undefined
      : Math.max(0, Math.floor(attributeLimit));
  const visibleCount = (total: number) =>
    limit === undefined ? total : Math.min(total, limit);
  const heights = new Map(
    entities.map((e) => {
      const shown = visibleCount(e.attributes.length);
      const hidden = e.attributes.length - shown;
      return [e.id, HEADER + shown * ROW + (hidden > 0 ? ROW : 0) + BODY_PAD];
    }),
  );
  const H = Math.max(MIN_NODE_H, ...heights.values());
  const W = fitNodeWidth(
    entities.flatMap((e) => [
      e.name,
      ...e.attributes.map((a) => `${a.key ? `${a.key} ` : ""}${a.name}`),
    ]),
    {
      min: NODE_FIT.min,
      max: NODE_FIT.max,
      size: NODE_FIT.size,
      pad: NODE_FIT.pad,
    },
  );
  const layout = layoutDag(
    entities.map((e) => e.id),
    relations,
    {
      direction,
      nodeW: W,
      nodeH: H,
      gapX: LAYOUT.GAP_X,
      gapY: LAYOUT.GAP_Y,
      minW: LAYOUT.MIN_W,
      maxNodes: LAYOUT.MAX_NODES,
    },
  );
  return {
    layout,
    byId: new Map(entities.map((e) => [e.id, e])),
    heights,
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height),
  };
}
