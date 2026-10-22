/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  NODE_BORDER_WIDTH,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../core/theme";
import { CHART_W, ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  circlePackChainOf,
  computeCirclePackLayout,
  PACK_DEPTH_DEFAULT,
  PACK_FILL_OPACITY,
  PACK_H,
  PACK_LABEL_CHAR_PX,
  PACK_LABEL_MAX_DEPTH,
  PACK_LABEL_MIN_D,
  PACK_PAD,
} from "./circle-pack-chart.compute";
import type { CirclePackChartProps } from "./circle-pack-chart.types";

export type { PackBubble } from "./circle-pack-chart.compute";
export {
  computeCirclePackLayout,
  MAX_PACK_NODES,
} from "./circle-pack-chart.compute";
export type {
  CirclePackChartProps,
  CirclePackNode,
} from "./circle-pack-chart.types";

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
  padding = PACK_PAD,
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
  const { bubbles, total } = computeCirclePackLayout(
    root,
    CHART_W,
    height,
    padding,
  );
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
        const chain = circlePackChainOf(b);
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
