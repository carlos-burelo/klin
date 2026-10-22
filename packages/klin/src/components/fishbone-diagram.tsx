/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { useId } from "react";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  computeFishboneLayout,
  FISH_ARROW,
  FISH_CAUSE_FONT_SIZE,
  FISH_CAUSE_LABEL_MAX,
  FISH_DEFAULT_H,
  FISH_EFFECT_LABEL_MAX,
  FISH_SUB_LABEL_MAX,
  FISH_TICK_HALF,
  MAX_FISHBONE_CAUSES,
} from "./fishbone-diagram.compute";
import type { FishboneDiagramProps } from "./fishbone-diagram.types";

export {
  MAX_FISHBONE_CAUSES,
  MAX_FISHBONE_SUBCAUSES,
} from "./fishbone-diagram.compute";
export type {
  FishboneCause,
  FishboneCauseLayout,
  FishboneDiagramProps,
  FishboneLayout,
  FishboneLayoutOptions,
  FishboneSide,
  FishboneSubLayout,
} from "./fishbone-diagram.types";
export { computeFishboneLayout };

/**
 * Ishikawa SSR (espina central + diagonales por causa + cabeza efecto).
 */
export function FishboneDiagram({
  effect,
  causes,
  ariaLabel,
  height = FISH_DEFAULT_H,
  locale = DEFAULT_LOCALE,
  format,
  direction = "LR",
  className,
  style,
  ariaDescribedBy,
  showLabels = true,
  showCounts = true,
  sortGroups = false,
  maxItems = MAX_FISHBONE_CAUSES,
  id,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: FishboneDiagramProps) {
  const autoId = useId().replace(/:/g, "");
  if (isBlank(causes) || isBlank(effect)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const markerId = `${(id ?? autoId).replace(/:/g, "")}-fishbone-arrow`;
  const layout = computeFishboneLayout(effect, causes, height, locale, {
    sortGroups,
    maxItems,
    format,
    direction,
  });
  const { width, height: h, spineY } = layout;

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <ChartSvg
        width={width}
        height={h}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
        style={{ minWidth: width }}
      >
        <defs>
          <marker
            id={markerId}
            viewBox={`0 0 ${FISH_ARROW.SIZE} ${FISH_ARROW.SIZE}`}
            refX={FISH_ARROW.REF_X}
            refY={FISH_ARROW.REF_Y}
            markerWidth={FISH_ARROW.WIDTH}
            markerHeight={FISH_ARROW.HEIGHT}
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={CHART_TOKEN.muted} />
          </marker>
        </defs>
        <line
          x1={layout.spineX1}
          x2={layout.spineX2}
          y1={spineY}
          y2={spineY}
          stroke={CHART_TOKEN.muted}
          strokeWidth={EDGE_WIDTH}
          markerEnd={`url(#${markerId})`}
        />
        {layout.causes.map((cause, i) => (
          <g key={stableKey([cause.label], i)}>
            <line
              x1={cause.attachX}
              y1={spineY}
              x2={cause.outerX}
              y2={cause.outerY}
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
              data-chart-tip={cause.tip}
            />
            {cause.subs.map((sub, k) => (
              <g key={stableKey([cause.label, sub.label], k)}>
                <line
                  x1={sub.x - FISH_TICK_HALF}
                  x2={sub.x + FISH_TICK_HALF}
                  y1={sub.y}
                  y2={sub.y}
                  stroke={CHART_TOKEN.muted}
                  strokeWidth={EDGE_WIDTH}
                />
                {showLabels ? (
                  <text
                    x={sub.x}
                    y={sub.y + (cause.side === "top" ? -6 : 14)}
                    textAnchor="middle"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {truncateLabel(sub.label, FISH_SUB_LABEL_MAX)}
                  </text>
                ) : null}
              </g>
            ))}
            {showLabels ? (
              <text
                x={cause.outerX}
                y={cause.outerY + (cause.side === "top" ? -8 : 18)}
                textAnchor="middle"
                fontSize={FISH_CAUSE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(cause.label, FISH_CAUSE_LABEL_MAX)}
              </text>
            ) : null}
            {showCounts && cause.hidden > 0 ? (
              <text
                x={cause.outerX}
                y={cause.outerY + (cause.side === "top" ? -22 : 32)}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {`+${cause.hidden.toLocaleString(locale)} más`}
              </text>
            ) : null}
          </g>
        ))}
        <g>
          <rect
            x={layout.head.x}
            y={layout.head.y}
            width={layout.head.w}
            height={layout.head.h}
            rx={layout.head.h / 2}
            fill={CHART_TOKEN.card}
            stroke={CHART_TOKEN.border}
            strokeWidth={EDGE_WIDTH}
            data-chart-tip={layout.effect}
          />
          <text
            x={layout.head.x + layout.head.w / 2}
            y={spineY}
            dy={4}
            textAnchor="middle"
            fontSize={FISH_CAUSE_FONT_SIZE}
            fontWeight={FONT_SEMIBOLD}
            fill={CHART_TOKEN.foreground}
          >
            {truncateLabel(layout.effect, FISH_EFFECT_LABEL_MAX)}
          </text>
        </g>
      </ChartSvg>
    </div>
  );
}
