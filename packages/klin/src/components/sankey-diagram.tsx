/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";

import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  DIAGRAM_MIN_SCROLL,
  LINK_OPACITY,
  MIN_SHAPE_PX,
  NODE_BORDER_WIDTH,
  PERCENT_FACTOR,
  SANKEY_NODE_PADDING,
  SANKEY_NODE_WIDTH,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  computeSankeyLayout,
  isNamedSankeyNode,
  LABEL_DX,
  LABEL_DY,
  NODE_RX,
  SANKEY_H,
  SANKEY_W,
  sankeyLinkPath,
} from "./sankey-diagram.compute";
import type { SankeyDiagramProps } from "./sankey-diagram.types";

export {
  computeSankeyLayout,
  MAX_SANKEY_LINKS,
  MAX_SANKEY_NODES,
} from "./sankey-diagram.compute";
export type {
  SankeyDiagramProps,
  SankeyFlow,
  SankeyLayoutOptions,
  SankeyNode,
  SankeyNodeAlign,
} from "./sankey-diagram.types";

/**
 * Sankey SSR (flujos ponderados entre etapas).
 */
export function SankeyDiagram({
  nodes,
  flows,
  ariaLabel,
  format,
  locale = DEFAULT_LOCALE,
  height = SANKEY_H,
  nodeWidth = SANKEY_NODE_WIDTH,
  nodePadding = SANKEY_NODE_PADDING,
  nodeAlign = "justify",
  showLabels = true,
  maxItems,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
}: SankeyDiagramProps) {
  if (isBlank(nodes) || isBlank(flows)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const safeH = toNumber(height, SANKEY_H);
  const viewH = Number.isFinite(safeH) && safeH > 0 ? safeH : SANKEY_H;
  const { graph, capped, colorById } = computeSankeyLayout(nodes, flows, {
    height: viewH,
    nodeWidth,
    nodePadding,
    nodeAlign,
    maxItems,
  });

  if (isBlank(graph.links)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);

  const colorOf = (id: string) => {
    const entry = colorById.get(id);
    return seriesColor(entry?.index ?? 0, entry?.color);
  };
  const total = graph.links.reduce((acc, l) => acc + toNumber(l.value ?? 0), 0);
  const pctOf = (v: number) =>
    total > 0 ? Math.round((v / total) * PERCENT_FACTOR) : 0;

  return (
    <div className={className} style={style}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SANKEY_W} ${viewH}`}
          className="h-auto w-full"
          style={{ minWidth: Math.min(SANKEY_W, DIAGRAM_MIN_SCROLL) }}
          role="img"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        >
          {graph.links.map((l, i) => {
            if (!isNamedSankeyNode(l.source) || !isNamedSankeyNode(l.target)) {
              return null;
            }
            const s = l.source;
            const t = l.target;
            const tip = `${s.label} → ${t.label}: ${fmt(l.value ?? 0)} (${pctOf(toNumber(l.value ?? 0))}% del total)`;
            return (
              <g key={stableKey([s.id, t.id], i)}>
                <path
                  d={sankeyLinkPath(l)}
                  fill="none"
                  stroke={colorOf(s.id)}
                  strokeOpacity={LINK_OPACITY}
                  strokeWidth={Math.max(MIN_SHAPE_PX, l.width ?? MIN_SHAPE_PX)}
                  data-chart-tip={tip}
                />
              </g>
            );
          })}
          {graph.nodes.map((n, i) => {
            const tip = `${n.label}: ${fmt(n.value ?? 0)} (${pctOf(toNumber(n.value ?? 0))}%)`;
            const left = (n.x0 ?? 0) < SANKEY_W / 2;
            return (
              <g key={stableKey([n.id ?? ""], i)}>
                <rect
                  x={n.x0 ?? 0}
                  y={n.y0 ?? 0}
                  width={Math.max(NODE_BORDER_WIDTH, (n.x1 ?? 0) - (n.x0 ?? 0))}
                  height={Math.max(
                    NODE_BORDER_WIDTH,
                    (n.y1 ?? 0) - (n.y0 ?? 0),
                  )}
                  rx={NODE_RX}
                  fill={colorOf(n.id ?? "")}
                  data-chart-tip={tip}
                />
                {showLabels ? (
                  <text
                    x={left ? (n.x0 ?? 0) - LABEL_DX : (n.x1 ?? 0) + LABEL_DX}
                    y={((n.y0 ?? 0) + (n.y1 ?? 0)) / 2}
                    dy={LABEL_DY}
                    textAnchor={left ? "end" : "start"}
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {n.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
      {showLegend ? (
        <ChartLegend
          items={capped.map((n) => ({
            label: n.label,
            color: colorOf(n.id),
          }))}
        />
      ) : null}
    </div>
  );
}
