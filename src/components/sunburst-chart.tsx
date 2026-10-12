/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import {
  type HierarchyRectangularNode,
  hierarchy,
  partition,
} from "d3-hierarchy";
import { arc } from "d3-shape";
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_LEAVES } from "../lib/limits";
import { toNumber } from "../lib/number";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  EDGE_LABEL_DY,
  EDGE_LABEL_FONT_SIZE,
  NODE_BORDER_WIDTH,
  PERCENT_FACTOR,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

export type SunburstNode = {
  label: string;
  value?: number;
  color?: string;
  children?: SunburstNode[];
};

/** Props del sunburst. */
export type SunburstChartProps = {
  data: SunburstNode[];
  ariaLabel: string;
  size?: number;
  formatValue?: (value: number) => string;
  locale?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/** Cap de anillos (alias de DEFAULT_MAX_LEAVES, compat). */
export const MAX_SUNBURST_RINGS = DEFAULT_MAX_LEAVES;

const DEFAULT_SIZE = 300;
const RING_PAD = 8;
const MIN_ARC_SPAN = 0.35;
const MIN_RING_W = 22;
const RING_OPACITY = 0.75;
const FULL_CIRCLE = 2 * Math.PI;
const HALF_CIRCLE_DEG = 180;

type SunburstDatum = {
  label: string;
  value?: number;
  color?: string;
  children?: SunburstNode[];
};

export type SunburstRing = HierarchyRectangularNode<SunburstDatum>;

/**
 * Cómputo puro del layout sunburst (partición radial).
 * Trunca a los N anillos de mayor valor para SSR.
 */
export function computeSunburstLayout(data: SunburstNode[], size: number) {
  const root = hierarchy<SunburstDatum>({ label: "root", children: data })
    .sum((d) => toNumber(d.value))
    .sort((a, b) => toNumber(b.value) - toNumber(a.value));
  const proot = partition<SunburstDatum>().size([FULL_CIRCLE, size / 2])(root);
  const rings = (
    proot
      .descendants()
      .filter((d) => d.depth > 0 && toNumber(d.value) > 0) as SunburstRing[]
  )
    .sort((a, b) => toNumber(b.value) - toNumber(a.value))
    .slice(0, MAX_SUNBURST_RINGS);
  const tops = data.map((d) => d.label);
  return { rings, root, tops };
}

/**
 * Sunburst SSR (jerarquía en anillos con `d3.partition`).
 */
export function SunburstChart({
  data,
  ariaLabel,
  size = DEFAULT_SIZE,
  formatValue,
  locale = "es-MX",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: SunburstChartProps) {
  if (data.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { rings, root, tops } = computeSunburstLayout(data, size);
  if (rings.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fmt = formatValue ?? ((v: number) => formatDefault(v, locale));

  const radius = size / 2;
  const total = toNumber(root.value);
  const path = arc<SunburstRing>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1);

  return (
    <div
      className={
        className
          ? `flex flex-col items-center ${className}`
          : "flex flex-col items-center"
      }
      style={style}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="h-auto max-w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <title>{ariaLabel}</title>
        <g transform={`translate(${radius},${radius})`}>
          {rings.map((d, i) => {
            const chain = d
              .ancestors()
              .slice(0, -1)
              .reverse()
              .map((a) => a.data.label);
            const topIndex = Math.max(0, tops.indexOf(chain[0] ?? ""));
            const color = seriesColor(topIndex, d.data.color);
            const value = toNumber(d.value);
            const tip = `${chain.join(" › ")}: ${fmt(value)} (${total > 0 ? Math.round((value / total) * PERCENT_FACTOR) : 0}%)`;
            const midAngle = ((d.x0 ?? 0) + (d.x1 ?? 0)) / 2;
            const midR = ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2;
            const showLabel =
              (d.x1 ?? 0) - (d.x0 ?? 0) > MIN_ARC_SPAN &&
              (d.y1 ?? 0) - (d.y0 ?? 0) > MIN_RING_W;
            return (
              <g key={stableKey([...chain, d.depth], i)}>
                <title>{tip}</title>
                <path
                  d={
                    path({
                      ...d,
                      y0: d.y0 + RING_PAD,
                    } as SunburstRing) ?? ""
                  }
                  fill={color}
                  fillOpacity={d.depth === 1 ? 1 : RING_OPACITY}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={NODE_BORDER_WIDTH}
                  data-chart-tip={tip}
                />
                {showLabel ? (
                  <text
                    x={midR * Math.cos(midAngle - Math.PI / 2)}
                    y={midR * Math.sin(midAngle - Math.PI / 2)}
                    dy={EDGE_LABEL_DY}
                    textAnchor="middle"
                    fontSize={EDGE_LABEL_FONT_SIZE}
                    fill="white"
                    transform={`rotate(${(midAngle * HALF_CIRCLE_DEG) / Math.PI - 90} ${midR * Math.cos(midAngle - Math.PI / 2)} ${midR * Math.sin(midAngle - Math.PI / 2)})`}
                  >
                    {truncateLabel(d.data.label, 12)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
      <ChartLegend
        items={data.map((d, i) => ({
          label: `${d.label} · ${fmt(root.children?.[i]?.value ?? 0)}`,
          color: seriesColor(i, d.color),
        }))}
      />
    </div>
  );
}
