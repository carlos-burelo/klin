/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import type { DagLayout } from "../lib/graph";
import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { stableKey } from "../lib/keys";
import { truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  EDGE_LABEL_FONT_SIZE,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
  NODE_BORDER_WIDTH,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

export type TopoRole =
  | "internet"
  | "cloud"
  | "firewall"
  | "router"
  | "switch"
  | "server"
  | "host";

export type TopoNode = {
  id: string;
  label: string;
  sub?: string;
  role?: TopoRole;
};

export type TopoEdge = {
  from: string;
  to: string;
  label?: string;
  status?: "up" | "degraded" | "down";
};

const NODE_FONT_SIZE = 12;
const NODE_RX_PROCESS = 8;
const NODE_FIT = { min: 150, max: 220, size: 12, pad: 52 } as const;
const LAYOUT = {
  NODE_H: 60,
  GAP_X: 48,
  GAP_Y: 72,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
const ARROW_MARKER = {
  SIZE: 10,
  REF_X: 8,
  REF_Y: 5,
  WIDTH: 7,
  HEIGHT: 7,
} as const;
const GLYPH_R = 7;
const GLYPH_THIN = 1.25;
const GLYPH_RX_SMALL = 2;
const GLYPH_RX_TINY = 1.5;
const GLYPH_DOT_R = 1;
/** Marcos de glifo por rol (x, y, w, h relativos al centro). */
const GLYPH_FRAME = {
  firewall: { dx: -7, dy: -6, w: 14, h: 12, lineDy: 2 },
  switch: { dx: -8, dy: -5, w: 16, h: 10 },
  server: {
    dx: -6,
    dy: -8,
    w: 12,
    h: 16,
    dotDx: -2.5,
    dotDy: 4,
    slotX1: 1,
    slotX2: 4,
    slotDy: 4,
  },
  host: { w: 14, h: 9, dy: -6, standTop: 3, standFoot: 4 },
} as const;
/** Trazo de nube (curvas fijas del glifo). */
const CLOUD_PATH_OFFSETS = { x0: -8, dy: 3, tailDx: -15, tailDy: 4.6 } as const;
/** Flecha de router y switch (desplazamientos fijos del glifo). */
const ROUTER_ARROW = {
  tail: -3.5,
  len: 7,
  headX: 1.5,
  headDy: 2,
  dash: "2 1.5",
} as const;
const SWITCH_ZIGZAG = {
  x0: -4,
  dy: 1,
  step: 2.5,
  rise: 3,
  x1: 1,
  dy2: -1,
} as const;
const GLYPH_X = 24;
const LABEL_X = 38;
const LABEL_DY = 4;
const LABEL_DY_WITH_SUB = -3;
const SUB_DY = 12;
const DASH_DOWN = "5 4";
const UNKNOWN_RANK = 99;

/** Props de la topología de red. */
export type NetworkTopologyProps = {
  nodes: TopoNode[];
  edges: TopoEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Muestra la leyenda de estado de enlace. */
  linkLegend?: boolean;
  /** Tamaño del glifo de rol (base `GLYPH_R`). */
  glyphSize?: number;
  /** Sobrescribe el color por estado de enlace. */
  statusColors?: Partial<Record<NonNullable<TopoEdge["status"]>, string>>;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const ROLE_ORDER: TopoRole[] = [
  "internet",
  "cloud",
  "firewall",
  "router",
  "switch",
  "server",
  "host",
];

function roleColor(role: TopoRole): string {
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

function statusColor(
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

/** Glifo del rol (16px) dibujado en (x, y). */
function RoleGlyph({ role, x, y }: { role: TopoRole; x: number; y: number }) {
  const c = roleColor(role);
  switch (role) {
    case "internet":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH} fill="none">
          <circle cx={x} cy={y} r={GLYPH_R} />
          <ellipse cx={x} cy={y} rx={GLYPH_R / 2} ry={GLYPH_R} />
          <line x1={x - GLYPH_R} y1={y} x2={x + GLYPH_R} y2={y} />
        </g>
      );
    case "cloud":
      return (
        <g fill="none" stroke={c} strokeWidth={EDGE_WIDTH}>
          <path
            d={`M ${x + CLOUD_PATH_OFFSETS.x0} ${y + CLOUD_PATH_OFFSETS.dy} a 4 4 0 0 1 1 -7.8 a 5 5 0 0 1 9.4 -2 a 3.6 3.6 0 0 1 4.6 5.2 l ${CLOUD_PATH_OFFSETS.tailDx} ${CLOUD_PATH_OFFSETS.tailDy} z`}
          />
        </g>
      );
    case "firewall":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH}>
          <rect
            x={x + GLYPH_FRAME.firewall.dx}
            y={y + GLYPH_FRAME.firewall.dy}
            width={GLYPH_FRAME.firewall.w}
            height={GLYPH_FRAME.firewall.h}
            rx={GLYPH_RX_SMALL}
            fill="none"
          />
          <line
            x1={x - GLYPH_R}
            y1={y - GLYPH_FRAME.firewall.lineDy}
            x2={x + GLYPH_R}
            y2={y - GLYPH_FRAME.firewall.lineDy}
          />
          <line
            x1={x - GLYPH_R}
            y1={y + GLYPH_FRAME.firewall.lineDy}
            x2={x + GLYPH_R}
            y2={y + GLYPH_FRAME.firewall.lineDy}
          />
        </g>
      );
    case "router":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH} fill="none">
          <circle cx={x} cy={y} r={GLYPH_R} />
          <path
            d={`M ${x + ROUTER_ARROW.tail} ${y} h ${ROUTER_ARROW.len} M ${x + ROUTER_ARROW.headX} ${y - ROUTER_ARROW.headDy} L ${x - ROUTER_ARROW.tail} ${y} L ${x + ROUTER_ARROW.headX} ${y + ROUTER_ARROW.headDy}`}
          />
          <path
            d={`M ${x - ROUTER_ARROW.tail} ${y} h -${ROUTER_ARROW.len}`}
            strokeDasharray={ROUTER_ARROW.dash}
          />
        </g>
      );
    case "switch":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH} fill="none">
          <rect
            x={x + GLYPH_FRAME.switch.dx}
            y={y + GLYPH_FRAME.switch.dy}
            width={GLYPH_FRAME.switch.w}
            height={GLYPH_FRAME.switch.h}
            rx={GLYPH_RX_SMALL}
          />
          <path
            d={`M ${x + SWITCH_ZIGZAG.x0} ${y + SWITCH_ZIGZAG.dy} l ${SWITCH_ZIGZAG.step} -${SWITCH_ZIGZAG.rise} l ${SWITCH_ZIGZAG.step} ${SWITCH_ZIGZAG.rise} M ${x + SWITCH_ZIGZAG.x1} ${y + SWITCH_ZIGZAG.dy2} l ${SWITCH_ZIGZAG.step} ${SWITCH_ZIGZAG.rise}`}
            strokeWidth={GLYPH_THIN}
          />
        </g>
      );
    case "server":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH} fill="none">
          <rect
            x={x + GLYPH_FRAME.server.dx}
            y={y + GLYPH_FRAME.server.dy}
            width={GLYPH_FRAME.server.w}
            height={GLYPH_FRAME.server.h}
            rx={GLYPH_RX_SMALL}
          />
          <circle
            cx={x + GLYPH_FRAME.server.dotDx}
            cy={y - GLYPH_FRAME.server.dotDy}
            r={GLYPH_DOT_R}
            fill={c}
            stroke="none"
          />
          <circle
            cx={x + GLYPH_FRAME.server.dotDx}
            cy={y + GLYPH_FRAME.server.dotDy}
            r={GLYPH_DOT_R}
            fill={c}
            stroke="none"
          />
          <line
            x1={x + GLYPH_FRAME.server.slotX1}
            y1={y - GLYPH_FRAME.server.slotDy}
            x2={x + GLYPH_FRAME.server.slotX2}
            y2={y - GLYPH_FRAME.server.slotDy}
          />
          <line
            x1={x + GLYPH_FRAME.server.slotX1}
            y1={y + GLYPH_FRAME.server.slotDy}
            x2={x + GLYPH_FRAME.server.slotX2}
            y2={y + GLYPH_FRAME.server.slotDy}
          />
        </g>
      );
    case "host":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH} fill="none">
          <rect
            x={x - GLYPH_R}
            y={y + GLYPH_FRAME.host.dy}
            width={GLYPH_FRAME.host.w}
            height={GLYPH_FRAME.host.h}
            rx={GLYPH_RX_TINY}
          />
          <line
            x1={x}
            y1={y + GLYPH_FRAME.host.standTop}
            x2={x}
            y2={y + GLYPH_R}
          />
          <line
            x1={x - GLYPH_FRAME.host.standFoot}
            y1={y + GLYPH_R}
            x2={x + GLYPH_FRAME.host.standFoot}
            y2={y + GLYPH_R}
          />
        </g>
      );
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

