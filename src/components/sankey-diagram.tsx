/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_LINKS, DEFAULT_MAX_NODES } from "../lib/limits";
import { toNumber } from "../lib/number";
import { formatDefault, seriesColor } from "../lib/palette";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  LINK_OPACITY,
  MIN_SHAPE_PX,
  NODE_BORDER_WIDTH,
  PERCENT_FACTOR,
  SANKEY_NODE_PADDING,
  SANKEY_NODE_WIDTH,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

export type SankeyNode = {
  id: string;
  label: string;
  color?: string;
};

export type SankeyFlow = {
  from: string;
  to: string;
  value: number;
};

/** Props del diagrama sankey. */
export type SankeyDiagramProps = {
  nodes: SankeyNode[];
  flows: SankeyFlow[];
  ariaLabel: string;
  formatValue?: (value: number) => string;
  locale?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
};

/** Caps SSR (alias de los límites centrales, compat). */
export const MAX_SANKEY_NODES = DEFAULT_MAX_NODES;
export const MAX_SANKEY_LINKS = DEFAULT_MAX_LINKS;

const SANKEY_W = 680;
const SANKEY_H = 360;
const LABEL_GUTTER = 120;
const PAD = 8;
const NODE_RX = 3;
const LABEL_DX = 6;
const LABEL_DY = 4;

type SankeyNodeDatum = { id: string; label: string; color?: string };
type SankeyLinkDatum = { value: number };

/** Nodo sankey con nombre (id + etiqueta) tras el layout. */
type NamedSankeyNode = { id: string; label: string };

/** Guarda: el extremo del enlace ya es un nodo posicionado con nombre. */
function isNamedSankeyNode(node: unknown): node is NamedSankeyNode {
  if (typeof node !== "object" || node === null) return false;
  const record = node as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.label === "string";
}

/**
 * Cómputo puro del layout sankey (trunca determinista + precachea color).
 * Retorna el grafo ya posicionado y el mapa id → {color, index}.
 */
export function computeSankeyLayout(nodes: SankeyNode[], flows: SankeyFlow[]) {
  const capped = nodes.slice(0, MAX_SANKEY_NODES);
  const known = new Set(capped.map((n) => n.id));
  const cleanFlows = flows
    .filter(
      (f) => known.has(f.from) && known.has(f.to) && toNumber(f.value) > 0,
    )
    .slice(0, MAX_SANKEY_LINKS);

  const graph = sankey<SankeyNodeDatum, SankeyLinkDatum>()
    .nodeId((d) => d.id)
    .nodeWidth(SANKEY_NODE_WIDTH)
    .nodePadding(SANKEY_NODE_PADDING)
    .extent([
      [LABEL_GUTTER, PAD],
      [SANKEY_W - PAD, SANKEY_H - PAD],
    ])({
    nodes: capped.map((n) => ({ ...n })),
    links: cleanFlows.map((f) => ({
      source: f.from,
      target: f.to,
      value: toNumber(f.value),
    })),
  });

  const colorById = new Map<string, { color?: string; index: number }>();
  for (const [i, n] of capped.entries()) {
    colorById.set(n.id, { color: n.color, index: i });
  }

  return { graph, capped, colorById };
}

/**
 * Sankey SSR (flujos ponderados entre etapas).
 */
export function SankeyDiagram({
  nodes,
  flows,
  ariaLabel,
  formatValue,
  locale = "es-MX",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
}: SankeyDiagramProps) {
  if (nodes.length === 0 || flows.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { graph, capped, colorById } = computeSankeyLayout(nodes, flows);

  if (graph.links.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = formatValue ?? ((v: number) => formatDefault(v, locale));

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
          viewBox={`0 0 ${SANKEY_W} ${SANKEY_H}`}
          className="h-auto w-full"
          style={{ minWidth: Math.min(SANKEY_W, DIAGRAM_MIN_SCROLL) }}
          role="img"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        >
          <title>{ariaLabel}</title>
          {graph.links.map((l, i) => {
            if (!isNamedSankeyNode(l.source) || !isNamedSankeyNode(l.target)) {
              return null;
            }
            const s = l.source;
            const t = l.target;
            const tip = `${s.label} → ${t.label}: ${fmt(l.value ?? 0)} (${pctOf(toNumber(l.value ?? 0))}% del total)`;
            return (
              <g key={stableKey([s.id, t.id], i)}>
                <title>{tip}</title>
                <path
                  d={sankeyLinkHorizontal()(l) ?? ""}
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
                <title>{tip}</title>
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
