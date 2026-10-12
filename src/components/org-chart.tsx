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
  EDGE_LABEL_FONT_SIZE,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type OrgNode = {
  name: string;
  role?: string;
  color?: string;
  children?: OrgNode[];
};

/** Props del organigrama. */
export type OrgChartProps = {
  root: OrgNode;
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const BOX_W = 150;
const BOX_H = 52;
const GAP_X = 24;
const GAP_Y = 64;
const VIEW_PAD_X = 48;
const VIEW_PAD_Y = 24;
const ORIGIN_PAD_X = 24;
const ORIGIN_PAD_Y = 12;
const NODE_RX = 8;
const NODE_FONT_SIZE = 12;
const LABEL_DY = 4;
const LABEL_DY_WITH_ROLE = -3;
const ROLE_DY = 12;

/**
 * Cómputo puro del layout del organigrama (árbol vertical + viewport).
 */
export function computeOrgLayout(root: OrgNode) {
  const laid = tree<OrgNode>().nodeSize([BOX_W + GAP_X, BOX_H + GAP_Y])(
    hierarchy<OrgNode>(root),
  );
  const nodes = laid.descendants();
  const links = laid.links();
  const xs = nodes.map((n) => n.x ?? 0);
  const ys = nodes.map((n) => n.y ?? 0);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const W = maxX - minX + BOX_W + VIEW_PAD_X;
  const H = maxY + BOX_H + VIEW_PAD_Y;
  const ox = BOX_W / 2 + ORIGIN_PAD_X - minX;
  const oy = BOX_H / 2 + ORIGIN_PAD_Y;
  return { nodes, links, W, H, ox, oy };
}

/**
 * Organigrama SSR (árbol vertical con cargo).
 */
export function OrgChart({
  root,
  ariaLabel,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: OrgChartProps) {
  if (!root.name) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { nodes, links, W, H, ox, oy } = computeOrgLayout(root);

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
          const x1 = (l.source.x ?? 0) + ox;
          const y1 = (l.source.y ?? 0) + oy + BOX_H / 2;
          const x2 = (l.target.x ?? 0) + ox;
          const y2 = (l.target.y ?? 0) + oy - BOX_H / 2;
          const my = (y1 + y2) / 2;
          return (
            <path
              key={stableKey([l.source.data.name, l.target.data.name], i)}
              d={`M ${x1} ${y1} L ${x1} ${my} L ${x2} ${my} L ${x2} ${y2}`}
              fill="none"
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
            />
          );
        })}
        {nodes.map((n, i) => {
          const color = seriesColor(n.depth, n.data.color);
          const cx = (n.x ?? 0) + ox;
          const cy = (n.y ?? 0) + oy;
          const tip = n.data.role
            ? `${n.data.name} · ${n.data.role}`
            : n.data.name;
          return (
            <g key={stableKey([n.data.name], i)}>
              <title>{tip}</title>
              <rect
                x={cx - BOX_W / 2}
                y={cy - BOX_H / 2}
                width={BOX_W}
                height={BOX_H}
                rx={NODE_RX}
                fill={CHART_TOKEN.card}
                stroke={color}
                strokeWidth={EDGE_WIDTH}
                data-chart-tip={tip}
              />
              <text
                x={cx}
                y={cy + (n.data.role ? LABEL_DY_WITH_ROLE : LABEL_DY)}
                textAnchor="middle"
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(n.data.name, 20)}
              </text>
              {n.data.role ? (
                <text
                  x={cx}
                  y={cy + ROLE_DY}
                  textAnchor="middle"
                  fontSize={EDGE_LABEL_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(n.data.role, 24)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
