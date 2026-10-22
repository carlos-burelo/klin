/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  EDGE_LABEL_FONT_SIZE,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
  NODE_BORDER_WIDTH,
} from "../core/theme";
import { EdgeLabel } from "../render/edge-label";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { markerUrl, SvgMarkers } from "../render/markers";
import {
  computeTopologyLayout,
  DASH_DOWN,
  GLYPH_X,
  LABEL_DY,
  LABEL_DY_WITH_SUB,
  LABEL_X,
  NODE_FONT_SIZE,
  NODE_RX_PROCESS,
  roleColor,
  SUB_DY,
  statusColor,
} from "./network-topology.compute";
import { GLYPH_R, RoleGlyph } from "./network-topology.glyphs";
import type { NetworkTopologyProps } from "./network-topology.types";

export { computeTopologyLayout } from "./network-topology.compute";
export type {
  NetworkTopologyProps,
  TopoEdge,
  TopoNode,
  TopoRole,
} from "./network-topology.types";

/**
 * Topología de red SSR (roles con glifo + enlaces con estado).
 */
export function NetworkTopology({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  linkLegend = true,
  roleLegend = false,
  glyphSize = GLYPH_R,
  statusColors,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: NetworkTopologyProps) {
  if (isBlank(nodes)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, byId, edgeByKey, width, height, usedStatuses } =
    computeTopologyLayout(nodes, edges, direction);

  return (
    <div className={className} style={style}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          style={{ minWidth: width }}
          role="img"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        >
          <SvgMarkers prefix="charts-topo" kinds={["arrow"]} />
          {layout.edges.map((e, i) => {
            const edge = edgeByKey.get(`${e.from}→${e.to}`);
            const status = edge?.status ?? "up";
            return (
              <path
                key={stableKey([e.from, e.to], i)}
                d={e.d}
                fill="none"
                stroke={statusColor(status, statusColors)}
                strokeWidth={status === "down" ? NODE_BORDER_WIDTH : EDGE_WIDTH}
                strokeDasharray={status === "down" ? DASH_DOWN : undefined}
                markerEnd={markerUrl("charts-topo", "arrow")}
              />
            );
          })}
          {[...layout.nodes.values()].map((p, i) => {
            const n = byId.get(p.id);
            if (!n) return null;
            const role = n.role ?? "server";
            const tip =
              `${n.label} (${role})` +
              (n.sub ? ` · ${n.sub}` : "") +
              ` · ${edges.filter((e) => e.from === p.id || e.to === p.id).length} enlaces`;
            return (
              <g key={stableKey([p.id], i)}>
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={NODE_RX_PROCESS}
                  fill={CHART_TOKEN.card}
                  stroke={roleColor(role)}
                  strokeWidth={EDGE_WIDTH}
                  data-chart-tip={tip}
                />
                {glyphSize === GLYPH_R ? (
                  <RoleGlyph role={role} x={p.x + GLYPH_X} y={p.cy} />
                ) : (
                  <g
                    transform={`translate(${p.x + GLYPH_X} ${p.cy}) scale(${glyphSize / GLYPH_R}) translate(${-(p.x + GLYPH_X)} ${-p.cy})`}
                  >
                    <RoleGlyph role={role} x={p.x + GLYPH_X} y={p.cy} />
                  </g>
                )}
                <text
                  x={p.x + LABEL_X}
                  y={p.cy + (n.sub ? LABEL_DY_WITH_SUB : LABEL_DY)}
                  fontSize={NODE_FONT_SIZE}
                  fontWeight={FONT_SEMIBOLD}
                  fill={CHART_TOKEN.foreground}
                >
                  {truncateLabel(n.label, 18)}
                </text>
                {n.sub ? (
                  <text
                    x={p.x + LABEL_X}
                    y={p.cy + SUB_DY}
                    fontSize={EDGE_LABEL_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {truncateLabel(n.sub, 22)}
                  </text>
                ) : null}
              </g>
            );
          })}
          {layout.edges.map((e, i) => {
            const edge = edgeByKey.get(`${e.from}→${e.to}`);
            return edge?.label ? (
              <EdgeLabel
                key={stableKey([e.from, e.to, edge.label], i)}
                mx={e.mx}
                my={e.my}
                text={edge.label}
              />
            ) : null;
          })}
        </svg>
      </div>
      {linkLegend ? (
        <ChartLegend
          items={usedStatuses.map((s) => ({
            label:
              s === "up"
                ? "Enlace activo"
                : s === "down"
                  ? "Caído"
                  : "Degradado",
            color: statusColor(s, statusColors),
          }))}
        />
      ) : null}
      {roleLegend ? (
        <ChartLegend
          items={(
            [
              "internet",
              "cloud",
              "firewall",
              "router",
              "switch",
              "server",
              "host",
            ] as const
          ).map((r) => ({ label: r, color: roleColor(r) }))}
        />
      ) : null}
    </div>
  );
}
