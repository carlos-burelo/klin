import { hierarchy, tree } from "d3-hierarchy";
import { seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type MindNode = {
  label: string;
  children?: MindNode[];
};

const NODE_W = 150;
const NODE_H = 32;
const DEPTH_X = 190;
const LEAF_GAP = 44;

type Climb = {
  data: MindNode;
  parent: Climb | null;
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
 * Mapa mental SSR (árbol horizontal con ramas de color).
 */
export function MindmapDiagram({
  root,
  ariaLabel,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  root: MindNode;
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (!root.label && (root.children ?? []).length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const laid = tree<MindNode>().nodeSize([LEAF_GAP, DEPTH_X])(
    hierarchy<MindNode>(root),
  );
  const nodes = laid.descendants();
  const links = laid.links();

  const xs = nodes.map((n) => n.y);
  const ys = nodes.map((n) => n.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const W = maxX - minX + NODE_W + 48;
  const H = maxY - minY + NODE_H + 32;
  const ox = NODE_W / 2 + 24 - minX;
  const oy = NODE_H / 2 + 16 - minY;

  const branches = (root.children ?? []).map((c) => c.label);
  const colorFor = (ancestorLabels: string[]): string => {
    if (ancestorLabels.length === 0) return "var(--color-primary)";
    return seriesColor(
      Math.max(0, branches.indexOf(ancestorLabels[0] ?? "")),
      undefined,
    );
  };

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto"
        style={{ minWidth: Math.min(W, 560) }}
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        {links.map((l) => {
          const x1 = (l.source.y ?? 0) + ox + NODE_W / 2;
          const y1 = (l.source.x ?? 0) + oy;
          const x2 = (l.target.y ?? 0) + ox - NODE_W / 2;
          const y2 = (l.target.x ?? 0) + oy;
          const mx = (x1 + x2) / 2;
          return (
            <path
              key={`${l.source.data.label}-${l.target.data.label}`}
              d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke={colorFor(labelsUp(l.source as unknown as Climb))}
              strokeWidth={1.5}
            />
          );
        })}
        {nodes.map((n, i) => {
          const ancestors = labelsUp(n as unknown as Climb);
          const isRoot = n.depth === 0;
          const color = isRoot ? "var(--color-primary)" : colorFor(ancestors);
          const tip = [...ancestors, n.data.label].join(" › ");
          const cx = (n.y ?? 0) + ox;
          const cy = (n.x ?? 0) + oy;
          return (
            <g key={`${n.data.label}-${i}`}>
              <title>{tip}</title>
              <rect
                x={cx - NODE_W / 2}
                y={cy - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={isRoot ? NODE_H / 2 : 8}
                fill={isRoot ? color : "var(--card)"}
                stroke={isRoot ? "transparent" : color}
                strokeWidth={1.5}
                data-chart-tip={tip}
              />
              <text
                x={cx}
                y={cy}
                dy={4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={isRoot ? 600 : 500}
                fill={
                  isRoot
                    ? "var(--color-primary-foreground)"
                    : "var(--color-foreground)"
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
          color: seriesColor(i, undefined),
        }))}
      />
    </div>
  );
}
