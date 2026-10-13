/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import type { CSSProperties } from "react";
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
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type ArchNode = {
  id: string;
  label: string;
  sub?: string;
  kind?: "service" | "database" | "queue" | "actor" | "external";
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
};

const NODE_FONT_SIZE = 12;
const NODE_RX_PROCESS = 8;
const NODE_FIT = { min: 150, max: 230, size: 12, pad: 40 } as const;
const LAYOUT = {
  NODE_H: 60,
  GAP_X: 48,
  GAP_Y: 68,
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
const DB_CAP_RY = 10;
const DB_CAP_DY = 10;
const DB_BOTTOM_PAD = 4;
const ACTOR_AVATAR_X = 22;
const ACTOR_AVATAR_R = 8;
const ACTOR_TEXT_X = 40;
const LABEL_DY = 4;
const LABEL_DY_WITH_SUB = -3;
const SUB_DY = 12;
const DASH_EXTERNAL = "5 4";
/** Alto de nodo en modo compacto (mapas grandes). */
const ARCH_NODE_H_COMPACT = 40;
/** Insignia de tipo: desplazamiento desde la esquina superior derecha. */
const ARCH_BADGE_PAD_X = 8;
const ARCH_BADGE_DY = 14;
/** Etiqueta corta de la insignia por tipo de nodo. */
const ARCH_KIND_BADGE = {
  service: "servicio",
  database: "base",
  queue: "cola",
  actor: "actor",
  external: "externo",
} as const;

/** Props del diagrama de arquitectura. */
export type ArchitectureDiagramProps = {
  nodes: ArchNode[];
  edges: ArchEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Sobrescribe el color de trazo por tipo de nodo. */
  statusColors?: Partial<Record<Exclude<ArchNode["kind"], undefined>, string>>;
  /** Muestra la insignia con el tipo de cada nodo. */
  showBadges?: boolean;
  /** Reduce la altura de nodo para mapas grandes. */
  compact?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/**
 * Cómputo puro del layout de arquitectura (ancho auto + DAG con cap SSR).
 */
export function computeArchitectureLayout(
  nodes: ArchNode[],
  edges: ArchEdge[],
  direction: "TB" | "LR" = "TB",
  compact = false,
): {
  layout: DagLayout;
  byId: Map<string, ArchNode>;
  width: number;
  height: number;
} {
  const W = fitNodeWidth(
    nodes.flatMap((n) => (n.sub ? [n.label, n.sub] : [n.label])),
    {
      min: NODE_FIT.min,
      max: NODE_FIT.max,
      size: NODE_FIT.size,
      pad: NODE_FIT.pad,
    },
  );
  const H = compact ? ARCH_NODE_H_COMPACT : LAYOUT.NODE_H;
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
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height),
  };
}

/**
 * Arquitectura SSR (servicios, bases, colas, actores, externos).
 */
export function ArchitectureDiagram({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  statusColors,
  showBadges = true,
  compact = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: ArchitectureDiagramProps) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, byId, width, height } = computeArchitectureLayout(
    nodes,
    edges,
    direction,
    compact,
  );
  const edgeByKey = new Map(
    edges.map((e) => [`${e.from}→${e.to}`, e] as const),
  );

  const strokeFor = (kind: ArchNode["kind"]) =>
    (kind && statusColors?.[kind]) ??
    (kind === "external"
      ? CHART_TOKEN.muted
      : kind === "database"
        ? CHART_TOKEN.chart3
        : kind === "queue"
          ? CHART_TOKEN.chart4
          : CHART_TOKEN.chart1);

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
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
            id="charts-arch-arrow"
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
        {layout.edges.map((e, i) => (
          <path
            key={stableKey([e.from, e.to], i)}
            d={e.d}
            fill="none"
            stroke={CHART_TOKEN.muted}
            strokeWidth={EDGE_WIDTH}
            markerEnd="url(#charts-arch-arrow)"
          />
        ))}
        {[...layout.nodes.values()].map((p, i) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const kind = n.kind ?? "service";
          const tip = n.sub ? `${n.label} · ${n.sub}` : n.label;
          const stroke = strokeFor(kind);
          const dashed = kind === "external" ? DASH_EXTERNAL : undefined;
          return (
            <g key={stableKey([p.id], i)}>
              <title>{tip}</title>
              {kind === "database" ? (
                <g data-chart-tip={tip}>
                  <path
                    d={`M ${p.x} ${p.y + DB_CAP_DY} A ${p.w / 2} ${DB_CAP_RY} 0 0 1 ${p.x + p.w} ${p.y + DB_CAP_DY} L ${p.x + p.w} ${p.y + p.h - DB_BOTTOM_PAD} A ${p.w / 2} ${DB_CAP_RY} 0 0 1 ${p.x} ${p.y + p.h - DB_BOTTOM_PAD} Z`}
                    fill={CHART_TOKEN.card}
                    stroke={stroke}
                    strokeWidth={EDGE_WIDTH}
                  />
                  <ellipse
                    cx={p.cx}
                    cy={p.y + DB_CAP_DY}
                    rx={p.w / 2}
                    ry={DB_CAP_RY}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={EDGE_WIDTH}
                  />
                </g>
              ) : kind === "actor" ? (
                <g data-chart-tip={tip}>
                  <rect
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height={p.h}
                    rx={p.h / 2}
                    fill={CHART_TOKEN.card}
                    stroke={stroke}
                    strokeWidth={EDGE_WIDTH}
                    strokeDasharray={dashed}
                  />
                  <circle
                    cx={p.x + ACTOR_AVATAR_X}
                    cy={p.cy}
                    r={ACTOR_AVATAR_R}
                    fill={stroke}
                  />
                </g>
              ) : (
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={NODE_RX_PROCESS}
                  fill={CHART_TOKEN.card}
                  stroke={stroke}
                  strokeWidth={EDGE_WIDTH}
                  strokeDasharray={dashed}
                  data-chart-tip={tip}
                />
              )}
              <text
                x={kind === "actor" ? p.x + ACTOR_TEXT_X : p.cx}
                y={p.cy + (n.sub ? LABEL_DY_WITH_SUB : LABEL_DY)}
                textAnchor={kind === "actor" ? "start" : "middle"}
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(n.label, kind === "actor" ? 16 : 20)}
              </text>
              {n.sub ? (
                <text
                  x={kind === "actor" ? p.x + ACTOR_TEXT_X : p.cx}
                  y={p.cy + SUB_DY}
                  textAnchor={kind === "actor" ? "start" : "middle"}
                  fontSize={EDGE_LABEL_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(n.sub, kind === "actor" ? 18 : 24)}
                </text>
              ) : null}
              {showBadges ? (
                <text
                  x={p.x + p.w - ARCH_BADGE_PAD_X}
                  y={p.y + ARCH_BADGE_DY}
                  textAnchor="end"
                  fontSize={EDGE_LABEL_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {ARCH_KIND_BADGE[kind]}
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
  );
}
