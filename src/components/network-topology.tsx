import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type TopoRole =
  | "internet"
  | "cloud"
  | "firewall"
  | "router"
  | "switch"
  | "server"
  | "host";

export type TopoNode = {
  id: string;
  label: string;
  sub?: string;
  role?: TopoRole;
};

export type TopoLink = {
  from: string;
  to: string;
  label?: string;
  status?: "up" | "degraded" | "down";
};

const ROLE_ORDER: TopoRole[] = [
  "internet",
  "cloud",
  "firewall",
  "router",
  "switch",
  "server",
  "host",
];

function roleColor(role: TopoRole): string {
  switch (role) {
    case "internet":
      return "var(--color-chart-2)";
    case "cloud":
      return "var(--color-chart-4)";
    case "firewall":
      return "var(--color-destructive)";
    case "router":
      return "var(--color-chart-1)";
    case "switch":
      return "var(--color-chart-3)";
    case "server":
      return "var(--color-chart-5)";
    case "host":
      return "var(--color-muted-foreground)";
  }
}

function statusColor(status: TopoLink["status"]): string {
  switch (status) {
    case "down":
      return "var(--color-destructive)";
    case "degraded":
      return "var(--color-chart-3)";
    default:
      return "var(--color-muted-foreground)";
  }
}

/** Glifo del rol (16px) dibujado en (x, y). */
function RoleGlyph({ role, x, y }: { role: TopoRole; x: number; y: number }) {
  const c = roleColor(role);
  switch (role) {
    case "internet":
      return (
        <g stroke={c} strokeWidth={1.5} fill="none">
          <circle cx={x} cy={y} r={7} />
          <ellipse cx={x} cy={y} rx={3.5} ry={7} />
          <line x1={x - 7} y1={y} x2={x + 7} y2={y} />
        </g>
      );
    case "cloud":
      return (
        <g fill="none" stroke={c} strokeWidth={1.5}>
          <path
            d={`M ${x - 8} ${y + 3} a 4 4 0 0 1 1 -7.8 a 5 5 0 0 1 9.4 -2 a 3.6 3.6 0 0 1 4.6 5.2 l -15 4.6 z`}
          />
        </g>
      );
    case "firewall":
      return (
        <g stroke={c} strokeWidth={1.5}>
          <rect x={x - 7} y={y - 6} width={14} height={12} rx={2} fill="none" />
          <line x1={x - 7} y1={y - 2} x2={x + 7} y2={y - 2} />
          <line x1={x - 7} y1={y + 2} x2={x + 7} y2={y + 2} />
        </g>
      );
    case "router":
      return (
        <g stroke={c} strokeWidth={1.5} fill="none">
          <circle cx={x} cy={y} r={7} />
          <path
            d={`M ${x - 3.5} ${y} h 7 M ${x + 1.5} ${y - 2} L ${x + 3.5} ${y} L ${x + 1.5} ${y + 2}`}
          />
          <path d={`M ${x + 3.5} ${y} h -7`} strokeDasharray="2 1.5" />
        </g>
      );
    case "switch":
      return (
        <g stroke={c} strokeWidth={1.5} fill="none">
          <rect x={x - 8} y={y - 5} width={16} height={10} rx={2} />
          <path
            d={`M ${x - 4} ${y + 1} l 2.5 -3 l 2.5 3 M ${x + 1} ${y - 1} l 2.5 3`}
            strokeWidth={1.25}
          />
        </g>
      );
    case "server":
      return (
        <g stroke={c} strokeWidth={1.5} fill="none">
          <rect x={x - 6} y={y - 8} width={12} height={16} rx={2} />
          <circle cx={x - 2.5} cy={y - 4} r={1} fill={c} stroke="none" />
          <circle cx={x - 2.5} cy={y + 4} r={1} fill={c} stroke="none" />
          <line x1={x + 1} y1={y - 4} x2={x + 4} y2={y - 4} />
          <line x1={x + 1} y1={y + 4} x2={x + 4} y2={y + 4} />
        </g>
      );
    case "host":
      return (
        <g stroke={c} strokeWidth={1.5} fill="none">
          <rect x={x - 7} y={y - 6} width={14} height={9} rx={1.5} />
          <line x1={x} y1={y + 3} x2={x} y2={y + 7} />
          <line x1={x - 4} y1={y + 7} x2={x + 4} y2={y + 7} />
        </g>
      );
  }
}

