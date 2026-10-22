/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { layoutDag } from "../core/dag/layout";
import type { DagLayout } from "../core/dag/types";
import { CHART_TOKEN, DIAGRAM_MIN_SCROLL } from "../core/theme";
import { fitNodeWidth } from "../render/measure";
import type { TopoEdge, TopoNode, TopoRole } from "./network-topology.types";

export const NODE_FONT_SIZE = 12;
export const NODE_RX_PROCESS = 8;
export const NODE_FIT = { min: 150, max: 220, size: 12, pad: 52 } as const;
export const LAYOUT = {
  NODE_H: 60,
  GAP_X: 48,
  GAP_Y: 72,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
export const GLYPH_X = 24;
export const LABEL_X = 38;
export const LABEL_DY = 4;
export const LABEL_DY_WITH_SUB = -3;
export const SUB_DY = 12;
export const DASH_DOWN = "5 4";
export const UNKNOWN_RANK = 99;

const ROLE_ORDER: TopoRole[] = [
  "internet",
  "cloud",
  "firewall",
  "router",
  "switch",
  "server",
  "host",
];

export function roleColor(role: TopoRole): string {
  switch (role) {
    case "internet":
      return CHART_TOKEN.accent;
    case "cloud":
      return CHART_TOKEN.chart4;
    case "firewall":
      return CHART_TOKEN.destructive;
    case "router":
      return CHART_TOKEN.chart1;
    case "switch":
      return CHART_TOKEN.chart3;
    case "server":
      return CHART_TOKEN.chart5;
    case "host":
      return CHART_TOKEN.muted;
  }
}

export function statusColor(
  status: NonNullable<TopoEdge["status"]>,
  overrides?: Partial<Record<NonNullable<TopoEdge["status"]>, string>>,
): string {
  const override = overrides?.[status];
  if (override) return override;
  switch (status) {
    case "down":
      return CHART_TOKEN.destructive;
    case "degraded":
      return CHART_TOKEN.chart3;
    default:
      return CHART_TOKEN.muted;
  }
}

/**
 * Cómputo puro del layout de topología (orden por rol + DAG).
 */
export function computeTopologyLayout(
  nodes: TopoNode[],
  edges: TopoEdge[],
  direction: "TB" | "LR" = "TB",
): {
  layout: DagLayout;
  byId: Map<string, TopoNode>;
  edgeByKey: Map<string, TopoEdge>;
  width: number;
  height: number;
  usedStatuses: Array<NonNullable<TopoEdge["status"]> | "up">;
} {
  const rank = new Map(ROLE_ORDER.map((r, i) => [r, i]));
  const ordered = [...nodes].sort(
    (a, b) =>
      (rank.get(a.role ?? "server") ?? UNKNOWN_RANK) -
      (rank.get(b.role ?? "server") ?? UNKNOWN_RANK),
  );
  const W = fitNodeWidth(
    nodes.flatMap((n) => (n.sub ? [n.label, n.sub] : [n.label])),
    {
      min: NODE_FIT.min,
      max: NODE_FIT.max,
      size: NODE_FIT.size,
      pad: NODE_FIT.pad,
    },
  );
  const H = LAYOUT.NODE_H;
  const layout = layoutDag(
    ordered.map((n) => n.id),
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
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edgeByKey = new Map(
    edges.map((e) => [`${e.from}→${e.to}`, e] as const),
  );
  const usedStatuses = [
    ...new Set(edges.map((e) => e.status ?? "up")),
  ] as Array<NonNullable<TopoEdge["status"]> | "up">;
  return {
    layout,
    byId,
    edgeByKey,
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height),
    usedStatuses,
  };
}
