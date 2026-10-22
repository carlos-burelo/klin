/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  PERCENT_FACTOR,
} from "../core/theme";
import { CHART_W, ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  computeIcicleLayout,
  ICICLE_DEPTH_DEFAULT,
  ICICLE_H,
  icicleChainOf,
  LABEL_CHAR_PX,
  LABEL_DX,
  LABEL_MIN_PX,
  NODE_FONT_SIZE,
  NODE_LABEL_DY,
  normalizeIcicleGap,
  PARTITION_PAD,
} from "./icicle-chart.compute";
import type { IcicleChartProps } from "./icicle-chart.types";

export type { IcicleBand } from "./icicle-chart.compute";
export {
  computeIcicleLayout,
  MAX_ICICLE_NODES,
  normalizeIcicleGap,
  PARTITION_PAD,
} from "./icicle-chart.compute";
export type { IcicleChartProps, IcicleNode } from "./icicle-chart.types";

/**
 * Icicle SSR (jerarquía por bandas con `d3.partition`).
 */
export function IcicleChart({
  root,
  ariaLabel,
  height = ICICLE_H,
  format,
  locale = DEFAULT_LOCALE,
  depth = ICICLE_DEPTH_DEFAULT,
  showLabels = true,
  showValues = false,
  minLabelWidth = LABEL_MIN_PX,
  gap = PARTITION_PAD,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: IcicleChartProps) {
  if (!root || root.label === "") {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const { bands, total } = computeIcicleLayout(
    root,
    CHART_W,
    height,
    normalizeIcicleGap(gap),
  );
  const maxDepth = toNumber(depth, ICICLE_DEPTH_DEFAULT);
  const minW = Math.max(0, toNumber(minLabelWidth, LABEL_MIN_PX));
  const visible = bands.filter((b) => b.depth <= maxDepth);
  if (isBlank(visible)) {
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
        const chain = icicleChainOf(b);
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
                fill={CHART_TOKEN.onFill}
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
