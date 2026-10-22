/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import type { CurveFactory } from "d3-shape";
import { area } from "d3-shape";
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";

import {
  CHART_TOKEN,
  CHART_WIDTH,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  POINT_RADIUS,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  AXIS_DY,
  computeStreamLayers,
  DEFAULT_HEIGHT,
  FALLBACK_SERIES_COLOR,
  LAYER_OPACITY,
  resolveStreamCurve,
  STREAM_MARGIN,
  streamScales,
} from "./streamgraph.compute";
import type { StreamgraphProps } from "./streamgraph.types";

export type { StreamOrderKind } from "./streamgraph.compute";
export { computeStreamLayers } from "./streamgraph.compute";
export type { StreamgraphProps } from "./streamgraph.types";

/**
 * Streamgraph SSR (capas apiladas con desplazamiento central).
 */
export function Streamgraph({
  data,
  xKey,
  series,
  height = DEFAULT_HEIGHT,
  ariaLabel,
  locale = DEFAULT_LOCALE,
  formatY,
  curve = "monotone",
  offset = "wiggle",
  order = "insideOut",
  showPoints = false,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: StreamgraphProps) {
  if (isBlank(data) || isBlank(series)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layers, labels, top, bottom } = computeStreamLayers(
    data,
    series,
    xKey,
    offset,
    order,
  );

  const innerW = CHART_WIDTH - STREAM_MARGIN.left - STREAM_MARGIN.right;
  const innerH = height - STREAM_MARGIN.top - STREAM_MARGIN.bottom;

  const { x, y } = streamScales(labels, bottom, top, innerW, innerH);
  const fmtY = resolveFormatter(formatY, locale);
  const colors = series.map((s, i) => seriesColor(i, s.color));
  const streamCurve = resolveStreamCurve(curve);

  return (
    <div className={className} style={style}>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {labels.map((label, li) => (
          <text
            key={stableKey([label], li)}
            x={STREAM_MARGIN.left + (x(label) ?? 0)}
            y={height - AXIS_DY}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {label}
          </text>
        ))}
        {layers.map((layer, si) => {
          const serie = series[si];
          if (!serie) return null;
          const d =
            area<[number, number]>()
              .x((_, i) => x(labels[i] ?? "") ?? 0)
              .y0((p) => y(p[0]))
              .y1((p) => y(p[1]))
              .curve(streamCurve as CurveFactory)(layer) ?? "";
          const total = layer.reduce(
            (a, _p, i) => a + toNumber(data[i]?.[serie.key]),
            0,
          );
          const tip = `${serie.label}: total ${fmtY(total)}`;
          return (
            <g
              key={stableKey([serie.key], si)}
              transform={`translate(${STREAM_MARGIN.left},${STREAM_MARGIN.top})`}
            >
              <path
                d={d}
                fill={colors[si] ?? FALLBACK_SERIES_COLOR}
                fillOpacity={LAYER_OPACITY}
                stroke={CHART_TOKEN.background}
                strokeWidth={GRID_WIDTH}
                data-chart-tip={tip}
              />
              {showPoints
                ? layer.map((p, pi) => (
                    <circle
                      key={stableKey([serie.key, labels[pi] ?? ""], pi)}
                      cx={x(labels[pi] ?? "") ?? 0}
                      cy={y(p[1] ?? 0)}
                      r={POINT_RADIUS}
                      fill={colors[si] ?? FALLBACK_SERIES_COLOR}
                      stroke={CHART_TOKEN.background}
                      strokeWidth={GRID_WIDTH}
                    />
                  ))
                : null}
            </g>
          );
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={series.map((s, i) => ({
            label: s.label,
            color: colors[i] ?? FALLBACK_SERIES_COLOR,
          }))}
        />
      ) : null}
    </div>
  );
}
