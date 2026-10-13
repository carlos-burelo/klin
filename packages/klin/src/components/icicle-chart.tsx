/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import {
  type HierarchyRectangularNode,
  hierarchy,
  partition,
} from "d3-hierarchy";
import type { CSSProperties } from "react";
import { CHART_W, ChartSvg } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_NODES } from "../lib/limits";
import { toNumber } from "../lib/number";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { BAR_RADIUS, CHART_TOKEN, PERCENT_FACTOR } from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type IcicleNode = {
  label: string;
  value?: number;
  color?: string;
  children?: IcicleNode[];
};

/** Props del icicle. */
export type IcicleChartProps = {
  root: IcicleNode;
  ariaLabel: string;
  height?: number;
  format?: (value: number) => string;
  locale?: string;
  /** Profundidad máxima visible (por defecto sin límite). */
  depth?: number;
  /** Muestra las etiquetas dentro de cada banda. */
  showLabels?: boolean;
  /** Agrega el valor a la etiqueta de cada banda. */
  showValues?: boolean;
  /** Ancho mínimo de banda para rotular. */
  minLabelWidth?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/** Cap de nodos (alias de DEFAULT_MAX_NODES, compat). */
export const MAX_ICICLE_NODES = DEFAULT_MAX_NODES;

const ICICLE_H = 360;
const PARTITION_PAD = 2;
const LABEL_MIN_PX = 40;
const NODE_FONT_SIZE = 12;
const LABEL_DX = 6;
const NODE_LABEL_DY = 4;
const LABEL_CHAR_PX = 7;
/** Profundidad visible por defecto (sin límite). */
const ICICLE_DEPTH_DEFAULT = Number.POSITIVE_INFINITY;

export type IcicleBand = HierarchyRectangularNode<IcicleNode>;

/**
 * Cómputo puro del layout icicle (partición cartesiana).
 * Ordena bandas por valor desc y trunca a las primeras N para SSR.
 */
export function computeIcicleLayout(
  root: IcicleNode,
  width: number,
  height: number,
): { bands: IcicleBand[]; total: number } {
  const proot: IcicleBand = partition<IcicleNode>()
    .size([width, height])
    .padding(PARTITION_PAD)
    .round(true)(
    hierarchy<IcicleNode>(root)
      .sum((d) => toNumber(d.value))
      .sort((a, b) => toNumber(b.value) - toNumber(a.value)),
  );
  const bands = proot
    .descendants()
    .filter((d) => d.depth > 0 && toNumber(d.value) > 0)
    .sort((a, b) => toNumber(b.value) - toNumber(a.value))
    .slice(0, MAX_ICICLE_NODES);
  return { bands, total: toNumber(proot.value) };
}

function chainOf(node: IcicleBand): string[] {
  return node
    .ancestors()
    .reverse()
    .map((a) => a.data.label);
}

/**
 * Icicle SSR (jerarquía por bandas con `d3.partition`).
 */
export function IcicleChart({
  root,
  ariaLabel,
  height = ICICLE_H,
  format,
  locale = "es-MX",
  depth = ICICLE_DEPTH_DEFAULT,
  showLabels = true,
  showValues = false,
  minLabelWidth = LABEL_MIN_PX,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: IcicleChartProps) {
  if (!root || root.label === "") {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const { bands, total } = computeIcicleLayout(root, CHART_W, height);
  const maxDepth = toNumber(depth, ICICLE_DEPTH_DEFAULT);
  const minW = Math.max(0, toNumber(minLabelWidth, LABEL_MIN_PX));
  const visible = bands.filter((b) => b.depth <= maxDepth);
  if (visible.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fmt = format ?? ((v: number) => formatDefault(v, locale));

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
        const w = b.x1 - b.x0;
        const h = b.y1 - b.y0;
        const color = seriesColor(b.depth, b.data.color);
        const showLabel = showLabels && w > minW;
        const tag = showValues
          ? `${truncateLabel(b.data.label, Math.max(1, Math.floor(w / LABEL_CHAR_PX)))} · ${fmt(value)}`
          : truncateLabel(
              b.data.label,
              Math.max(1, Math.floor(w / LABEL_CHAR_PX)),
            );
        return (
          <g key={stableKey([...chain, b.depth], i)}>
            <title>{tip}</title>
            <rect
              x={b.x0}
              y={b.y0}
              width={w}
              height={h}
              rx={BAR_RADIUS}
              fill={color}
              stroke={CHART_TOKEN.background}
              data-chart-tip={tip}
            />
            {showLabel ? (
              <text
                x={b.x0 + LABEL_DX}
                y={b.y0 + h / 2}
                dy={NODE_LABEL_DY}
                fontSize={NODE_FONT_SIZE}
                fill="white"
              >
                {tag}
              </text>
            ) : null}{" "}
          </g>
        );
      })}
    </ChartSvg>
  );
}