/**
 * Topología de red SSR (roles con glifo + enlaces con estado).
 */
export function NetworkTopology({
  nodes,
  links,
  ariaLabel,
  direction = "TB",
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  nodes: TopoNode[];
  links: TopoLink[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const rank = new Map(ROLE_ORDER.map((r, i) => [r, i]));
  const ordered = [...nodes].sort(
    (a, b) =>
      (rank.get(a.role ?? "server") ?? 99) -
      (rank.get(b.role ?? "server") ?? 99),
  );
  const W = fitNodeWidth(
    nodes.flatMap((n) => (n.sub ? [n.label, n.sub] : [n.label])),
    { min: 150, max: 220, size: 12, pad: 52 },
  );
  const H = 60;
  const layout = layoutDag(
    ordered.map((n) => n.id),
    links,
    { direction, nodeW: W, nodeH: H, gapX: 48, gapY: 72, minW: 560 },
  );
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const width = Math.max(1, layout.width);
  const height = Math.max(1, layout.height);
  const usedStatuses = [...new Set(links.map((l) => l.status ?? "up"))];

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          style={{ minWidth: width }}
          role="img"
          aria-label={ariaLabel}
        >
          <title>{ariaLabel}</title>
          <defs>
            <marker
              id="charts-topo-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 1 L 9 5 L 0 9 z"
                fill="var(--color-muted-foreground)"
              />
            </marker>
          </defs>
          {layout.edges.map((e, i) => {
            const link = links.find((x) => x.from === e.from && x.to === e.to);
            const status = link?.status ?? "up";
            return (
              <path
                key={`${e.from}-${e.to}-${i}`}
                d={e.d}
                fill="none"
                stroke={statusColor(status)}
                strokeWidth={status === "down" ? 2 : 1.5}
                strokeDasharray={status === "down" ? "5 4" : undefined}
                markerEnd="url(#charts-topo-arrow)"
              />
            );
          })}
          {[...layout.nodes.values()].map((p) => {
            const n = byId.get(p.id);
            if (!n) return null;
            const role = n.role ?? "server";
            const tip =
              `${n.label} (${role})` +
              (n.sub ? ` · ${n.sub}` : "") +
              ` · ${links.filter((l) => l.from === p.id || l.to === p.id).length} enlaces`;
            return (
              <g key={p.id}>
                <title>{tip}</title>
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={8}
                  fill="var(--card)"
                  stroke={roleColor(role)}
                  strokeWidth={1.5}
                  data-chart-tip={tip}
                />
                <RoleGlyph role={role} x={p.x + 24} y={p.cy} />
                <text
                  x={p.x + 38}
                  y={p.cy + (n.sub ? -3 : 4)}
                  fontSize={12}
                  fontWeight={600}
                  fill="var(--color-foreground)"
                >
                  {truncateLabel(n.label, 18)}
                </text>
                {n.sub ? (
                  <text
                    x={p.x + 38}
                    y={p.cy + 12}
                    fontSize={10}
                    fill="var(--color-muted-foreground)"
                  >
                    {truncateLabel(n.sub, 22)}
                  </text>
                ) : null}
              </g>
            );
          })}
          {layout.edges.map((e) => {
            const link = links.find((x) => x.from === e.from && x.to === e.to);
            return link?.label ? (
              <EdgeLabel
                key={`${e.from}-${e.to}-${link.label}`}
                mx={e.mx}
                my={e.my}
                text={link.label}
              />
            ) : null;
          })}
        </svg>
      </div>
      <ChartLegend
        items={usedStatuses.map((s) => ({
          label:
            s === "up" ? "Enlace activo" : s === "down" ? "Caído" : "Degradado",
          color: statusColor(s),
        }))}
      />
    </div>
  );
}
