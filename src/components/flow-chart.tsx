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

export type FlowNode = {
  id: string;
  label: string;
  sub?: string;
  kind?: "start" | "end" | "process" | "decision";
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
};

const NODE_FONT_SIZE = 12;
const NODE_RX_PROCESS = 8;
const NODE_FIT = { min: 150, max: 230, size: 12, pad: 36 } as const;
const LAYOUT = {
  NODE_H: 56,
  GAP_X: 44,
  GAP_Y: 64,
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
const LABEL_DY = 4;
const LABEL_DY_WITH_SUB = -3;
const SUB_DY = 12;
const SUB_OPACITY = 0.85;

/** Props del diagrama de flujo. */
export type FlowChartProps = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/**
 * Cómputo puro del layout de flujo (ancho auto + DAG con cap SSR).
 */
export function computeFlowLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction: "TB" | "LR" = "TB",
): {
  layout: DagLayout;
  byId: Map<string, FlowNode>;
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
 * Flujo SSR (procesos y decisiones). Layout en capas top-down o left-right.
 */
export function FlowChart({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: FlowChartProps) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, byId, width, height } = computeFlowLayout(
    nodes,
    edges,
    direction,
  );
  const edgeByKey = new Map(
    edges.map((e) => [`${e.from}→${e.to}`, e] as const),
  );

  const fillFor = (kind: FlowNode["kind"]) =>
    kind === "start"
      ? CHART_TOKEN.primary
      : kind === "end"
        ? CHART_TOKEN.track
        : CHART_TOKEN.card;

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
            id="charts-flow-arrow"
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
          <g key={stableKey([e.from, e.to], i)}>
            <path
              d={e.d}
              fill="none"
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
              markerEnd="url(#charts-flow-arrow)"
            />
          </g>
        ))}
        {[...layout.nodes.values()].map((p, i) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const kind = n.kind ?? "process";
          const tip = n.sub ? `${n.label} · ${n.sub}` : n.label;
          const fg =
            kind === "start"
              ? CHART_TOKEN.primaryForeground
              : CHART_TOKEN.foreground;
          return (
            <g key={stableKey([p.id], i)}>
              <title>{tip}</title>
              {kind === "decision" ? (
                <polygon
                  points={`${p.cx},${p.y} ${p.x + p.w},${p.cy} ${p.cx},${p.y + p.h} ${p.x},${p.cy}`}
                  fill={fillFor(kind)}
                  stroke={CHART_TOKEN.accent}
                  strokeWidth={EDGE_WIDTH}
                  data-chart-tip={tip}
                />
              ) : (
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={
                    kind === "start" || kind === "end"
                      ? p.h / 2
                      : NODE_RX_PROCESS
                  }
                  fill={fillFor(kind)}
                  stroke={
                    kind === "start" || kind === "end"
                      ? "transparent"
                      : CHART_TOKEN.border
                  }
                  strokeWidth={EDGE_WIDTH}
                  data-chart-tip={tip}
                />
              )}
              <text
                x={p.cx}
                y={p.cy + (n.sub ? LABEL_DY_WITH_SUB : LABEL_DY)}
                textAnchor="middle"
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={fg}
              >
                {truncateLabel(n.label, 20)}
              </text>
              {n.sub ? (
                <text
                  x={p.cx}
                  y={p.cy + SUB_DY}
                  textAnchor="middle"
                  fontSize={EDGE_LABEL_FONT_SIZE}
                  fill={kind === "start" ? fg : CHART_TOKEN.muted}
                  opacity={kind === "start" ? SUB_OPACITY : 1}
                >
                  {truncateLabel(n.sub, 24)}
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
