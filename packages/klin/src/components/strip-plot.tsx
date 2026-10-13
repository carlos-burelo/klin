/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { CartesianFrame } from "../lib/cartesian";
import { domainWithZero } from "../lib/domain";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { CHART_MARGIN as MARGIN, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColors, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

const GROUP_BAND_PADDING = 0.45;
/** Jitter por defecto (fracción del semiancho de banda). */
const DEFAULT_JITTER = 0.7;
/** Semilla por defecto del jitter determinista. */
const DEFAULT_JITTER_SEED = 42;
/** Opacidad de punto (las acumulaciones se leen por densidad). */
const STRIP_FILL_OPACITY = 0.8;

/** Grupo del strip (etiqueta, muestra y color opcional). */
export type StripGroup = {
  label: string;
  values: number[];
  color?: string;
};

/** Props de StripPlot. */
export type StripPlotProps = {
  groups: StripGroup[];
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  locale?: string;
  /** Dispersión horizontal 0–1 (0 = columna recta). */
  jitter?: number;
  /** Semilla del jitter (mismo seed, mismo dibujo). */
  seed?: number;
  /** Ticks del grid Y (por defecto GRID_TICKS). */
  gridTicks?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * PRNG mulberry32 (determinista: mismo seed, mismos offsets en
 * servidor y cliente). Rango [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let a = toNumber(seed, DEFAULT_JITTER_SEED) >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Desplazamientos horizontales deterministas para una muestra
 * (`halfW` = semiancho útil de banda). Exportado para pruebas.
 */
export function computeStripPositions(
  count: number,
  seed: number,
  halfW: number,
): number[] {
  const rand = mulberry32(seed);
  return Array.from(
    { length: Math.max(0, count) },
    () => (rand() * 2 - 1) * halfW,
  );
}

/**
 * Puntos 1D con jitter determinista por grupo (tira cómica seria:
 * la forma de la distribución se lee sin solapamiento total).
 */
export function StripPlot({
  groups,
  ariaLabel,
  height = 260,
  formatY,
  locale = DEFAULT_LOCALE,
  jitter = DEFAULT_JITTER,
  seed = DEFAULT_JITTER_SEED,
  gridTicks = GRID_TICKS,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: StripPlotProps) {
  const computed = groups
    .slice(0, DEFAULT_MAX_ROWS)
    .map((group) => ({
      group,
      clean: group.values
        .map((v) => toNumber(v, Number.NaN))
        .filter((v) => Number.isFinite(v)),
    }))
    .filter((c) => c.clean.length > 0);
  if (isBlank(computed)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const [lo, hi] = domainWithZero(computed.flatMap((c) => c.clean));
  const fmtY = resolveFormatter(formatY, locale);
  const ticksCount = Math.max(1, Math.round(toNumber(gridTicks, GRID_TICKS)));
  const y = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(ticksCount)
    .range([innerH, 0]);
  const x = scaleBand()
    .domain(computed.map((c) => c.group.label))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const ticks = y.ticks(ticksCount);
  const colors = seriesColors(computed.map((c) => ({ color: c.group.color })));
  const spread = Math.min(1, Math.max(0, toNumber(jitter, DEFAULT_JITTER)));
  const legendItems = showLegend
    ? computed.map((c, i) => ({
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
      annLo={lo}
      annHi={hi}
      xLabels={computed.map((c) => {
        const cx = (x(c.group.label) ?? 0) + x.bandwidth() / 2;
        return {
          x: cx,
          label: truncateLabel(c.group.label),
          title: c.group.label,
        };
      })}
      legendItems={legendItems}
    >
      {computed.map((c, gi) => {
        const cx = MARGIN.left + (x(c.group.label) ?? 0) + x.bandwidth() / 2;
        const halfW = (x.bandwidth() / 2) * spread;
        const offsets = computeStripPositions(c.clean.length, seed + gi, halfW);
        const color = colors[gi] ?? CHART_TOKEN.chart1;
        return (
          <g key={stableKey([c.group.label], gi)}>
            {c.clean.map((v, vi) => {
              const tip = `${c.group.label}: ${fmtY(v)}`;
              return (
                <g key={stableKey([c.group.label, String(vi)], vi)}>
                  <title>{tip}</title>
                  <circle
                    cx={cx + (offsets[vi] ?? 0)}
                    cy={MARGIN.top + y(v)}
                    r={POINT_RADIUS_SCATTER}
                    fill={color}
                    fillOpacity={STRIP_FILL_OPACITY}
                    stroke={CHART_TOKEN.background}
                    strokeWidth={POINT_BORDER}
                    data-chart-tip={tip}
                  />
                </g>
              );
            })}
          </g>
        );
      })}
    </CartesianFrame>
  );
}
