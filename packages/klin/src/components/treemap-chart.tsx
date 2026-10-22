/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  CHART_WIDTH,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { fitText } from "../render/measure";
import {
  computeTreemapLayout,
  DEFAULT_TREEMAP_SHOW_VALUES,
  DEFAULT_TREEMAP_TILING,
  LABEL_DY,
  LABEL_X,
  MIN_LABEL_H,
  MIN_LABEL_W,
  NODE_FONT_SIZE,
  normalizeTreemapGap,
  resolveTreemapColor,
  TREEMAP_GAP,
  TREEMAP_H,
  VALUE_DY,
  VALUE_OPACITY,
} from "./treemap-chart.compute";
import type { TreemapChartProps } from "./treemap-chart.types";

export type { TreemapLeaf } from "./treemap-chart.compute";
export {
  computeTreemapLayout,
  MAX_TREEMAP_LEAVES,
  normalizeTreemapGap,
  TREEMAP_GAP,
} from "./treemap-chart.compute";
export type { TreemapChartProps, TreemapNode } from "./treemap-chart.types";

/**
 * Mapa rectangular SSR (jerarquías por área). Hojas con etiqueta si caben.
 */
export function TreemapChart({
  data,
  ariaLabel,
  height = TREEMAP_H,
  format,
  locale = DEFAULT_LOCALE,
  tiling = DEFAULT_TREEMAP_TILING,
  showValues = DEFAULT_TREEMAP_SHOW_VALUES,
  minLabelArea,
  depthColors,
  showLegend = false,
  gap = TREEMAP_GAP,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: TreemapChartProps) {
  if (isBlank(data)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { leaves, topLabels } = computeTreemapLayout(
    data,
    tiling,
    height,
    normalizeTreemapGap(gap),
  );
  if (isBlank(leaves)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fmt = resolveFormatter(format, locale);
  const total = leaves.reduce((acc, l) => acc + toNumber(l.value), 0);

  const svg = (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${height}`}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {leaves.map((leaf, i) => {
        const ancestors = leaf.ancestors();
        const top = ancestors[ancestors.length - 2];
        const topIndex = Math.max(0, topLabels.indexOf(top?.data.label ?? ""));
        const w = leaf.x1 - leaf.x0;
        const h = leaf.y1 - leaf.y0;
        const color = resolveTreemapColor(
          topIndex,
          top?.data.color,
          leaf.data.color,
          leaf.depth,
          depthColors,
        );
        const value = toNumber(leaf.value);
        const chain = ancestors
          .slice(0, -1)
          .reverse()
          .map((a) => a.data.label)
          .join(" › ");
        const tip = `${chain}: ${fmt(value)} (${total > 0 ? Math.round((value / total) * PERCENT_FACTOR) : 0}%)`;
        const showLabel =
          minLabelArea === undefined
            ? w > MIN_LABEL_W && h > MIN_LABEL_H
            : w * h >= minLabelArea;
        const availW = w - LABEL_X * 2;
        const labelText = showLabel
          ? fitText(leaf.data.label, availW, NODE_FONT_SIZE)
          : "";
        const valueText =
          showLabel && showValues
            ? fitText(fmt(value), availW, TICK_FONT_SIZE)
            : "";
        return (
          <g key={stableKey([leaf.data.label, leaf.x0, leaf.y0], i)}>
            <rect
              x={leaf.x0}
              y={leaf.y0}
              width={w}
              height={h}
              rx={BAR_RADIUS}
              fill={color}
              data-chart-tip={tip}
            />
            {labelText ? (
              <>
                <text
                  x={leaf.x0 + LABEL_X}
                  y={leaf.y0 + LABEL_DY}
                  fontSize={NODE_FONT_SIZE}
                  fontWeight={FONT_SEMIBOLD}
                  fill={CHART_TOKEN.onFill}
                >
                  {labelText}
                </text>
                {valueText ? (
                  <text
                    x={leaf.x0 + LABEL_X}
                    y={leaf.y0 + VALUE_DY}
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.onFill}
                    opacity={VALUE_OPACITY}
                  >
                    {valueText}
                  </text>
                ) : null}
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );

  if (!showLegend) return svg;
  return (
    <div className="flex flex-col items-center">
      {svg}
      <ChartLegend
        items={data.map((d, i) => ({
          label: d.label,
          color: resolveTreemapColor(i, d.color, undefined, 1, depthColors),
        }))}
      />
    </div>
  );
}
