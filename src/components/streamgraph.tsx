/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { max } from "d3-array";
import { scaleLinear, scalePoint } from "d3-scale";
import {
  area,
  curveMonotoneX,
  stack,
  stackOffsetWiggle,
  stackOrderInsideOut,
} from "d3-shape";
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import { formatDefault, seriesColor } from "../lib/palette";
import type { ChartSeries } from "../lib/series";
import {
  CHART_TOKEN,
  CHART_WIDTH,
  GRID_WIDTH,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Props del streamgraph. */
export type StreamgraphProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: (value: number) => string;
  locale?: string;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const STREAM_MARGIN = { top: 12, right: 12, bottom: 32, left: 12 } as const;
const DEFAULT_HEIGHT = 280;
const POINT_PADDING = 0.5;
const AXIS_DY = 10;
const LAYER_OPACITY = 0.85;
const FALLBACK_SERIES_COLOR = CHART_TOKEN.chart1;

/**
 * Cómputo puro de capas apiladas (wiggle + inside-out) y dominio Y.
 * Sanitiza valores externos con toNumber para evitar NaN en el stack.
 */
export function computeStreamLayers(
  data: Array<Record<string, string | number>>,
  series: ChartSeries[],
  xKey: string,
): {
  layers: Array<Array<[number, number]>>;
  labels: string[];
  top: number;
  bottom: number;
} {
  const labels = data.map((d) => String(d[xKey] ?? ""));
  const sanitized = data.map((d) => {
    const row: Record<string, string | number> = { ...d };
    for (const s of series) row[s.key] = toNumber(d[s.key]);
    return row;
  });
  const raw = stack<Record<string, string | number>, string>()
    .keys(series.map((s) => s.key))
    .order(stackOrderInsideOut)
    .offset(stackOffsetWiggle)(sanitized);
  const layers: Array<Array<[number, number]>> = raw.map((serie) =>
    serie.map((point): [number, number] => [point[0] ?? 0, point[1] ?? 0]),
  );
  const top = Math.max(1, max(raw, (l) => max(l, (p) => p[1] ?? 0) ?? 0) ?? 1);
  const bottom = Math.min(
    0,
    max(raw, (l) => Math.min(...l.map((p) => p[0] ?? 0))) ?? 0,
  );
  return { layers, labels, top, bottom };
}

/**
 * Streamgraph SSR (capas apiladas con desplazamiento central).
 */
export function Streamgraph({
  data,
  xKey,
  series,
  height = DEFAULT_HEIGHT,
  ariaLabel,
  locale = "es-MX",
  formatY = (v: number) => formatDefault(v, locale),
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: StreamgraphProps) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layers, labels, top, bottom } = computeStreamLayers(
    data,
    series,
    xKey,
  );

  const innerW = CHART_WIDTH - STREAM_MARGIN.left - STREAM_MARGIN.right;
  const innerH = height - STREAM_MARGIN.top - STREAM_MARGIN.bottom;

  const x = scalePoint()
    .domain(labels)
    .range([0, innerW])
    .padding(POINT_PADDING);
  const y = scaleLinear().domain([bottom, top]).range([innerH, 0]);
  const colors = series.map((s, i) => seriesColor(i, s.color));

  return (
    <div className={className} style={style}>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <title>{ariaLabel}</title>
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
              .curve(curveMonotoneX)(layer) ?? "";
          const total = layer.reduce(
            (a, _p, i) => a + toNumber(data[i]?.[serie.key]),
            0,
          );
          const tip = `${serie.label}: total ${formatY(total)}`;
          return (
            <g
              key={stableKey([serie.key], si)}
              transform={`translate(${STREAM_MARGIN.left},${STREAM_MARGIN.top})`}
            >
              <title>{tip}</title>
              <path
                d={d}
                fill={colors[si] ?? FALLBACK_SERIES_COLOR}
                fillOpacity={LAYER_OPACITY}
                stroke={CHART_TOKEN.background}
                strokeWidth={GRID_WIDTH}
                data-chart-tip={tip}
              />
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
