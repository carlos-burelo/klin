/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";

import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  EDGE_LABEL_DY,
  EDGE_LABEL_FONT_SIZE,
  FONT_SEMIBOLD,
  NODE_BORDER_WIDTH,
  PERCENT_FACTOR,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import type { SunburstRing } from "./sunburst-chart.compute";
import {
  buildSunburstPath,
  computeSunburstLayout,
  DEFAULT_SIZE,
  DEFAULT_SUNBURST_CORNER_RADIUS,
  DEFAULT_SUNBURST_PAD_ANGLE,
  DEFAULT_SUNBURST_SHOW_ROOT_LABEL,
  HALF_CIRCLE_DEG,
  MIN_ARC_SPAN,
  MIN_RING_W,
  RING_OPACITY,
  RING_PAD,
  resolveSunburstColor,
  SUNBURST_LABEL_MAX,
} from "./sunburst-chart.compute";
import type { SunburstChartProps } from "./sunburst-chart.types";

export type { SunburstRing } from "./sunburst-chart.compute";
export {
  computeSunburstLayout,
  MAX_SUNBURST_RINGS,
} from "./sunburst-chart.compute";
export type { SunburstChartProps, SunburstNode } from "./sunburst-chart.types";

/**
 * Sunburst SSR (jerarquía en anillos con `d3.partition`).
 */
export function SunburstChart({
  data,
  ariaLabel,
  size = DEFAULT_SIZE,
  format,
  locale = DEFAULT_LOCALE,
  depth,
  showRootLabel = DEFAULT_SUNBURST_SHOW_ROOT_LABEL,
  cornerRadius = DEFAULT_SUNBURST_CORNER_RADIUS,
  padAngle = DEFAULT_SUNBURST_PAD_ANGLE,
  showLegend = true,
  showLabels = true,
  itemColor,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: SunburstChartProps) {
  if (isBlank(data)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { rings, root, tops } = computeSunburstLayout(data, size, depth);
  if (isBlank(rings)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fmt = resolveFormatter(format, locale);

  const radius = size / 2;
  const total = toNumber(root.value);
  const path = buildSunburstPath(cornerRadius, padAngle);

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
        <g transform={`translate(${radius},${radius})`}>
          {showRootLabel ? (
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dy={EDGE_LABEL_DY}
              fontSize={EDGE_LABEL_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.foreground}
            >
              {fmt(total)}
            </text>
          ) : null}
          {rings.map((d, i) => {
            const chain = d
              .ancestors()
              .slice(0, -1)
              .reverse()
              .map((a) => a.data.label);
            const topIndex = Math.max(0, tops.indexOf(chain[0] ?? ""));
            const color = resolveSunburstColor(
              topIndex,
              d.data.color,
              d.data,
              d.depth,
              itemColor,
            );
            const value = toNumber(d.value);
            const tip = `${chain.join(" › ")}: ${fmt(value)} (${total > 0 ? Math.round((value / total) * PERCENT_FACTOR) : 0}%)`;
            const midAngle = ((d.x0 ?? 0) + (d.x1 ?? 0)) / 2;
            const midR = ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2;
            const showLabel =
              (d.x1 ?? 0) - (d.x0 ?? 0) > MIN_ARC_SPAN &&
              (d.y1 ?? 0) - (d.y0 ?? 0) > MIN_RING_W;
            return (
              <g key={stableKey([...chain, d.depth], i)}>
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
                {showLabels && showLabel ? (
                  <text
                    x={midR * Math.cos(midAngle - Math.PI / 2)}
                    y={midR * Math.sin(midAngle - Math.PI / 2)}
                    dy={EDGE_LABEL_DY}
                    textAnchor="middle"
                    fontSize={EDGE_LABEL_FONT_SIZE}
                    fill={CHART_TOKEN.onFill}
                    transform={`rotate(${(midAngle * HALF_CIRCLE_DEG) / Math.PI - 90} ${midR * Math.cos(midAngle - Math.PI / 2)} ${midR * Math.sin(midAngle - Math.PI / 2)})`}
                  >
                    {truncateLabel(d.data.label, SUNBURST_LABEL_MAX)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
      {showLegend ? (
        <ChartLegend
          items={data.map((d, i) => ({
            label: `${d.label} · ${fmt(root.children?.[i]?.value ?? 0)}`,
            color: resolveSunburstColor(i, d.color, d, 1, itemColor),
          }))}
        />
      ) : null}
    </div>
  );
}
