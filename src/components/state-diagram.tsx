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
  EDGE_WIDTH,
  FONT_SEMIBOLD,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type StateNode = {
  id: string;
  label: string;
  kind?: "state" | "initial" | "final";
};

export type StateEdge = {
  from: string;
  to: string;
  /** Evento que dispara la transición. */
  label?: string;
};

const NODE_FONT_SIZE = 12;
const NODE_RX_STATE = 12;
const NODE_FIT = { min: 150, max: 230, size: 12, pad: 36 } as const;
const LAYOUT = {
  NODE_H: 52,
  GAP_X: 56,
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
const DOT = 28;
const FINAL_RING_PAD = 4;
const LABEL_DY = 4;

/** Props del diagrama de estados. */
export type StateDiagramProps = {
  nodes: StateNode[];
  edges: StateEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/**
 * Cómputo puro del layout de estados (ancho auto + DAG con cap SSR).
 */
export function computeStateLayout(
  nodes: StateNode[],
  edges: StateEdge[],
  direction: "TB" | "LR" = "LR",
): {
  layout: DagLayout;
  byId: Map<string, StateNode>;
  width: number;
  height: number;
} {
  const W = fitNodeWidth(
    nodes.map((n) => n.label),
    {
      min: NODE_FIT.min,
      max: NODE_FIT.max,
      size: NODE_FIT.size,
      pad: NODE_FIT.pad,
    },
  );
  const H = LAYOUT.NODE_H;
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
 * Máquina de estados SSR (inicial, estados, final, transiciones con evento).
 */
export function StateDiagram({
  nodes,
  edges,
  ariaLabel,
  direction = "LR",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: StateDiagramProps) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, byId, width, height } = computeStateLayout(
    nodes,
    edges,
    direction,
  );
  const edgeByKey = new Map(
    edges.map((e) => [`${e.from}→${e.to}`, e] as const),
  );

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
            id="charts-state-arrow"
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
            markerEnd="url(#charts-state-arrow)"
          />
        ))}
        {[...layout.nodes.values()].map((p, i) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const kind = n.kind ?? "state";
          if (kind === "initial") {
            return (
              <g key={stableKey([p.id], i)}>
                <title>Inicial</title>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={DOT / 2}
                  fill={CHART_TOKEN.foreground}
                />
              </g>
            );
          }
          if (kind === "final") {
            return (
              <g key={stableKey([p.id], i)}>
                <title>{n.label || "Final"}</title>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={DOT / 2 + FINAL_RING_PAD}
                  fill="none"
                  stroke={CHART_TOKEN.foreground}
                  strokeWidth={EDGE_WIDTH}
                />
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={DOT / 2}
                  fill={CHART_TOKEN.foreground}
                />
              </g>
            );
          }
          const tip = n.label;
          return (
            <g key={stableKey([p.id], i)}>
              <title>{tip}</title>
              <rect
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                rx={NODE_RX_STATE}
                fill={CHART_TOKEN.card}
                stroke={CHART_TOKEN.border}
                strokeWidth={EDGE_WIDTH}
                data-chart-tip={tip}
              />
              <text
                x={p.cx}
                y={p.cy}
                dy={LABEL_DY}
                textAnchor="middle"
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(n.label, 20)}
              </text>
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
