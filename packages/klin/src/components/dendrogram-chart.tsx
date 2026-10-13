/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { cluster, type HierarchyPointNode, hierarchy } from "d3-hierarchy";
import type { CSSProperties } from "react";
import { CHART_W, ChartSvg } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_NODES } from "../lib/limits";
import { toNumber } from "../lib/number";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  EDGE_WIDTH,
  LABEL_GAP_PX,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type DendrogramNode = {
  label: string;
  value?: number;
  color?: string;
  children?: DendrogramNode[];
};

export type DendrogramOrientation = "vertical" | "horizontal";

/** Props del dendrograma. */
export type DendrogramChartProps = {
  root: DendrogramNode;
  ariaLabel: string;
  orientation?: DendrogramOrientation;
  height?: number;
  /** Profundidad máxima visible (por defecto sin límite). */
  depth?: number;
  /** Muestra las etiquetas de cada nodo. */
  showLabels?: boolean;
  /** Agrega el conteo de descendientes a la etiqueta de cada rama. */
  showCounts?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/** Cap de nodos (alias de DEFAULT_MAX_NODES, compat). */
export const MAX_DENDROGRAM_NODES = DEFAULT_MAX_NODES;

const DENDRO_H = 400;
const DENDRO_MARGIN = { top: 16, right: 120, bottom: 16, left: 16 } as const;
const LABEL_MAX_CHARS = 18;
const NODE_LABEL_DY = 4;
/** Profundidad visible por defecto (sin límite). */
const DENDRO_DEPTH_DEFAULT = Number.POSITIVE_INFINITY;

export type DendrogramPoint = HierarchyPointNode<DendrogramNode>;
export type DendrogramLink = {
  source: DendrogramPoint;
  target: DendrogramPoint;
};

/**
 * Cómputo puro del layout dendrograma (cluster + posiciones y codos).
 * Trunca a los N primeros nodos (recorrido en anchura) para SSR.
 */
export function computeDendrogramLayout(
  root: DendrogramNode,
  width: number,
  height: number,
  orientation: DendrogramOrientation = "vertical",
): { nodes: DendrogramPoint[]; links: DendrogramLink[] } {
  const innerW = Math.max(1, width - DENDRO_MARGIN.left - DENDRO_MARGIN.right);
  const innerH = Math.max(1, height - DENDRO_MARGIN.top - DENDRO_MARGIN.bottom);
  const size: [number, number] =
    orientation === "vertical" ? [innerW, innerH] : [innerH, innerW];
  const laid = cluster<DendrogramNode>().size(size)(
    hierarchy<DendrogramNode>(root).sort((a, b) =>
      a.data.label.localeCompare(b.data.label),
    ),
  );
  const nodes = laid.descendants().slice(0, MAX_DENDROGRAM_NODES);
  const visible = new Set(nodes);
  const links = laid
    .links()
    .filter((l) => visible.has(l.source) && visible.has(l.target));
  return { nodes, links };
}

function chainOf(node: DendrogramPoint): string[] {
  return node
    .ancestors()
    .reverse()
    .map((a) => a.data.label);
}

/**
 * Dendrograma SSR (jerarquía estructural con `d3.cluster` y enlaces en codo).
 */
export function DendrogramChart({
  root,
  ariaLabel,
  orientation = "vertical",
  height = DENDRO_H,
  depth = DENDRO_DEPTH_DEFAULT,
  showLabels = true,
  showCounts = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: DendrogramChartProps) {
  if (!root || root.label === "") {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const laid = computeDendrogramLayout(root, CHART_W, height, orientation);
  const maxDepth = toNumber(depth, DENDRO_DEPTH_DEFAULT);
  const nodes = laid.nodes.filter((n) => n.depth <= maxDepth);
  const visible = new Set(nodes);
  const links = laid.links.filter(
    (l) => visible.has(l.source) && visible.has(l.target),
  );
  if (nodes.filter((n) => n.depth > 0).length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const px = (n: DendrogramPoint): number =>
    orientation === "vertical"
      ? DENDRO_MARGIN.left + (n.x ?? 0)
      : DENDRO_MARGIN.left + (n.y ?? 0);
  const py = (n: DendrogramPoint): number =>
    orientation === "vertical"
      ? DENDRO_MARGIN.top + (n.y ?? 0)
      : DENDRO_MARGIN.top + (n.x ?? 0);

  return (
    <ChartSvg
      width={CHART_W}
      height={height}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      className={className ? `h-auto w-full ${className}` : undefined}
      style={style}
    >
      {links.map((l, i) => {
        const x1 = px(l.source);
        const y1 = py(l.source);
        const x2 = px(l.target);
        const y2 = py(l.target);
        const d =
          orientation === "vertical"
            ? `M ${x1} ${y1} V ${(y1 + y2) / 2} H ${x2} V ${y2}`
            : `M ${x1} ${y1} H ${(x1 + x2) / 2} V ${y2} H ${x2}`;
        return (
          <path
            key={stableKey([l.source.data.label, l.target.data.label], i)}
            d={d}
            fill="none"
            stroke={CHART_TOKEN.muted}
            strokeWidth={EDGE_WIDTH}
          />
        );
      })}
      {nodes.map((n, i) => {
        const cx = px(n);
        const cy = py(n);
        const color = seriesColor(n.depth, n.data.color);
        const tip = chainOf(n).join(" > ");
        const kids = n.descendants().length - 1;
        const tag =
          showCounts && kids > 0
            ? `${truncateLabel(n.data.label, LABEL_MAX_CHARS)} (${kids})`
            : truncateLabel(n.data.label, LABEL_MAX_CHARS);
        return (
          <g key={stableKey([...chainOf(n), n.depth], i)}>
            <title>{tip}</title>
            <circle
              cx={cx}
              cy={cy}
              r={POINT_RADIUS}
              fill={color}
              stroke={CHART_TOKEN.background}
              strokeWidth={POINT_BORDER}
              data-chart-tip={tip}
            />
            {showLabels ? (
              <text
                x={cx + POINT_RADIUS + LABEL_GAP_PX}
                y={cy}
                dy={NODE_LABEL_DY}
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.foreground}
              >
                {tag}
              </text>
            ) : null}
          </g>
        );
      })}
    </ChartSvg>
  );
}
