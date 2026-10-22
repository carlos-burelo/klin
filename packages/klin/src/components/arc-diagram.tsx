/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { seriesColor } from "../core/color";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  EDGE_WIDTH,
  NODE_BORDER_WIDTH,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  ARC_JITTER,
  ARC_MIN_H,
  ARC_OPACITY,
  ARC_SPREAD,
  ARC_W,
  BASE_Y,
  computeArcLayout,
  LABEL_DY,
  MAX_GROWTH,
  R,
} from "./arc-diagram.compute";
import type { ArcDiagramProps } from "./arc-diagram.types";

export {
  computeArcLayout,
  MAX_ARC_LINKS,
  MAX_ARC_NODES,
} from "./arc-diagram.compute";
export type {
  ArcDiagramProps,
  ArcEdge,
  ArcNode,
} from "./arc-diagram.types";

/**
 * Diagrama de arcos SSR (relaciones sobre un eje de nodos).
 */
export function ArcDiagram({
  nodes,
  edges,
  ariaLabel,
  nodeSize = "degree",
  sortBy = "degree",
  showLabels = "all",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: ArcDiagramProps) {
  if (isBlank(nodes)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { cappedNodes, clean, step, ox, H, degree, order } = computeArcLayout(
    nodes,
    edges,
    sortBy,
  );
  const xOf = (id: string) => ox + (order.get(id) ?? 0) * step;

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <svg
        viewBox={`0 0 ${ARC_W} ${H}`}
        className="h-auto"
        style={{ minWidth: Math.min(ARC_W, DIAGRAM_MIN_SCROLL) }}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {clean.map((e, i) => {
          const a = xOf(e.from);
          const b = xOf(e.to);
          const left = Math.min(a, b);
          const right = Math.max(a, b);
          const h = ARC_MIN_H + ((i * ARC_JITTER) % ARC_SPREAD);
          const tip = e.label
            ? `${e.from} ↔ ${e.to}: ${e.label}`
            : `${e.from} ↔ ${e.to}`;
          return (
            <g key={stableKey([e.from, e.to], i)}>
              <path
                d={`M ${left} ${BASE_Y} C ${left} ${BASE_Y - h}, ${right} ${BASE_Y - h}, ${right} ${BASE_Y}`}
                fill="none"
                stroke={CHART_TOKEN.accent}
                strokeWidth={EDGE_WIDTH}
                strokeOpacity={ARC_OPACITY}
                data-chart-tip={tip}
              />
            </g>
          );
        })}
        {cappedNodes.map((n, i) => {
          const deg = degree.get(n.id) ?? 0;
          const color = seriesColor(i, n.color);
          const tip = `${n.label} (${deg} relaciones)`;
          const showLabel =
            showLabels === "all" ||
            (showLabels === "ends" &&
              (i === 0 || i === cappedNodes.length - 1));
          return (
            <g key={stableKey([n.id], i)}>
              <circle
                cx={xOf(n.id)}
                cy={BASE_Y}
                r={nodeSize === "degree" ? R + Math.min(MAX_GROWTH, deg) : R}
                fill={color}
                stroke={CHART_TOKEN.background}
                strokeWidth={NODE_BORDER_WIDTH}
                data-chart-tip={tip}
              />
              {showLabel ? (
                <text
                  x={xOf(n.id)}
                  y={BASE_Y + LABEL_DY}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(n.label, 14)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
