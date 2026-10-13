/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { sum } from "d3-array";
import { arc, pie } from "d3-shape";
import type { CSSProperties } from "react";
import { resolveFormatter } from "../lib/format";
import { ChartSvg, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  NODE_BORDER_WIDTH,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Separación angular entre pétalos. */
const NIGHTINGALE_PAD_ANGLE = 0.02;
/** Respiro exterior para las etiquetas fuera del coxcomb. */
const NIGHTINGALE_OUTER_PAD = 52;
/** Distancia de la etiqueta al borde del radio máximo. */
const NIGHTINGALE_LABEL_OFFSET = 12;
/** Con más pétalos que este tope, solo la leyenda etiqueta. */
const NIGHTINGALE_MAX_OUTSIDE_LABELS = 12;
/** Umbral del coseno para anclar la etiqueta (inicio/fin/centro). */
const NIGHTINGALE_ANCHOR_COS = 0.3;
/** Radio de esquina y ángulo inicial por defecto (arcos limpios, desde arriba-derecha). */
const NIGHTINGALE_CORNER_DEFAULT = 0;
const NIGHTINGALE_START_DEFAULT = 0;
/** Vuelta completa del coxcomb. */
const NIGHTINGALE_FULL = Math.PI * 2;
/** Tamaño del total al centro y sus desplazamientos. */
const NIGHTINGALE_TOTAL_FONT_SIZE = 22;
const NIGHTINGALE_TOTAL_DY = 4;
const NIGHTINGALE_TOTAL_LABEL_DY = 20;

/** Dato del coxcomb (etiqueta, valor y color opcional). */
export type NightingaleDatum = {
  label: string;
  value: number;
  color?: string;
};

/** Props del coxcomb SSR (ángulos iguales, radio ∝ sqrt del valor). */
export type NightingaleChartProps = {
  data: NightingaleDatum[];
  ariaLabel: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  /** Muestra las etiquetas externas de cada pétalo. */
  showLabels?: boolean;
  /** Agrega el valor a la etiqueta externa (por defecto solo etiqueta). */
  showValues?: boolean;
  /** Ordena los pétalos por valor descendente (por defecto respeta la entrada). */
  sortSlices?: boolean;
  /** Separación angular entre pétalos. */
  padAngle?: number;
  /** Radio de esquina de cada pétalo. */
  cornerRadius?: number;
  /** Ángulo inicial del coxcomb (radianes). */
  startAngle?: number;
  /** Muestra el total al centro del coxcomb. */
  showTotal?: boolean;
  /** Etiqueta bajo el total central. */
  totalLabel?: string;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Coxcomb SSR: ángulos iguales (pie sin orden), radio ∝ sqrt(value)
 * para que el área sea proporcional al valor.
 * Filtra no-finitos y valores <= 0; sin datos o total <= 0 → ChartEmpty.
 */
export function NightingaleChart({
  data,
  ariaLabel,
  height = 260,
  format,
  locale = DEFAULT_LOCALE,
  showLabels = true,
  showValues = false,
  sortSlices = false,
  padAngle = NIGHTINGALE_PAD_ANGLE,
  cornerRadius = NIGHTINGALE_CORNER_DEFAULT,
  startAngle = NIGHTINGALE_START_DEFAULT,
  showTotal = false,
  totalLabel = "Total",
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: NightingaleChartProps) {
  const clean = data
    .slice(0, DEFAULT_MAX_ROWS)
    .map((d) => ({
      label: d.label,
      color: d.color,
      value: Math.max(0, toNumber(d.value)),
    }))
    .filter((d) => d.value > 0);
  const total = sum(clean, (d) => d.value);
  if (clean.length === 0 || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const ordered = sortSlices
    ? [...clean].sort((a, b) => b.value - a.value)
    : clean;

  const fmt = resolveFormatter(format, locale);
  const radius = Math.max(0, Math.min(W, height) / 2 - NIGHTINGALE_OUTER_PAD);
  const top = Math.max(1, ...ordered.map((d) => d.value));
  const cx = W / 2;
  const cy = height / 2;
  const start = toNumber(startAngle, NIGHTINGALE_START_DEFAULT);
  const pad = Math.max(0, toNumber(padAngle, NIGHTINGALE_PAD_ANGLE));
  const corner = Math.max(
    0,
    toNumber(cornerRadius, NIGHTINGALE_CORNER_DEFAULT),
  );
  const slices = pie<(typeof ordered)[number]>()
    .value(() => 1)
    .sort(null)
    .startAngle(start)
    .endAngle(start + NIGHTINGALE_FULL)(ordered);
  const draw = arc().padAngle(pad).cornerRadius(corner);
  const showOutside = ordered.length <= NIGHTINGALE_MAX_OUTSIDE_LABELS;

  return (
    <div
      className={
        className
          ? `flex flex-col items-center ${className}`
          : "flex flex-col items-center"
      }
      style={style}
    >
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <g transform={`translate(${cx},${cy})`}>
          {slices.map((a, i) => {
            const datum = a.data;
            const outer = radius * Math.sqrt(datum.value / top);
            const color = seriesColor(i, datum.color);
            const pct = Math.round((datum.value / total) * PERCENT_FACTOR);
            const tip = `${datum.label}: ${fmt(datum.value)} (${pct}% del total)`;
            const mid = (a.startAngle + a.endAngle) / 2;
            const cos = Math.cos(mid - Math.PI / 2);
            const lx =
              (radius + NIGHTINGALE_LABEL_OFFSET) * Math.cos(mid - Math.PI / 2);
            const ly =
              (radius + NIGHTINGALE_LABEL_OFFSET) * Math.sin(mid - Math.PI / 2);
            return (
              <g key={stableKey([datum.label], i)}>
                <title>{tip}</title>
                <path
                  d={
                    draw({
                      innerRadius: 0,
                      outerRadius: outer,
                      startAngle: a.startAngle,
                      endAngle: a.endAngle,
                    }) ?? ""
                  }
                  fill={color}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={NODE_BORDER_WIDTH}
                  data-chart-tip={tip}
                />
                {showOutside && showLabels ? (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={
                      cos > NIGHTINGALE_ANCHOR_COS
                        ? "start"
                        : cos < -NIGHTINGALE_ANCHOR_COS
                          ? "end"
                          : "middle"
                    }
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    <title>{datum.label}</title>
                    {showValues
                      ? `${truncateLabel(datum.label)} · ${fmt(datum.value)}`
                      : truncateLabel(datum.label)}
                  </text>
                ) : null}
              </g>
            );
          })}
          {showTotal ? (
            <g textAnchor="middle">
              <text
                y={-NIGHTINGALE_TOTAL_DY}
                fontSize={NIGHTINGALE_TOTAL_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {fmt(total)}
              </text>
              <text
                y={NIGHTINGALE_TOTAL_LABEL_DY}
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {totalLabel}
              </text>
            </g>
          ) : null}
        </g>
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={ordered.map((d, i) => ({
            label: `${d.label} · ${fmt(d.value)}`,
            color: seriesColor(i, d.color),
          }))}
        />
      ) : null}
    </div>
  );
}
