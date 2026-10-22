/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  EDGE_LABEL_FONT_SIZE,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
} from "../core/theme";
import { EdgeLabel } from "../render/edge-label";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { markerUrl, SvgMarkers } from "../render/markers";
import {
  computeFlowLayout,
  LABEL_DY,
  LABEL_DY_WITH_SUB,
  LAYOUT,
  NODE_FONT_SIZE,
  NODE_RX_PROCESS,
  SUB_DY,
  SUB_OPACITY,
} from "./flow-chart.compute";
import type { FlowChartProps, FlowNode } from "./flow-chart.types";

export { computeFlowLayout } from "./flow-chart.compute";
export type {
  FlowChartProps,
  FlowEdge,
  FlowNode,
} from "./flow-chart.types";

/**
 * Flujo SSR (procesos y decisiones). Layout en capas top-down o left-right.
 */
export function FlowChart({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  showLegend = false,
  showEdgeLabels = true,
  showSub = true,
  statusColors,
  maxItems = LAYOUT.MAX_NODES,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: FlowChartProps) {
  if (isBlank(nodes)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, byId, width, height } = computeFlowLayout(
    nodes,
    edges,
    direction,
    maxItems,
  );
  const edgeByKey = new Map(
    edges.map((e) => [`${e.from}→${e.to}`, e] as const),
  );

  const fillFor = (kind: FlowNode["kind"]) => {
    const override = kind && statusColors?.[kind];
    if (override) return override;
    return kind === "start"
      ? CHART_TOKEN.primary
      : kind === "end"
        ? CHART_TOKEN.track
        : CHART_TOKEN.card;
  };

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
        <SvgMarkers prefix="charts-flow" kinds={["arrow"]} />
        {layout.edges.map((e, i) => (
          <g key={stableKey([e.from, e.to], i)}>
            <path
              d={e.d}
              fill="none"
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
              markerEnd={markerUrl("charts-flow", "arrow")}
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
                      ? "none"
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
              {n.sub && showSub ? (
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
          return showEdgeLabels && edge?.label ? (
            <EdgeLabel
              key={stableKey([e.from, e.to, edge.label], i)}
              mx={e.mx}
              my={e.my}
              text={edge.label}
            />
          ) : null;
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={(["start", "end", "process", "decision"] as const).map(
            (k) => ({
              label:
                k === "start"
                  ? "Inicio"
                  : k === "end"
                    ? "Fin"
                    : k === "process"
                      ? "Proceso"
                      : "Decisión",
              color: fillFor(k),
            }),
          )}
        />
      ) : null}
    </div>
  );
}
