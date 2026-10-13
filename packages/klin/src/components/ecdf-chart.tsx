/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleLinear } from "d3-scale";
import { curveStepAfter, line } from "d3-shape";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { CartesianFrame } from "../lib/cartesian";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { CHART_MARGIN as MARGIN, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { maxFinite, minFinite, toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColors } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  PERCENT_FACTOR,
  POINT_BORDER,
  POINT_RADIUS,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Grupo de la ECDF (etiqueta, muestra y color opcional). */
export type EcdfGroup = {
  label: string;
  values: number[];
  color?: string;
};

/** Props de ECDFChart. */
export type ECDFChartProps = {
  groups: EcdfGroup[];
  ariaLabel: string;
  height?: number;
  formatX?: ValueFormatter;
  /** Formato del eje Y, probabilidad 0–1 (por defecto % entero). */
  formatY?: ValueFormatter;
  locale?: string;
  /** Marca cada escalón con punto y tip. */
  showPoints?: boolean;
  /** Ticks del grid (por defecto GRID_TICKS). */
  gridTicks?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
};

const X_TICKS = 5;

/**
 * Función de distribución empírica SSR (escalones 0–100 %).
 * Determinista; filtra no-finitos.
 */
export function ECDFChart({
  groups,
  ariaLabel,
  height = 260,
  formatX,
  formatY,
  locale = DEFAULT_LOCALE,
  showPoints = false,
  gridTicks = GRID_TICKS,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ECDFChartProps) {
  const clean = groups
    .slice(0, DEFAULT_MAX_ROWS)
    .map((group) => ({
      group,
      sorted: group.values
        .map((v) => toNumber(v, Number.NaN))
        .filter((v) => Number.isFinite(v))
        .sort((a, b) => a - b),
    }))
    .filter((c) => c.sorted.length > 0);
  if (isBlank(clean)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtX = resolveFormatter(formatX, locale);
  const fmtY = formatY ?? ((v: number) => `${Math.round(v * PERCENT_FACTOR)}%`);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const lo = minFinite(clean.flatMap((c) => c.sorted));
  const hi = maxFinite(clean.flatMap((c) => c.sorted));
  const x = scaleLinear()
    .domain([
      Number.isFinite(lo) ? lo : 0,
      Number.isFinite(hi) && hi > lo ? hi : lo + 1,
    ])
    .nice(gridTicks)
    .range([0, innerW]);
  const y = scaleLinear().domain([0, 1]).range([innerH, 0]);
  const ticks = y.ticks(gridTicks);
  const xticks = x.ticks(X_TICKS);
  const colors = seriesColors(clean.map((c) => ({ color: c.group.color })));
  const legendItems = showLegend
    ? clean.map((c, i) => ({
        label: c.group.label,
        color: colors[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;

  return (
    <CartesianFrame
      height={height}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      className={className}
      style={style}
      ticks={ticks}
      y={y}
      formatY={fmtY}
      annotations={annotations}
      annLo={0}
      annHi={1}
      xLabels={xticks.map((t) => ({ x: x(t), label: fmtX(t) }))}
      legendItems={legendItems}
    >
      {clean.map((c, gi) => {
        const color = colors[gi] ?? CHART_TOKEN.chart1;
        const n = c.sorted.length;
        // El escalón arranca en (v0, 0): la curva empieza en probabilidad cero.
        const first = c.sorted[0] ?? 0;
        const pts = [
          { v: first, p: 0 },
          ...c.sorted.map((v, i) => ({ v, p: (i + 1) / n })),
        ];
        const d =
          line<{ v: number; p: number }>()
            .x((p) => x(p.v))
            .y((p) => y(p.p))
            .curve(curveStepAfter)(pts) ?? "";
        return (
          <g key={stableKey([c.group.label], gi)}>
            <title>{`${c.group.label}: n ${n}, mediana ${fmtX(c.sorted[Math.floor((n - 1) / 2)] ?? 0)}`}</title>
            <path
              d={d}
              transform={`translate(${MARGIN.left},${MARGIN.top})`}
              fill="none"
              stroke={color}
              strokeWidth={LINE_WIDTH}
              strokeLinecap="round"
            />
            {showPoints
              ? c.sorted.map((v, pi) => {
                  const p = (pi + 1) / n;
                  const tip = `${c.group.label} · ${fmtX(v)}: ${fmtY(p)}`;
                  return (
                    <g key={stableKey([c.group.label, String(pi)], pi)}>
                      <title>{tip}</title>
                      <circle
                        cx={MARGIN.left + x(v)}
                        cy={MARGIN.top + y(p)}
                        r={POINT_RADIUS}
                        fill={color}
                        stroke={CHART_TOKEN.background}
                        strokeWidth={POINT_BORDER}
                        data-chart-tip={tip}
                      />
                    </g>
                  );
                })
              : null}
          </g>
        );
      })}
    </CartesianFrame>
  );
}
