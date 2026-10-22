/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { layoutDag } from "../core/dag/layout";
import type { DagLayout } from "../core/dag/types";
import { DIAGRAM_MIN_SCROLL } from "../core/theme";
import { fitNodeWidth } from "../render/measure";
import type {
  ClassEdge,
  ClassMemberOptions,
  ClassMemberView,
  ClassNode,
} from "./class-diagram.types";

export const NODE_FONT_SIZE = 12;
export const NODE_RX_PROCESS = 8;
export const TITLE_H = 30;
export const ROW = 20;
export const BODY_PAD = 10;
export const MIN_NODE_H = 64;
export const NODE_FIT = { min: 180, max: 280, size: 11, pad: 40 } as const;
export const LAYOUT = {
  GAP_X: 64,
  GAP_Y: 72,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
export const TITLE_DY = 20;
export const ATTR_X = 10;
export const ATTR_DY = 15;
export const METHOD_DY = 19;
export const DIVIDER_PAD = 4;
export const DASH_DEPENDENCY = "5 4";
/** Máximo de miembros visibles por clase antes de colapsar en `+N más`. */
export const CLASS_MEMBER_LIMIT = 12;

/** Indica si un miembro cuenta como público (`+` o sin prefijo de visibilidad). */
export function isPublicMember(member: string): boolean {
  const first = Array.from(member.trimStart())[0];
  return first !== "#" && first !== "-" && first !== "~";
}

/** Aplica visibilidad, secciones y límite a los miembros de una clase. */
export function classMemberView(
  n: ClassNode,
  opts: ClassMemberOptions,
): ClassMemberView {
  const attrs = opts.showAttributes ? (n.attributes ?? []) : [];
  const methods = opts.showMethods ? (n.methods ?? []) : [];
  const visibleAttrs =
    opts.visibility === "public" ? attrs.filter(isPublicMember) : attrs;
  const visibleMethods =
    opts.visibility === "public" ? methods.filter(isPublicMember) : methods;
  const total = visibleAttrs.length + visibleMethods.length;
  const limit = Math.max(0, opts.memberLimit);
  if (total <= limit) {
    return { attributes: visibleAttrs, methods: visibleMethods, hidden: 0 };
  }
  const keptAttrs = visibleAttrs.slice(0, limit);
  const keptMethods = visibleMethods.slice(
    0,
    Math.max(0, limit - keptAttrs.length),
  );
  return {
    attributes: keptAttrs,
    methods: keptMethods,
    hidden: total - keptAttrs.length - keptMethods.length,
  };
}

/**
 * Cómputo puro del layout de clases (alturas por miembro + DAG con cap SSR).
 */
export function computeClassLayout(
  nodes: ClassNode[],
  edges: ClassEdge[],
  direction: "TB" | "LR" = "TB",
  options?: Partial<ClassMemberOptions>,
): {
  layout: DagLayout;
  byId: Map<string, ClassNode>;
  heights: Map<string, number>;
  width: number;
  height: number;
} {
  const opts: ClassMemberOptions = {
    showMethods: options?.showMethods ?? true,
    showAttributes: options?.showAttributes ?? true,
    visibility: options?.visibility ?? "all",
    memberLimit: options?.memberLimit ?? CLASS_MEMBER_LIMIT,
  };
  const views = new Map(nodes.map((n) => [n.id, classMemberView(n, opts)]));
  const heights = new Map(
    nodes.map((n) => {
      const view = views.get(n.id) ?? {
        attributes: [],
        methods: [],
        hidden: 0,
      };
      return [
        n.id,
        TITLE_H +
          view.attributes.length * ROW +
          view.methods.length * ROW +
          (view.hidden > 0 ? ROW : 0) +
          BODY_PAD,
      ];
    }),
  );
  const H = Math.max(MIN_NODE_H, ...heights.values());
  const W = fitNodeWidth(
    nodes.flatMap((n) => [
      n.name,
      ...(n.attributes ?? []),
      ...(n.methods ?? []),
    ]),
    {
      min: NODE_FIT.min,
      max: NODE_FIT.max,
      size: NODE_FIT.size,
      pad: NODE_FIT.pad,
    },
  );
  const layout = layoutDag(
    nodes.map((n) => n.id),
    edges,
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
    byId: new Map(nodes.map((n) => [n.id, n])),
    heights,
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height),
  };
}
