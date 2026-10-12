/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import {
  type HierarchyRectangularNode,
  hierarchy,
  treemap,
} from "d3-hierarchy";
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_LEAVES } from "../lib/limits";
import { toNumber } from "../lib/number";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  BAR_RADIUS,
  CHART_WIDTH,
  FONT_SEMIBOLD,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type TreemapNode = {
  label: string;
  value?: number;
  color?: string;
  children?: TreemapNode[];
};

/** Props del treemap. */
export type TreemapChartProps = {
  data: TreemapNode[];
  ariaLabel: string;
  formatValue?: (value: number) => string;
  locale?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/** Cap de hojas (alias de DEFAULT_MAX_LEAVES, compat). */
export const MAX_TREEMAP_LEAVES = DEFAULT_MAX_LEAVES;

const TREEMAP_H = 360;
const TREEMAP_GAP = 3;
const NODE_FONT_SIZE = 12;
const LABEL_X = 8;
const LABEL_DY = 20;
const VALUE_DY = 36;
const MIN_LABEL_W = 64;
const MIN_LABEL_H = 30;
const CHAR_PER_PX = 8;
const VALUE_OPACITY = 0.85;

type TreemapDatum = {
  label: string;
  value?: number;
  color?: string;
  children?: TreemapNode[];
};

export type TreemapLeaf = HierarchyRectangularNode<TreemapDatum>;

/**
 * Cómputo puro del layout treemap. Ordena hojas por valor desc y
 * trunca a las primeras N para SSR.
 */
export function computeTreemapLayout(data: TreemapNode[]): {
  leaves: TreemapLeaf[];
  topLabels: string[];
} {
  const root: TreemapLeaf = treemap<TreemapDatum>()
    .size([CHART_WIDTH, TREEMAP_H])
    .paddingOuter(TREEMAP_GAP)
    .paddingInner(TREEMAP_GAP)
    .round(true)(
    hierarchy<TreemapDatum>({
      label: "root",
      children: data,
    })
      .sum((d) => toNumber(d.value))
      .sort((a, b) => toNumber(b.value) - toNumber(a.value)),
  );

  const leaves = root
    .leaves()
    .filter((l) => toNumber(l.value) > 0)
    .sort((a, b) => toNumber(b.value) - toNumber(a.value))
    .slice(0, MAX_TREEMAP_LEAVES);
  const topLabels = data.map((d) => d.label);
  return { leaves, topLabels };
}

/**
 * Mapa rectangular SSR (jerarquías por área). Hojas con etiqueta si caben.
 */
export function TreemapChart({
  data,
  ariaLabel,
  formatValue,
  locale = "es-MX",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: TreemapChartProps) {
  if (data.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { leaves, topLabels } = computeTreemapLayout(data);
  if (leaves.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fmt = formatValue ?? ((v: number) => formatDefault(v, locale));
  const total = leaves.reduce((acc, l) => acc + toNumber(l.value), 0);

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${TREEMAP_H}`}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{ariaLabel}</title>
      {leaves.map((leaf, i) => {
        const ancestors = leaf.ancestors();
        const top = ancestors[ancestors.length - 2];
        const topIndex = Math.max(0, topLabels.indexOf(top?.data.label ?? ""));
        const w = leaf.x1 - leaf.x0;
        const h = leaf.y1 - leaf.y0;
        const color = seriesColor(topIndex, top?.data.color ?? leaf.data.color);
        const value = toNumber(leaf.value);
        const chain = ancestors
          .slice(0, -1)
          .reverse()
          .map((a) => a.data.label)
          .join(" › ");
        const tip = `${chain}: ${fmt(value)} (${total > 0 ? Math.round((value / total) * PERCENT_FACTOR) : 0}%)`;
        const showLabel = w > MIN_LABEL_W && h > MIN_LABEL_H;
        return (
          <g key={stableKey([leaf.data.label, leaf.x0, leaf.y0], i)}>
            <title>{tip}</title>
            <rect
              x={leaf.x0}
              y={leaf.y0}
              width={w}
              height={h}
              rx={BAR_RADIUS}
              fill={color}
              data-chart-tip={tip}
            />
            {showLabel ? (
              <>
                <text
                  x={leaf.x0 + LABEL_X}
                  y={leaf.y0 + LABEL_DY}
                  fontSize={NODE_FONT_SIZE}
                  fontWeight={FONT_SEMIBOLD}
                  fill="white"
                >
                  {truncateLabel(leaf.data.label, Math.floor(w / CHAR_PER_PX))}
                </text>
                <text
                  x={leaf.x0 + LABEL_X}
                  y={leaf.y0 + VALUE_DY}
                  fontSize={TICK_FONT_SIZE}
                  fill="white"
                  opacity={VALUE_OPACITY}
                >
                  {fmt(value)}
                </text>
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