/**
 * Topología de red SSR (roles con glifo + enlaces con estado).
 */
export function NetworkTopology({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  linkLegend = true,
  glyphSize = GLYPH_R,
  statusColors,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: NetworkTopologyProps) {
  if (isBlank(nodes)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, byId, edgeByKey, width, height, usedStatuses } =
    computeTopologyLayout(nodes, edges, direction);

  return (
    <div className={className} style={style}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          style={{ minWidth: width }}
          role="img"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        >
          <title>{ariaLabel}</title>
          <defs>
            <marker
              id="charts-topo-arrow"
              viewBox={`0 0 ${ARROW_MARKER.SIZE} ${ARROW_MARKER.SIZE}`}
              refX={ARROW_MARKER.REF_X}
              refY={ARROW_MARKER.REF_Y}
              markerWidth={ARROW_MARKER.WIDTH}
              markerHeight={ARROW_MARKER.HEIGHT}
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill={CHART_TOKEN.muted} />
            </marker>
          </defs>
          {layout.edges.map((e, i) => {
            const edge = edgeByKey.get(`${e.from}→${e.to}`);
            const status = edge?.status ?? "up";
            return (
              <path
                key={stableKey([e.from, e.to], i)}
                d={e.d}
                fill="none"
                stroke={statusColor(status, statusColors)}
                strokeWidth={status === "down" ? NODE_BORDER_WIDTH : EDGE_WIDTH}
                strokeDasharray={status === "down" ? DASH_DOWN : undefined}
                markerEnd="url(#charts-topo-arrow)"
              />
            );
          })}
          {[...layout.nodes.values()].map((p, i) => {
            const n = byId.get(p.id);
            if (!n) return null;
            const role = n.role ?? "server";
            const tip =
              `${n.label} (${role})` +
              (n.sub ? ` · ${n.sub}` : "") +
              ` · ${edges.filter((e) => e.from === p.id || e.to === p.id).length} enlaces`;
            return (
              <g key={stableKey([p.id], i)}>
                <title>{tip}</title>
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={NODE_RX_PROCESS}
                  fill={CHART_TOKEN.card}
                  stroke={roleColor(role)}
                  strokeWidth={EDGE_WIDTH}
                  data-chart-tip={tip}
                />
                {glyphSize === GLYPH_R ? (
                  <RoleGlyph role={role} x={p.x + GLYPH_X} y={p.cy} />
                ) : (
                  <g
                    transform={`translate(${p.x + GLYPH_X} ${p.cy}) scale(${glyphSize / GLYPH_R}) translate(${-(p.x + GLYPH_X)} ${-p.cy})`}
                  >
                    <RoleGlyph role={role} x={p.x + GLYPH_X} y={p.cy} />
                  </g>
                )}
                <text
                  x={p.x + LABEL_X}
                  y={p.cy + (n.sub ? LABEL_DY_WITH_SUB : LABEL_DY)}
                  fontSize={NODE_FONT_SIZE}
                  fontWeight={FONT_SEMIBOLD}
                  fill={CHART_TOKEN.foreground}
                >
                  {truncateLabel(n.label, 18)}
                </text>
                {n.sub ? (
                  <text
                    x={p.x + LABEL_X}
                    y={p.cy + SUB_DY}
                    fontSize={EDGE_LABEL_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {truncateLabel(n.sub, 22)}
                  </text>
                ) : null}
              </g>
            );
          })}
          {layout.edges.map((e, i) => {
            const edge = edgeByKey.get(`${e.from}→${e.to}`);
            return edge?.label ? (
              <EdgeLabel
                key={stableKey([e.from, e.to, edge.label], i)}
                mx={e.mx}
                my={e.my}
                text={edge.label}
              />
            ) : null;
          })}
        </svg>
      </div>
      {linkLegend ? (
        <ChartLegend
          items={usedStatuses.map((s) => ({
            label:
              s === "up"
                ? "Enlace activo"
                : s === "down"
                  ? "Caído"
                  : "Degradado",
            color: statusColor(s, statusColors),
          }))}
        />
      ) : null}
    </div>
  );
}
