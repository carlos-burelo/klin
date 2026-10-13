/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleLinear, scalePoint } from "d3-scale";
import { line } from "d3-shape";
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { ChartSvg, CHART_MARGIN as MARGIN, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColors, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Dimensión del paralelo (clave + etiqueta opcional). */
export type ParallelAxis = {
  key: string;
  label?: string;
};

/** Fila del paralelo (etiqueta + valor por dimensión + color opcional). */
export type ParallelRow = {
  label?: string;
  values: Record<string, number>;
  color?: string;
};

/** Props de ParallelCoordinates. */
export type ParallelCoordinatesProps = {
  axes: ParallelAxis[];
  rows: ParallelRow[];
  height?: number;
  ariaLabel: string;
  format?: ValueFormatter;
  locale?: string;
  /** Marca cada cruce eje-fila con punto y tip. */
  showPoints?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

const AXIS_LABEL_OFFSET = 10;
const AXIS_PAD_TOP = 28;
const AXIS_PAD_BOTTOM = 28;
/** Ancho de etiqueta de eje y truncado de vértices. */
const AXIS_LABEL_MAX = 12;
const VERTEX_OPACITY = 0.9;

/**
 * Coordenadas paralelas SSR (multivariado sin interacción). Cada eje se
 * normaliza a su propio [mínimo, máximo]; filas sin ningún valor finito
 * se descartan. Determinista.
 */
export function ParallelCoordinates({
  axes,
  rows,
  height = 300,
  ariaLabel,
  format,
  locale = DEFAULT_LOCALE,
  showPoints = true,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ParallelCoordinatesProps) {
  const clean = rows
    .slice(0, DEFAULT_MAX_ROWS)
    .map((row, i) => {
      const vals = new Map<string, number>();
      for (const a of axes) {
        const v = toNumber(row.values[a.key], Number.NaN);
        if (Number.isFinite(v)) vals.set(a.key, v);
      }
      return { row, vals, index: i };
    })
    .filter((c) => c.vals.size > 0);
  if (isBlank(axes) || isBlank(clean)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);
  const innerW = W - MARGIN.left - MARGIN.right;
  const top = MARGIN.top + AXIS_PAD_TOP;
  const bottom = height - MARGIN.bottom - AXIS_PAD_BOTTOM;
  const x = scalePoint()
    .domain(axes.map((a) => a.key))
    .range([0, innerW])
    .padding(0.5);
  const y = scaleLinear().domain([0, 1]).range([bottom, top]);

  // Dominio por eje sobre valores finitos (constante → punto medio).
  const domains = new Map<string, [number, number]>();
  for (const a of axes) {
    let lo = Number.POSITIVE_INFINITY;
    let hi = Number.NEGATIVE_INFINITY;
    for (const c of clean) {
      const v = c.vals.get(a.key);
      if (v === undefined) continue;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    domains.set(a.key, lo <= hi ? [lo, hi] : [0, 1]);
  }
  const norm = (key: string, v: number): number => {
    const [lo, hi] = domains.get(key) ?? [0, 1];
    if (!(hi > lo)) return 0.5;
    return Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
  };

  const palette = seriesColors(clean.map((c) => ({ color: c.row.color })));
  const legendItems = showLegend
    ? clean.map((c, i) => ({
        label: c.row.label ?? `Fila ${i + 1}`,
        color: palette[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;

  const pathFor = (vals: Map<string, number>) =>
    line<{ key: string; t: number }>()
      .x((p) => MARGIN.left + (x(p.key) ?? 0))
      .y((p) => y(p.t))(
      axes.map((a) => ({ key: a.key, t: norm(a.key, vals.get(a.key) ?? 0) })),
    ) ?? "";

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {axes.map((a, ai) => {
          const ax = MARGIN.left + (x(a.key) ?? 0);
          const [lo, hi] = domains.get(a.key) ?? [0, 1];
          const label = a.label ?? a.key;
          return (
            <g key={stableKey([a.key], ai)}>
              <line
                x1={ax}
                x2={ax}
                y1={top}
                y2={bottom}
                stroke={CHART_TOKEN.border}
                strokeWidth={GRID_WIDTH}
              />
              <text
                x={ax}
                y={top - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{label}</title>
                {truncateLabel(label, AXIS_LABEL_MAX)}
              </text>
              <text
                x={ax}
                y={top - 2}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {fmt(hi)}
              </text>
              <text
                x={ax}
                y={bottom + TICK_FONT_SIZE + 2}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {fmt(lo)}
              </text>
            </g>
          );
        })}
        {clean.map((c, i) => {
          const color = palette[i] ?? CHART_TOKEN.chart1;
          const name = c.row.label ?? `Fila ${i + 1}`;
          const tip = `${name}: ${axes
            .map((a) => {
              const v = c.vals.get(a.key);
              return v === undefined ? null : `${a.label ?? a.key} ${fmt(v)}`;
            })
            .filter((s) => s !== null)
            .join(" · ")}`;
          return (
            <g key={stableKey([name], i)}>
              <title>{tip}</title>
              <path
                d={pathFor(c.vals)}
                fill="none"
                stroke={color}
                strokeWidth={LINE_WIDTH}
                strokeLinecap="round"
                opacity={VERTEX_OPACITY}
                data-chart-tip={tip}
              />
              {showPoints
                ? axes.map((a, ai) => {
                    const v = c.vals.get(a.key);
                    if (v === undefined) return null;
                    const vtip = `${name} · ${a.label ?? a.key}: ${fmt(v)}`;
                    return (
                      <g key={stableKey([a.key], ai)}>
                        <title>{vtip}</title>
                        <circle
                          cx={MARGIN.left + (x(a.key) ?? 0)}
                          cy={y(norm(a.key, v))}
                          r={POINT_RADIUS}
                          fill={color}
                          stroke={CHART_TOKEN.background}
                          strokeWidth={POINT_BORDER}
                          data-chart-tip={vtip}
                        />
                      </g>
                    );
                  })
                : null}
            </g>
          );
        })}
      </ChartSvg>
      {legendItems ? <ChartLegend items={legendItems} /> : null}
    </div>
  );
}
