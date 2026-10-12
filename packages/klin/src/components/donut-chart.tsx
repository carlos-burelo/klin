/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { sum } from "d3-array";
import { arc, pie } from "d3-shape";
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor } from "../lib/palette";
import {
  CHART_TOKEN,
  FONT_SEMIBOLD,
  NODE_BORDER_WIDTH,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Tamaño del total al centro de la dona. */
const CENTER_VALUE_FONT_SIZE = 22;
/** Desplazamiento vertical del total y de la etiqueta "Total". */
const CENTER_VALUE_DY = 4;
const CENTER_LABEL_DY = 14;

/** Dato de dona/torta (etiqueta, valor y color opcional). */
export type DonutDatum = {
  label: string;
  value: number;
  color?: string;
};

/** Props de la dona SSR (arcos, total al centro y leyenda). */
export type DonutChartProps = {
  data: DonutDatum[];
  ariaLabel: string;
  size?: number;
  thickness?: number;
  format?: ValueFormatter;
  locale?: string;
  /**
   * Color por rebanada. Si retorna `undefined` se usa el color de serie.
   * Se respeta `datum.color` primero.
   */
  itemColor?: (datum: DonutDatum, index: number) => string | undefined;
  totalLabel?: string;
  showTotal?: boolean;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/** Props de la torta SSR (dona sin agujero). */
export type PieChartProps = {
  data: DonutDatum[];
  ariaLabel: string;
  size?: number;
  format?: ValueFormatter;
  locale?: string;
  /**
   * Color por rebanada. Si retorna `undefined` se usa el color de serie.
   * Se respeta `datum.color` primero.
   */
  itemColor?: (datum: DonutDatum, index: number) => string | undefined;
  totalLabel?: string;
  showTotal?: boolean;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Dona SSR: arcos con d3-shape, total al centro, leyenda HTML.
 * Filtra no-finitos y valores <= 0; sin datos o total <= 0 → ChartEmpty.
 */
export function DonutChart({
  data,
  ariaLabel,
  size = 220,
  thickness = 38,
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
  itemColor,
  totalLabel = "Total",
  showTotal = true,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: DonutChartProps) {
  const clean = data
    .map((d) => ({
      label: d.label,
      color: d.color,
      value: toNumber(d.value),
    }))
    .filter((d) => d.value > 0);
  const total = sum(clean, (d) => d.value);
  if (clean.length === 0 || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const radius = size / 2;
  const arcs = pie<(typeof clean)[number]>()
    .value((d) => d.value)
    .sort(null)(clean);
  const path = arc<(typeof arcs)[number]>()
    .innerRadius(radius - thickness)
    .outerRadius(radius);
  const sliceColor = (datum: DonutDatum, i: number) =>
    datum.color ?? itemColor?.(datum, i) ?? seriesColor(i);

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
        <title>{ariaLabel}</title>
        <g transform={`translate(${radius},${radius})`}>
          {arcs.map((a, i) => {
            const datum = a.data;
            const color = sliceColor(datum, i);
            const pct =
              total > 0
                ? Math.round((datum.value / total) * PERCENT_FACTOR)
                : 0;
            const tip = `${datum.label}: ${format(datum.value)} (${pct}% del total)`;
            return (
              <g key={stableKey([datum.label], i)}>
                <title>{tip}</title>
                <path
                  d={path(a) ?? ""}
                  fill={color}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={NODE_BORDER_WIDTH}
                  data-chart-tip={tip}
                />
              </g>
            );
          })}
        </g>
        {showTotal ? (
          <>
            <text
              x={radius}
              y={radius - CENTER_VALUE_DY}
              textAnchor="middle"
              fontSize={CENTER_VALUE_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.foreground}
            >
              {format(total)}
            </text>
            <text
              x={radius}
              y={radius + CENTER_LABEL_DY}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {totalLabel}
            </text>
          </>
        ) : null}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={clean.map((d, i) => ({
            label: `${d.label} · ${format(d.value)}`,
            color: sliceColor(d, i),
          }))}
        />
      ) : null}
    </div>
  );
}

/** Torta SSR (dona sin agujero). */
export function PieChart({
  data,
  ariaLabel,
  size = 220,
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
  itemColor,
  totalLabel = "Total",
  showTotal = true,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: PieChartProps) {
  return (
    <DonutChart
      data={data}
      ariaLabel={ariaLabel}
      size={size}
      thickness={size / 2}
      format={format}
      locale={locale}
      itemColor={itemColor}
      totalLabel={totalLabel}
      showTotal={showTotal}
      showLegend={showLegend}
      className={className}
      style={style}
      ariaDescribedBy={ariaDescribedBy}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
