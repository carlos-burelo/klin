/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { type HierarchyCircularNode, hierarchy, pack } from "d3-hierarchy";
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { CHART_W, ChartSvg } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_NODES } from "../lib/limits";
import { toNumber } from "../lib/number";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  NODE_BORDER_WIDTH,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type CirclePackNode = {
  label: string;
  value?: number;
  color?: string;
  children?: CirclePackNode[];
};

/** Props del circle-pack. */
export type CirclePackChartProps = {
  root: CirclePackNode;
  ariaLabel: string;
  height?: number;
  format?: (value: number) => string;
  locale?: string;
  /** Profundidad máxima visible (por defecto sin límite). */
  depth?: number;
  /** Muestra las etiquetas dentro de cada burbuja. */
  showLabels?: boolean;
  /** Agrega el valor a la etiqueta de cada burbuja. */
  showValues?: boolean;
  /** Diámetro mínimo de burbuja para rotular. */
  minLabelDiameter?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/** Cap de nodos (alias de DEFAULT_MAX_NODES, compat). */
export const MAX_PACK_NODES = DEFAULT_MAX_NODES;

const PACK_H = 420;
const PACK_PAD = 4;
const PACK_FILL_OPACITY = 0.45;
const PACK_LABEL_MIN_D = 48;
const PACK_LABEL_MAX_DEPTH = 2;
const PACK_LABEL_CHAR_PX = 7;
/** Profundidad visible por defecto (sin límite). */
const PACK_DEPTH_DEFAULT = Number.POSITIVE_INFINITY;

export type PackBubble = HierarchyCircularNode<CirclePackNode>;

/**
 * Cómputo puro del layout circle-pack (empaquetado de círculos).
 * Trunca a los N primeros nodos para SSR.
 */
export function computeCirclePackLayout(
  root: CirclePackNode,
  width: number,
  height: number,
): { bubbles: PackBubble[]; total: number } {
  const packed: PackBubble = pack<CirclePackNode>()
    .size([width, height])
    .padding(PACK_PAD)(
    hierarchy<CirclePackNode>(root)
      .sum((d) => toNumber(d.value))
      .sort((a, b) => toNumber(b.value) - toNumber(a.value)),
  );
  const bubbles = packed
    .descendants()
    .filter((d) => (d.r ?? 0) > 0)
    .slice(0, MAX_PACK_NODES);
  return { bubbles, total: toNumber(packed.value) };
}

function chainOf(node: PackBubble): string[] {
  return node
    .ancestors()
    .reverse()
    .map((a) => a.data.label);
}

/**
 * Circle-pack SSR (jerarquía por círculos con `d3.pack`).
 */
export function CirclePackChart({
  root,
  ariaLabel,
  height = PACK_H,
  format,
  locale = DEFAULT_LOCALE,
  depth = PACK_DEPTH_DEFAULT,
  showLabels = true,
  showValues = false,
  minLabelDiameter = PACK_LABEL_MIN_D,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: CirclePackChartProps) {
  if (!root || root.label === "") {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const { bubbles, total } = computeCirclePackLayout(root, CHART_W, height);
  const maxDepth = toNumber(depth, PACK_DEPTH_DEFAULT);
  const minD = Math.max(0, toNumber(minLabelDiameter, PACK_LABEL_MIN_D));
  const visible = bubbles.filter((b) => b.depth <= maxDepth);
  if (isBlank(visible.filter((b) => b.depth > 0))) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fmt = resolveFormatter(format, locale);

  return (
    <ChartSvg
      width={CHART_W}
      height={height}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      className={className ? `h-auto w-full ${className}` : undefined}
      style={style}
    >
      {visible.map((b, i) => {
        const chain = chainOf(b);
        const value = toNumber(b.value);
        const pct =
          total > 0 ? Math.round((value / total) * PERCENT_FACTOR) : 0;
        const tip = `${chain.join(" › ")}: ${fmt(value)} (${pct}%)`;
        const color = seriesColor(b.depth, b.data.color);
        const diameter = b.r * 2;
        const showLabel =
          showLabels &&
          b.depth >= 1 &&
          b.depth <= PACK_LABEL_MAX_DEPTH &&
          diameter > minD;
        const tag = showValues
          ? `${truncateLabel(b.data.label, Math.max(1, Math.floor(diameter / PACK_LABEL_CHAR_PX)))} · ${fmt(value)}`
          : truncateLabel(
              b.data.label,
              Math.max(1, Math.floor(diameter / PACK_LABEL_CHAR_PX)),
            );
        return (
          <g key={stableKey([...chain, b.depth], i)}>
            <title>{tip}</title>
            <circle
              cx={b.x}
              cy={b.y}
              r={b.r}
              fill={color}
              fillOpacity={PACK_FILL_OPACITY}
              stroke={CHART_TOKEN.background}
              strokeWidth={NODE_BORDER_WIDTH}
              data-chart-tip={tip}
            />
            {showLabel ? (
              <text
                x={b.x}
                y={b.y}
                textAnchor="middle"
                dy={TICK_FONT_SIZE / 2 - 1}
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
