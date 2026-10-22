/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { seriesColor } from "../core/color";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  EDGE_LABEL_FONT_SIZE,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  BOX_H,
  computeOrgLayout,
  LABEL_DY,
  LABEL_DY_WITH_ROLE,
  NODE_FONT_SIZE,
  NODE_RX,
  ORG_AVATAR_FONT_SIZE,
  ORG_AVATAR_PAD_X,
  ORG_AVATAR_R,
  ORG_AVATAR_TEXT_SHIFT,
  orgInitials,
  ROLE_DY,
} from "./org-chart.compute";
import type { OrgChartProps } from "./org-chart.types";

export type { OrgLayoutOptions } from "./org-chart.compute";
export { computeOrgLayout, sortOrgChildren } from "./org-chart.compute";
export type { OrgChartProps, OrgNode } from "./org-chart.types";

/**
 * Organigrama SSR (árbol vertical con cargo).
 */
export function OrgChart({
  root,
  ariaLabel,
  showRole = true,
  showAvatar = false,
  collapseDepth,
  sortBy,
  nodeWidth,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: OrgChartProps) {
  if (!root.name) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { nodes, links, W, H, ox, oy, boxW } = computeOrgLayout(
    root,
    collapseDepth,
    { sortBy, nodeWidth },
  );

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
          const role = showRole ? n.data.role : undefined;
          const tip = role ? `${n.data.name} · ${role}` : n.data.name;
          const textX = showAvatar ? cx + ORG_AVATAR_TEXT_SHIFT : cx;
          return (
            <g key={stableKey([n.data.name], i)}>
              <rect
                x={cx - boxW / 2}
                y={cy - BOX_H / 2}
                width={boxW}
                height={BOX_H}
                rx={NODE_RX}
                fill={CHART_TOKEN.card}
                stroke={color}
                strokeWidth={EDGE_WIDTH}
                data-chart-tip={tip}
              />
              {showAvatar ? (
                <g>
                  <circle
                    cx={cx - boxW / 2 + ORG_AVATAR_PAD_X + ORG_AVATAR_R}
                    cy={cy}
                    r={ORG_AVATAR_R}
                    fill={color}
                    stroke={CHART_TOKEN.background}
                    strokeWidth={EDGE_WIDTH}
                  />
                  <text
                    x={cx - boxW / 2 + ORG_AVATAR_PAD_X + ORG_AVATAR_R}
                    y={cy}
                    dy={LABEL_DY}
                    textAnchor="middle"
                    fontSize={ORG_AVATAR_FONT_SIZE}
                    fontWeight={FONT_SEMIBOLD}
                    fill={CHART_TOKEN.primaryForeground}
                  >
                    {orgInitials(n.data.name)}
                  </text>
                </g>
              ) : null}
              <text
                x={textX}
                y={cy + (role ? LABEL_DY_WITH_ROLE : LABEL_DY)}
                textAnchor="middle"
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(n.data.name, 20)}
              </text>
              {role ? (
                <text
                  x={textX}
                  y={cy + ROLE_DY}
                  textAnchor="middle"
                  fontSize={EDGE_LABEL_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(role, 24)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
