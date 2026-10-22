/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import { CHART_TOKEN, EDGE_WIDTH, FONT_SEMIBOLD } from "../core/theme";
import { EdgeLabel } from "../render/edge-label";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { markerUrl, SvgMarkers } from "../render/markers";
import {
  computeStateLayout,
  DOT,
  FINAL_RING_PAD,
  LABEL_DY,
  NODE_FONT_SIZE,
  NODE_RX_STATE,
  STATE_PSEUDO_INITIAL_ID,
} from "./state-diagram.compute";
import type { StateDiagramProps, StateNode } from "./state-diagram.types";

export { computeStateLayout } from "./state-diagram.compute";
export type {
  StateDiagramProps,
  StateEdge,
  StateNode,
} from "./state-diagram.types";

/**
 * Máquina de estados SSR (inicial, estados, final, transiciones con evento).
 */
export function StateDiagram({
  nodes,
  edges,
  ariaLabel,
  direction = "LR",
  showInitial = true,
  showLegend = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: StateDiagramProps) {
  if (isBlank(nodes)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const effective =
    showInitial &&
    !nodes.some(
      (n) =>
        (n.kind ?? "state") === "initial" || n.id === STATE_PSEUDO_INITIAL_ID,
    )
      ? [
          {
            id: STATE_PSEUDO_INITIAL_ID,
            label: "",
            kind: "initial",
          } as StateNode,
          ...nodes,
        ]
      : nodes;

  const { layout, byId, width, height } = computeStateLayout(
    effective,
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
        <SvgMarkers prefix="charts-state" kinds={["arrow"]} />
        {layout.edges.map((e, i) => (
          <path
            key={stableKey([e.from, e.to], i)}
            d={e.d}
            fill="none"
            stroke={CHART_TOKEN.muted}
            strokeWidth={EDGE_WIDTH}
            markerEnd={markerUrl("charts-state", "arrow")}
          />
        ))}
        {[...layout.nodes.values()].map((p, i) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const kind = n.kind ?? "state";
          if (kind === "initial") {
            return (
              <g key={stableKey([p.id], i)} data-chart-tip="Inicial">
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
              <g key={stableKey([p.id], i)} data-chart-tip={n.label || "Final"}>
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
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Inicial", color: CHART_TOKEN.foreground },
            { label: "Final", color: CHART_TOKEN.foreground },
            { label: "Estado", color: CHART_TOKEN.card },
          ]}
        />
      ) : null}
    </div>
  );
}
