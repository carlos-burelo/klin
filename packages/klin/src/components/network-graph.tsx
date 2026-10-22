/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { seriesColor } from "../core/color";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
  LABEL_GAP_PX,
  NETWORK_NODE_GROWTH,
  NETWORK_NODE_MAX_GROWTH,
  NETWORK_NODE_MIN_R,
  NETWORK_TICKS,
  NODE_BORDER_WIDTH,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  computeNetworkPositions,
  NETWORK_H,
  NETWORK_ISOLATED_OPACITY,
  NETWORK_W,
} from "./network-graph.compute";
import type { NetworkGraphProps } from "./network-graph.types";

export {
  computeNetworkPositions,
  MAX_NETWORK_LINKS,
  MAX_NETWORK_NODES,
} from "./network-graph.compute";
export type {
  NetworkEdge,
  NetworkGraphProps,
  NetworkNode,
  PositionedNetworkNode,
} from "./network-graph.types";

/**
 * Red SSR (simulación de fuerzas con semilla fija, 300 ticks en servidor).
 */
export function NetworkGraph({
  nodes,
  edges,
  ariaLabel,
  seed = 42,
  forces,
  nodeSize = "degree",
  showIsolated = true,
  showLabels = true,
  maxItems,
  ticks = NETWORK_TICKS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: NetworkGraphProps) {
  if (isBlank(nodes)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { positioned, renderedEdges, degree } = computeNetworkPositions(
    nodes,
    edges,
    seed,
    { forces, ticks, maxItems },
  );
  const visible = showIsolated
    ? positioned
    : positioned.filter((n) => (degree.get(n.id) ?? 0) > 0);
  const pos = new Map(positioned.map((n) => [n.id, n]));

  return (
    <svg
      viewBox={`0 0 ${NETWORK_W} ${NETWORK_H}`}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {renderedEdges.map((e, i) => {
        const a = pos.get(e.from);
        const b = pos.get(e.to);
        if (!a || !b) return null;
        return (
          <line
            key={stableKey([e.from, e.to], i)}
            x1={a.x ?? 0}
            y1={a.y ?? 0}
            x2={b.x ?? 0}
            y2={b.y ?? 0}
            stroke={CHART_TOKEN.border}
            strokeWidth={EDGE_WIDTH}
          />
        );
      })}
      {visible.map((n, i) => {
        const color = seriesColor(i, n.color);
        const deg = degree.get(n.id) ?? 0;
        const r =
          nodeSize === "degree"
            ? NETWORK_NODE_MIN_R +
              Math.min(NETWORK_NODE_MAX_GROWTH, deg * NETWORK_NODE_GROWTH)
            : NETWORK_NODE_MIN_R;
        const label = n.label ?? n.id;
        const tip = `${label} (${deg} conexiones)`;
        return (
          <g key={stableKey([n.id], i)}>
            <circle
              cx={n.x ?? 0}
              cy={n.y ?? 0}
              r={r}
              fill={color}
              stroke={CHART_TOKEN.background}
              strokeWidth={NODE_BORDER_WIDTH}
              opacity={
                showIsolated && deg === 0 ? NETWORK_ISOLATED_OPACITY : undefined
              }
              data-chart-tip={tip}
            />
            {showLabels ? (
              <text
                x={(n.x ?? 0) + r + LABEL_GAP_PX}
                y={(n.y ?? 0) + LABEL_GAP_PX}
                fontSize={TICK_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(label, 16)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
