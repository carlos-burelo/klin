import { max } from "d3-array";
import { scaleLinear, scalePoint } from "d3-scale";
import {
  area,
  curveMonotoneX,
  stack,
  stackOffsetWiggle,
  stackOrderInsideOut,
} from "d3-shape";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type StreamSeries = {
  key: string;
  label: string;
  color?: string;
};

const W = 640;
const MARGIN = { top: 12, right: 12, bottom: 32, left: 12 };

/**
 * Streamgraph SSR (capas apiladas con desplazamiento central).
 */
export function Streamgraph({
  data,
  xKey,
  series,
  height = 280,
  ariaLabel,
  formatY = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: StreamSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const labels = data.map((d) => String(d[xKey] ?? ""));

  const layers = stack<Record<string, string | number>, string>()
    .keys(series.map((s) => s.key))
    .order(stackOrderInsideOut)
    .offset(stackOffsetWiggle)(data);
  const top = Math.max(1, max(layers, (l) => max(l, (p) => p[1]) ?? 0) ?? 1);
  const bottom = Math.min(
    0,
    max(layers, (l) => Math.min(...l.map((p) => p[0]))) ?? 0,
  );

  const x = scalePoint().domain(labels).range([0, innerW]).padding(0.5);
  const y = scaleLinear().domain([bottom, top]).range([innerH, 0]);
  const colors = series.map((s, i) => seriesColor(i, s.color));

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        {labels.map((label) => (
          <text
            key={label}
            x={MARGIN.left + (x(label) ?? 0)}
            y={height - 10}
            textAnchor="middle"
            fontSize={11}
            fill="var(--color-muted-foreground)"
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
              .curve(curveMonotoneX)(layer as unknown as [number, number][]) ??
            "";
          const total = layer.reduce(
            (a, _p, i) => a + (Number(data[i]?.[serie.key] ?? 0) || 0),
            0,
          );
          const tip = `${serie.label}: total ${formatY(total)}`;
          return (
            <g
              key={serie.key}
              transform={`translate(${MARGIN.left},${MARGIN.top})`}
            >
              <title>{tip}</title>
              <path
                d={d}
                fill={colors[si]}
                fillOpacity={0.85}
                stroke="var(--background)"
                strokeWidth={1}
                data-chart-tip={tip}
              />
            </g>
          );
        })}
      </svg>
      <ChartLegend
        items={series.map((s, i) => ({
          label: s.label,
          color: colors[i] ?? "var(--chart-1)",
        }))}
      />
    </div>
  );
}
