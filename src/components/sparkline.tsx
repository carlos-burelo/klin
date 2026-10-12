/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { max, min } from "d3-array";
import { scaleLinear } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
import type { CSSProperties } from "react";
import { toNumber } from "../lib/number";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Relleno lateral/vertical, holgura del dominio y estilo de línea/punto. */
const SPARK_PAD = 2;
const SPARK_DOMAIN_PAD_RATIO = 0.1;
const SPARK_AREA_OPACITY = 0.18;
const SPARK_LINE_WIDTH = 1.75;
const SPARK_END_DOT_R = 2.5;

/** Props de la minigráfica SSR para celdas y KPIs. */
export type SparklineProps = {
  values: number[];
  ariaLabel: string;
  width?: number;
  height?: number;
  color?: string;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Minigráfica SSR para celdas de tabla y KPIs (sin ejes).
 */
export function Sparkline({
  values,
  ariaLabel,
  width = 120,
  height = 36,
  color,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: SparklineProps) {
  if (values.length < 2) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  // Conteos: negativos se fijan a 0.
  const counts = values.map((v) => Math.max(0, toNumber(v)));
  const lo = min(counts) ?? 0;
  const hi = max(counts) ?? 1;
  const span = hi - lo || 1;
  const x = scaleLinear()
    .domain([0, counts.length - 1])
    .range([SPARK_PAD, width - SPARK_PAD]);
  const y = scaleLinear()
    .domain([
      lo - span * SPARK_DOMAIN_PAD_RATIO,
      hi + span * SPARK_DOMAIN_PAD_RATIO,
    ])
    .range([height - SPARK_PAD, SPARK_PAD]);

  const pts = counts.map((v, i) => ({ i, v }));
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
  const last = counts[counts.length - 1] ?? 0;
  const tip = `${ariaLabel}: ${formatDefault(last, locale)} (min ${formatDefault(lo, locale)}, max ${formatDefault(hi, locale)})`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className ? `h-auto ${className}` : "h-auto"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{tip}</title>
      <path d={areaPath} fill={stroke} opacity={SPARK_AREA_OPACITY} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={SPARK_LINE_WIDTH}
        strokeLinecap="round"
      />
      <circle
        cx={x(counts.length - 1)}
        cy={y(last)}
        r={SPARK_END_DOT_R}
        fill={stroke}
        data-chart-tip={tip}
      />
    </svg>
  );
}
