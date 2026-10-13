/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max, min } from "d3-array";
import { hexbin } from "d3-hexbin";
import { type ScaleLinear, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import { resolveFormatter } from "../lib/format";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
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
  POINT_BORDER,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { pctOf } from "../lib/tips";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Punto del agregado hexagonal (coordenadas de datos). */
export type HexPoint = {
  x: number;
  y: number;
};

/** Celda hexagonal agregada (centro en píxeles + conteo). */
export type HexCell = {
  x: number;
  y: number;
  count: number;
};

/** Radio por defecto y radio mínimo aceptado. */
const DEFAULT_HEX_RADIUS = 12;
const MIN_HEX_RADIUS = 2;
/** Opacidad base de celda + tramo proporcional al conteo. */
const HEX_MIN_OPACITY = 0.15;
const HEX_OPACITY_SPAN = 0.75;
/** Ticks del eje X y posición de sus etiquetas. */
const X_TICKS = 5;
const X_TICK_LABEL_OFFSET = 18;
/** Rango mínimo cuando el dominio colapsa a un punto. */
const UNIT_RANGE = 1;

/** Props de HexbinPlot. */
export type HexbinPlotProps = {
  points: HexPoint[];
  ariaLabel: string;
  radius?: number;
  height?: number;
  formatValue?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Muestra etiquetas de ticks de los ejes. */
  showLabels?: boolean;
  /** Muestra el conteo de puntos en el tip de cada celda. */
  showCounts?: boolean;
  /** Ticks del grid de los ejes. */
  gridTicks?: number;
  /** Tope de puntos de la muestra (SSR acotado). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

type CleanHexPoint = {
  x: number;
  y: number;
};

/** Limpia la muestra (no-finitos fuera, cap determinista SSR). */
function cleanHexPoints(
  points: HexPoint[],
  maxItems = DEFAULT_MAX_ROWS,
): CleanHexPoint[] {
  const rawMax = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
  const clean: CleanHexPoint[] = [];
  for (const p of points) {
    const x = toNumber(p.x, Number.NaN);
    const y = toNumber(p.y, Number.NaN);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    clean.push({ x, y });
    if (clean.length >= safeMax) break;
  }
  return clean;
}

/** Ticks válidos (fuera de rango o no-finito → defecto). */
function safeGridTicks(gridTicks: number): number {
  const raw = Math.floor(toNumber(gridTicks, GRID_TICKS));
  return Number.isFinite(raw) && raw > 0 ? raw : GRID_TICKS;
}

/** Escalas lineales honestas (incluyen el cero, como scatter-plot). */
function hexScales(
  clean: CleanHexPoint[],
  innerW: number,
  innerH: number,
  gridTicks = GRID_TICKS,
): { x: ScaleLinear<number, number>; y: ScaleLinear<number, number> } {
  const ticks = safeGridTicks(gridTicks);
  const xs = clean.map((p) => p.x);
  const ys = clean.map((p) => p.y);
  const loX = Math.min(0, min(xs) ?? 0);
  let hiX = max(xs) ?? UNIT_RANGE;
  if (!(hiX > loX)) hiX = loX + UNIT_RANGE;
  const loY = Math.min(0, min(ys) ?? 0);
  let hiY = max(ys) ?? UNIT_RANGE;
  if (!(hiY > loY)) hiY = loY + UNIT_RANGE;
  const x = scaleLinear().domain([loX, hiX]).nice(ticks).range([0, innerW]);
  const y = scaleLinear().domain([loY, hiY]).nice(ticks).range([innerH, 0]);
  return { x, y };
}

/** Radio válido (fuera de rango o no-finito → defecto). */
function safeHexRadius(radius: number): number {
  const r = toNumber(radius, DEFAULT_HEX_RADIUS);
  return Number.isFinite(r) && r >= MIN_HEX_RADIUS ? r : DEFAULT_HEX_RADIUS;
}

/**
 * Cómputo puro de celdas hexagonales (d3-hexbin sobre x/y lineales;
 * sin DOM, apto SSR). Retorna celdas, total, conteo máximo y el path
 * del hexágono unitario.
 */
export function computeHexbins(
  points: HexPoint[],
  innerW: number,
  innerH: number,
  radius = DEFAULT_HEX_RADIUS,
  gridTicks = GRID_TICKS,
  maxItems = DEFAULT_MAX_ROWS,
) {
  const safeR = safeHexRadius(radius);
  const clean = cleanHexPoints(points, maxItems);
  const empty: { bins: HexCell[]; total: number; maxCount: number } = {
    bins: [],
    total: 0,
    maxCount: 0,
  };
  if (clean.length === 0 || !(innerW > 0) || !(innerH > 0)) {
    return {
      ...empty,
      hexagon: hexbin().radius(safeR).hexagon(),
      radius: safeR,
    };
  }
  const { x, y } = hexScales(clean, innerW, innerH, gridTicks);
  const pixels = clean.map((p) => ({ px: x(p.x), py: y(p.y) }));
  const generator = hexbin<{ px: number; py: number }>()
    .x((d) => d.px)
    .y((d) => d.py)
    .extent([
      [0, 0],
      [innerW, innerH],
    ])
    .radius(safeR);
  const raw = generator(pixels);
  let maxCount = 0;
  for (const b of raw) maxCount = Math.max(maxCount, b.length);
  const bins: HexCell[] = raw.map((b) => ({
    x: b.x,
    y: b.y,
    count: b.length,
  }));
  return {
    bins,
    total: clean.length,
    maxCount,
    hexagon: generator.hexagon(),
    radius: safeR,
  };
}

/**
 * Agregado hexagonal SSR (d3-hexbin sobre x/y lineales con YGrid).
 * Opacidad ∝ conteo; filtra no-finitos; sin celdas → ChartEmpty.
 */
export function HexbinPlot({
  points,
  ariaLabel,
  radius = DEFAULT_HEX_RADIUS,
  height = 260,
  formatValue,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  showLabels = true,
  showCounts = true,
  gridTicks = GRID_TICKS,
  maxItems = DEFAULT_MAX_ROWS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: HexbinPlotProps) {
  const safeH = toNumber(height, 260);
  const safeTicks = safeGridTicks(gridTicks);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = safeH - MARGIN.top - MARGIN.bottom;
  const { bins, total, maxCount, hexagon } = computeHexbins(
    points,
    innerW,
    innerH,
    radius,
    safeTicks,
    maxItems,
  );
  if (bins.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(formatValue, locale);
  const { x, y } = hexScales(
    cleanHexPoints(points, maxItems),
    innerW,
    innerH,
    safeTicks,
  );
  const ticks = y.ticks(safeTicks);
  const base = seriesColor(0);
  const peak = Math.max(1, maxCount);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={safeH}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {showLabels ? (
          <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmt} />
        ) : (
          ticks.map((t) => (
            <line
              key={`grid-${t}`}
              x1={MARGIN.left}
              x2={W - MARGIN.right}
              y1={MARGIN.top + y(t)}
              y2={MARGIN.top + y(t)}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
          ))
        )}
        {showLabels
          ? x.ticks(X_TICKS).map((t) => (
              <text
                key={`x${t}`}
                x={MARGIN.left + x(t)}
                y={safeH - X_TICK_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {fmt(t)}
              </text>
            ))
          : null}
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {bins.map((b, i) => {
            const pct = pctOf(b.count, total);
            const tip = showCounts
              ? `celda: ${fmt(b.count)} puntos (${pct}%)`
              : `celda: ${pct}%`;
            const opacity =
              HEX_MIN_OPACITY + (b.count / peak) * HEX_OPACITY_SPAN;
            return (
              <g key={stableKey([Math.round(b.x), Math.round(b.y)], i)}>
                <title>{tip}</title>
                <path
                  d={hexagon}
                  transform={`translate(${b.x},${b.y})`}
                  fill={base}
                  fillOpacity={opacity}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={POINT_BORDER}
                  data-chart-tip={tip}
                />
              </g>
            );
          })}
        </g>
      </ChartSvg>
      {showLegend ? (
        <ChartLegend items={[{ label: "Celdas", color: base }]} />
      ) : null}
    </div>
  );
}
