import { max, min } from "d3-array";
import { scaleLinear } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";

/**
 * Minigráfica SSR para celdas de tabla y KPIs (sin ejes).
 */
export function Sparkline({
  values,
  ariaLabel,
  width = 120,
  height = 36,
  color,
  emptyTitle = "Sin datos",
}: {
  values: number[];
  ariaLabel: string;
  width?: number;
  height?: number;
  color?: string;
  emptyTitle?: string;
}) {
  if (values.length < 2) {
    return <ChartEmpty title={emptyTitle} />;
  }

  const lo = min(values) ?? 0;
  const hi = max(values) ?? 1;
  const span = hi - lo || 1;
  const x = scaleLinear()
    .domain([0, values.length - 1])
    .range([2, width - 2]);
  const y = scaleLinear()
    .domain([lo - span * 0.1, hi + span * 0.1])
    .range([height - 2, 2]);

  const pts = values.map((v, i) => ({ i, v }));
  const stroke = seriesColor(0, color);
  const linePath =
    line<{ i: number; v: number }>()
      .x((p) => x(p.i))
      .y((p) => y(p.v))
      .curve(curveMonotoneX)(pts) ?? "";
  const areaPath =
    area<{ i: number; v: number }>()
      .x((p) => x(p.i))
      .y0(height)
      .y1((p) => y(p.v))
      .curve(curveMonotoneX)(pts) ?? "";
  const last = values[values.length - 1] ?? 0;
  const tip = `${ariaLabel}: ${formatDefault(last)} (min ${formatDefault(lo)}, max ${formatDefault(hi)})`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="h-auto"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{tip}</title>
      <path d={areaPath} fill={stroke} opacity={0.18} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <circle
        cx={x(values.length - 1)}
        cy={y(last)}
        r={2.5}
        fill={stroke}
        data-chart-tip={tip}
      />
    </svg>
  );
}
