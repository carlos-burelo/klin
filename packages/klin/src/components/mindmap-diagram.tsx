/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { hierarchy, tree } from "d3-hierarchy";
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

export type MindNode = {
  label: string;
  /** Color propio (token); por defecto, color de la rama. */
  color?: string;
  children?: MindNode[];
};

/** Props del mapa mental. */
export type MindmapDiagramProps = {
  root: MindNode;
  ariaLabel: string;
  /** Color por profundidad (índice = `depth`); por defecto, color de rama. */
  depthColors?: string[];
  /** Ancho de cada caja de nodo. */
  nodeWidth?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const NODE_W = 150;
const NODE_H = 32;
const DEPTH_X = 190;
const LEAF_GAP = 44;
const VIEW_PAD_X = 48;
const VIEW_PAD_Y = 32;
const ORIGIN_PAD_X = 24;
const ORIGIN_PAD_Y = 16;
const NODE_RX = 8;
const FONT_MEDIUM = 500;
const LABEL_DY = 4;

export const MAX_MINDMAP_DEPTH = 6;
export const MAX_MINDMAP_NODES = 300;

/** Vista mínima estructural de un nodo jerárquico (compatible con d3-hierarchy). */
type Climb = {
  data: { label: string; color?: string };
  parent?: Climb | null;
};

/** Etiquetas de los ancestros (raíz primero). */
function labelsUp(node: Climb): string[] {
  const out: string[] = [];
  let cur = node.parent;
  while (cur) {
    out.unshift(cur.data.label);
    cur = cur.parent;
  }
  return out;
}

/**
 * Trunca determinista: poda a profundidad 6 y a 300 nodos (corta
 * children en exceso, primeros N). Pura y testable.
 */
export function capMindmapTree(root: MindNode): MindNode {
  let count = 0;
  const clone = (node: MindNode, depth: number): MindNode => {
    count += 1;
    if (depth >= MAX_MINDMAP_DEPTH)
      return node.color
        ? { label: node.label, color: node.color }
        : { label: node.label };
    const kids = node.children ?? [];
    const out: MindNode[] = [];
    for (const k of kids) {
      if (count >= MAX_MINDMAP_NODES) break;
      out.push(clone(k, depth + 1));
    }
    const base: MindNode = node.color
      ? { label: node.label, color: node.color }
      : { label: node.label };
    return out.length > 0 ? { ...base, children: out } : base;
  };
  return clone(root, 0);
}

/**
 * Cómputo puro del layout mindmap (árbol horizontal + viewport).
 */
export function computeMindmapLayout(
  root: MindNode,
  nodeWidth: number = NODE_W,
) {
  const capped = capMindmapTree(root);
  const laid = tree<MindNode>().nodeSize([LEAF_GAP, DEPTH_X])(
    hierarchy<MindNode>(capped),
  );
  const nodes = laid.descendants();
  const links = laid.links();

  const xs = nodes.map((n) => n.y);
  const ys = nodes.map((n) => n.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const W = maxX - minX + nodeWidth + VIEW_PAD_X;
  const H = maxY - minY + NODE_H + VIEW_PAD_Y;
  const ox = nodeWidth / 2 + ORIGIN_PAD_X - minX;
  const oy = NODE_H / 2 + ORIGIN_PAD_Y - minY;
  const branches = (capped.children ?? []).map((c) => c.label);
  const branchIndex = new Map(branches.map((b, i) => [b, i]));

  return { nodes, links, W, H, ox, oy, branches, branchIndex, capped };
}

/**
 * Mapa mental SSR (árbol horizontal con ramas de color).
 */
export function MindmapDiagram({
  root,
  ariaLabel,
  depthColors,
  nodeWidth = NODE_W,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: MindmapDiagramProps) {
  if (!root.label && (root.children ?? []).length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { nodes, links, W, H, ox, oy, branches, branchIndex } =
    computeMindmapLayout(root, nodeWidth);

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
        <title>{ariaLabel}</title>
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
              <title>{tip}</title>
              <rect
                x={cx - nodeWidth / 2}
                y={cy - NODE_H / 2}
                width={nodeWidth}
                height={NODE_H}
                rx={isRoot ? NODE_H / 2 : NODE_RX}
                fill={isRoot ? color : CHART_TOKEN.card}
                stroke={isRoot ? "transparent" : color}
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
      <ChartLegend
        items={branches.map((b, i) => ({
          label: b,
          color: depthColorFor(1) ?? seriesColor(i, undefined),
        }))}
      />
    </div>
  );
}
