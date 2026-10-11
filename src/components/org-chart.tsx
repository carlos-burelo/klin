/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { hierarchy, tree } from "d3-hierarchy";
import { seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type OrgNode = {
  name: string;
  role?: string;
  color?: string;
  children?: OrgNode[];
};

const BOX_W = 150;
const BOX_H = 52;
const GAP_X = 24;
const GAP_Y = 64;

/**
 * Organigrama SSR (árbol vertical con cargo).
 */
export function OrgChart({
  root,
  ariaLabel,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  root: OrgNode;
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (!root.name) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

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
  const W = maxX - minX + BOX_W + 48;
  const H = maxY + BOX_H + 24;
  const ox = BOX_W / 2 + 24 - minX;
  const oy = BOX_H / 2 + 12;

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
          const x1 = (l.source.x ?? 0) + ox;
          const y1 = (l.source.y ?? 0) + oy + BOX_H / 2;
          const x2 = (l.target.x ?? 0) + ox;
          const y2 = (l.target.y ?? 0) + oy - BOX_H / 2;
          const my = (y1 + y2) / 2;
          return (
            <path
              key={`${l.source.data.name}-${l.target.data.name}`}
              d={`M ${x1} ${y1} L ${x1} ${my} L ${x2} ${my} L ${x2} ${y2}`}
              fill="none"
              stroke="var(--color-muted-foreground)"
              strokeWidth={1.5}
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
            <g key={`${n.data.name}-${i}`}>
              <title>{tip}</title>
              <rect
                x={cx - BOX_W / 2}
                y={cy - BOX_H / 2}
                width={BOX_W}
                height={BOX_H}
                rx={8}
                fill="var(--card)"
                stroke={color}
                strokeWidth={1.5}
                data-chart-tip={tip}
              />
              <text
                x={cx}
                y={cy + (n.data.role ? -3 : 4)}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="var(--color-foreground)"
              >
                {truncateLabel(n.data.name, 20)}
              </text>
              {n.data.role ? (
                <text
                  x={cx}
                  y={cy + 12}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--color-muted-foreground)"
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
