/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { forceCollide, forceSimulation, forceX, forceY } from "d3-force";
import { scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import { domainWithZero } from "../lib/domain";
import { resolveFormatter } from "../lib/format";
import { ChartSvg, CHART_MARGIN as MARGIN, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  NETWORK_SEED,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type BeeswarmPoint = {
  value: number;
  label?: string;
  color?: string;
};

/** Props de BeeswarmPlot. */
export type BeeswarmPlotProps = {
  points: BeeswarmPoint[];
  ariaLabel: string;
  radius?: number;
  height?: number;
  formatX?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  /** Recorte fijo del dominio X [min, max] (indefinido = automático con cero). */
  domain?: [number, number];
  /** Ticks del eje X (por defecto BEESWARM_X_TICKS). */
  gridTicks?: number;
  /** Muestra el valor sobre cada punto. */
  showValues?: boolean;
  /** Muestra el tamaño de muestra (n) junto al eje. */
  showSampleSize?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export type PositionedBeeswarmPoint = BeeswarmPoint & {
  x: number;
  y: number;
};

const BEESWARM_TICKS = 300;
const BEESWARM_FORCE_X = 1;
const BEESWARM_FORCE_Y = 0.1;
const BEESWARM_COLLIDE_PAD = 1;
const BEESWARM_X_TICKS = 5;
const BEESWARM_AXIS_LABEL_OFFSET = 10;
/** Mínimo de ticks y separación de la etiqueta de valor. */
const TICKS_MIN = 1;
const VALUE_LABEL_GAP = 4;

/** LCG determinista: mismo enjambre, mismo dibujo (SSR estable). */
function seededRandom(seed: number): () => number {
  const LCG_MULT = 1664525;
  const LCG_INCR = 1013904223;
  const LCG_MOD = 4294967296;
  let s = seed >>> 0;
  return () => {
    s = (s * LCG_MULT + LCG_INCR) >>> 0;
    return s / LCG_MOD;
  };
}

/** Escala X lineal del enjambre (dominio honesto con cero o recorte fijo). */
function beeswarmScale(
  values: number[],
  innerW: number,
  domain?: [number, number],
) {
  const auto = domainWithZero(values);
  const fixedLo =
    domain === undefined ? Number.NaN : toNumber(domain[0], Number.NaN);
  const fixedHi =
    domain === undefined ? Number.NaN : toNumber(domain[1], Number.NaN);
  const lo = Number.isFinite(fixedLo) ? fixedLo : auto[0];
  const hi = Number.isFinite(fixedHi) ? fixedHi : auto[1];
  return scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(GRID_TICKS)
    .range([0, innerW]);
}

/**
 * Cómputo puro de posiciones (fuerza X al valor escalado, Y al centro,
 * colisión radio+1; BEESWARM_TICKS ticks con semilla fija).
 * Trunca determinista a los primeros DEFAULT_MAX_ROWS puntos para SSR.
 */
export function computeBeeswarmPositions(
  points: BeeswarmPoint[],
  innerW: number,
  innerH: number,
  radius = POINT_RADIUS_SCATTER,
  seed = NETWORK_SEED,
  domain?: [number, number],
): PositionedBeeswarmPoint[] {
  const r = Math.max(0, toNumber(radius, POINT_RADIUS_SCATTER));
  const clean: BeeswarmPoint[] = [];
  for (const p of points) {
    const value = toNumber(p.value, Number.NaN);
    if (!Number.isFinite(value)) continue;
    clean.push({ value, label: p.label, color: p.color });
    if (clean.length >= DEFAULT_MAX_ROWS) break;
  }
  if (clean.length === 0 || !(innerW > 0) || !(innerH > 0)) return [];

  const x = beeswarmScale(
    clean.map((p) => p.value),
    innerW,
    domain,
  );
  const centerY = innerH / 2;
  type SimNode = {
    value: number;
    label?: string;
    color?: string;
    x: number;
    y: number;
  };
  const simNodes: SimNode[] = clean.map((p) => ({
    ...p,
    x: x(p.value),
    y: centerY,
  }));
  const sim = forceSimulation(simNodes)
    .randomSource(seededRandom(seed))
    .force("x", forceX<SimNode>((d) => x(d.value)).strength(BEESWARM_FORCE_X))
    .force("y", forceY<SimNode>(centerY).strength(BEESWARM_FORCE_Y))
    .force("collide", forceCollide<SimNode>(r + BEESWARM_COLLIDE_PAD))
    .stop();
  for (let i = 0; i < BEESWARM_TICKS; i++) sim.tick();

  return simNodes.map((n) => ({
    value: n.value,
    label: n.label,
    color: n.color,
    x: n.x,
    y: Math.min(Math.max(n.y, r), innerH - r),
  }));
}

/**
 * Enjambre SSR (un valor por punto sobre un eje X lineal; la Y solo
 * desempata colisiones con física determinista). Filtra no-finitos.
 */
export function BeeswarmPlot({
  points,
  ariaLabel,
  radius = POINT_RADIUS_SCATTER,
  height = 260,
  formatX,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  domain,
  gridTicks = BEESWARM_X_TICKS,
  showValues = false,
  showSampleSize = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: BeeswarmPlotProps) {
  const r = Math.max(0, toNumber(radius, POINT_RADIUS_SCATTER));
  const finite = points
    .map((p) => toNumber(p.value, Number.NaN))
    .filter((v) => Number.isFinite(v));
  if (finite.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtX = resolveFormatter(formatX, locale);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(gridTicks, BEESWARM_X_TICKS)),
  );
  const x = beeswarmScale(finite, innerW, domain);
  const ticks = x.ticks(safeTicks);
  const positioned = computeBeeswarmPositions(
    points,
    innerW,
    innerH,
    r,
    NETWORK_SEED,
    domain,
  );
  const axisY = MARGIN.top + innerH;

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <line
          x1={MARGIN.left}
          x2={W - MARGIN.right}
          y1={axisY}
          y2={axisY}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
        />
        {ticks.map((t) => (
          <text
            key={t}
            x={MARGIN.left + x(t)}
            y={height - BEESWARM_AXIS_LABEL_OFFSET}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {fmtX(t)}
          </text>
        ))}
        {positioned.map((p, i) => {
          const color = seriesColor(i, p.color);
          const tip = p.label ? `${p.label}: ${fmtX(p.value)}` : fmtX(p.value);
          return (
            <g key={stableKey([p.label ?? p.value], i)}>
              <title>{tip}</title>
              <circle
                cx={MARGIN.left + p.x}
                cy={MARGIN.top + p.y}
                r={r}
                fill={color}
                stroke={CHART_TOKEN.background}
                strokeWidth={POINT_BORDER}
                data-chart-tip={tip}
              />
              {showValues ? (
                <text
                  x={MARGIN.left + p.x}
                  y={MARGIN.top + p.y - r - VALUE_LABEL_GAP}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.foreground}
                >
                  {fmtX(p.value)}
                </text>
              ) : null}
            </g>
          );
        })}
        {showSampleSize ? (
          <text
            x={W - MARGIN.right}
            y={MARGIN.top + TICK_FONT_SIZE}
            textAnchor="end"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {`n = ${finite.length}`}
          </text>
        ) : null}
      </ChartSvg>
    </div>
  );
}
