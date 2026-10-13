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
/** Vuelta completa en radianes (rotación de rebanadas). */
const TAU = Math.PI * 2;
/** Longitud mínima de arco (px) para pintar el % dentro de la rebanada. */
const INNER_LABEL_MIN_ARC = 30;

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
  /**
   * Ángulo inicial de la primera rebanada en radianes (0 = arriba).
   * @default 0
   */
  startAngle?: number;
  /**
   * Separación entre rebanadas en radianes.
   * @default 0
   */
  padAngle?: number;
  /**
   * Ordena las rebanadas de mayor a menor (por defecto respeta la entrada).
   * @default false
   */
  sortSlices?: boolean;
  /**
   * Radio de esquina de los arcos (0 = bordes rectos).
   * @default 0
   */
  cornerRadius?: number;
  /**
   * Etiqueta dentro de la rebanada: el % solo si el arco es grande.
   * @default "none"
   */
  innerLabels?: "none" | "percent";
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
  /**
   * Ángulo inicial de la primera rebanada en radianes (0 = arriba).
   * @default 0
   */
  startAngle?: number;
  /**
   * Separación entre rebanadas en radianes.
   * @default 0
   */
  padAngle?: number;
  /**
   * Ordena las rebanadas de mayor a menor (por defecto respeta la entrada).
   * @default false
   */
  sortSlices?: boolean;
  /**
   * Radio de esquina de los arcos (0 = bordes rectos).
   * @default 0
   */
  cornerRadius?: number;
  /**
   * Etiqueta dentro de la rebanada: el % solo si el arco es grande.
   * @default "none"
   */
  innerLabels?: "none" | "percent";
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
  startAngle = 0,
  padAngle = 0,
  sortSlices = false,
  cornerRadius = 0,
  innerLabels = "none",
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: DonutChartProps) {
  const clean = data
    .map((d, index) => ({
      label: d.label,
      color: d.color,
      value: toNumber(d.value),
      index,
    }))
    .filter((d) => d.value > 0);
  const total = sum(clean, (d) => d.value);
  if (clean.length === 0 || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const start = toNumber(startAngle);
  const pad = Math.max(0, toNumber(padAngle));
  const corners = Math.max(0, toNumber(cornerRadius));
  const radius = size / 2;
  const ordered = sortSlices
    ? [...clean].sort((a, b) => b.value - a.value)
    : clean;
  const pieGen = pie<(typeof ordered)[number]>()
    .value((d) => d.value)
    .padAngle(pad)
    .startAngle(start)
    .endAngle(start + TAU)
    .sort(null);
  const arcs = pieGen(ordered);
  const path = arc<(typeof arcs)[number]>()
    .innerRadius(radius - thickness)
    .outerRadius(radius)
    .cornerRadius(corners);
  const midRadius = radius - thickness / 2;
  const withInner = innerLabels === "percent";
  const sliceColor = (datum: (typeof clean)[number]) =>
    datum.color ?? itemColor?.(datum, datum.index) ?? seriesColor(datum.index);

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
            const color = sliceColor(datum);
            const pct =
              total > 0
                ? Math.round((datum.value / total) * PERCENT_FACTOR)
                : 0;
            const tip = `${datum.label}: ${format(datum.value)} (${pct}% del total)`;
            const fitsInner =
              withInner &&
              midRadius > 0 &&
              (a.endAngle - a.startAngle) * midRadius >= INNER_LABEL_MIN_ARC;
            const [innerX, innerY] = fitsInner ? path.centroid(a) : [0, 0];
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
                {fitsInner ? (
                  <text
                    x={innerX}
                    y={innerY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.background}
                  >
                    {pct}%
                  </text>
                ) : null}
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
          items={clean.map((d) => ({
            label: `${d.label} · ${format(d.value)}`,
            color: sliceColor(d),
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
  startAngle = 0,
  padAngle = 0,
  sortSlices = false,
  cornerRadius = 0,
  innerLabels = "none",
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
      startAngle={startAngle}
      padAngle={padAngle}
      sortSlices={sortSlices}
      cornerRadius={cornerRadius}
      innerLabels={innerLabels}
      showLegend={showLegend}
      className={className}
      style={style}
      ariaDescribedBy={ariaDescribedBy}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
