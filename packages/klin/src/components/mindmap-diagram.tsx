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
  FONT_MEDIUM,
  FONT_SEMIBOLD,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  computeMindmapLayout,
  LABEL_DY,
  labelsUp,
  NODE_H,
  NODE_RX,
  NODE_W,
} from "./mindmap-diagram.compute";
import type { MindmapDiagramProps } from "./mindmap-diagram.types";

export type { MindmapCapOptions } from "./mindmap-diagram.compute";
export {
  capMindmapTree,
  computeMindmapLayout,
  MAX_MINDMAP_DEPTH,
  MAX_MINDMAP_NODES,
} from "./mindmap-diagram.compute";
export type {
  MindmapDiagramProps,
  MindNode,
} from "./mindmap-diagram.types";

/**
 * Mapa mental SSR (árbol horizontal con ramas de color).
 */
export function MindmapDiagram({
  root,
  ariaLabel,
  depthColors,
  nodeWidth = NODE_W,
  showLegend = true,
  collapseDepth,
  maxItems,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: MindmapDiagramProps) {
  if (!root.label && isBlank(root.children)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { nodes, links, W, H, ox, oy, branches, branchIndex } =
    computeMindmapLayout(root, nodeWidth, { collapseDepth, maxItems });

  /** Color de profundidad cuando `depthColors` lo define (resto = rama). */
  const depthColorFor = (depth: number): string | undefined =>
    depthColors && depthColors.length > 0
      ? depthColors[depth % depthColors.length]
      : undefined;

  /** Color de la rama (rama raíz del nodo; raíz = primary). */
  const branchColorFor = (
    node: { depth: number; data: { label: string } },
    ancestorLabels: string[],
  ): string => {
    if (node.depth === 0) return CHART_TOKEN.primary;
    const branchLabel =
      ancestorLabels.length <= 1 ? node.data.label : (ancestorLabels[1] ?? "");
    return seriesColor(
      Math.max(0, branchIndex.get(branchLabel) ?? 0),
      undefined,
    );
  };

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto"
        style={{ minWidth: Math.min(W, DIAGRAM_MIN_SCROLL) }}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {links.map((l, i) => {
          const x1 = (l.source.y ?? 0) + ox + nodeWidth / 2;
          const y1 = (l.source.x ?? 0) + oy;
          const x2 = (l.target.y ?? 0) + ox - nodeWidth / 2;
          const y2 = (l.target.x ?? 0) + oy;
          const mx = (x1 + x2) / 2;
          return (
            <path
              key={stableKey([l.source.data.label, l.target.data.label], i)}
              d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke={
                depthColorFor(l.target.depth) ??
                branchColorFor(l.target, labelsUp(l.target))
              }
              strokeWidth={EDGE_WIDTH}
            />
          );
        })}
        {nodes.map((n, i) => {
          const ancestors = labelsUp(n);
          const isRoot = n.depth === 0;
          const branch = isRoot
            ? (n.data.color ?? CHART_TOKEN.primary)
            : branchColorFor(n, ancestors);
          const color = n.data.color ?? depthColorFor(n.depth) ?? branch;
          const tip = [...ancestors, n.data.label].join(" › ");
          const cx = (n.y ?? 0) + ox;
          const cy = (n.x ?? 0) + oy;
          return (
            <g key={stableKey([n.data.label], i)}>
              <rect
                x={cx - nodeWidth / 2}
                y={cy - NODE_H / 2}
                width={nodeWidth}
                height={NODE_H}
                rx={isRoot ? NODE_H / 2 : NODE_RX}
                fill={isRoot ? color : CHART_TOKEN.card}
                stroke={isRoot ? "none" : color}
                strokeWidth={EDGE_WIDTH}
                data-chart-tip={tip}
              />
              <text
                x={cx}
                y={cy}
                dy={LABEL_DY}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fontWeight={isRoot ? FONT_SEMIBOLD : FONT_MEDIUM}
                fill={
                  isRoot
                    ? CHART_TOKEN.primaryForeground
                    : CHART_TOKEN.foreground
                }
              >
                {truncateLabel(n.data.label, 20)}
              </text>
            </g>
          );
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={branches.map((b, i) => ({
            label: b,
            color: depthColorFor(1) ?? seriesColor(i, undefined),
          }))}
        />
      ) : null}
    </div>
  );
}
