/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max, min } from "d3-array";
import { type ContourMultiPolygon, contourDensity } from "d3-contour";
import { type ScaleLinear, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
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
import { formatDefault, seriesColor } from "../lib/palette";
import {
  CHART_TOKEN,
  GRID_TICKS,
  GRID_WIDTH,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Punto de densidad (coordenadas de datos + etiqueta opcional). */
export type DensityPoint = {
  x: number;
  y: number;
  label?: string;
};

/** Punto limpio posicionado en píxeles del área interna. */
export type PositionedDensityPoint = DensityPoint & {
  px: number;
  py: number;
};

/** Ancho de banda gaussiano y niveles por defecto; tope de niveles. */
const DEFAULT_BANDWIDTH = 20;
const DEFAULT_LEVELS = 6;
const MAX_LEVELS = 12;
const MIN_LEVELS = 1;
/** Opacidad base de contorno + tramo escalonado por nivel. */
const CONTOUR_MIN_OPACITY = 0.12;
const CONTOUR_OPACITY_SPAN = 0.55;
/** Ticks del eje X y posición de sus etiquetas. */
const X_TICKS = 5;
const X_TICK_LABEL_OFFSET = 18;
/** Rango mínimo cuando el dominio colapsa a un punto. */
const UNIT_RANGE = 1;

/** Props de DensityContourPlot. */
export type DensityContourPlotProps = {
  points: DensityPoint[];
  ariaLabel: string;
  bandwidth?: number;
  thresholds?: number;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Muestra etiquetas de ticks de los ejes. */
  showLabels?: boolean;
  /** Ticks del grid de los ejes. */
  gridTicks?: number;
  /** Tope de puntos de la muestra (SSR acotado). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

type CleanDensityPoint = {
  x: number;
  y: number;
  label?: string;
};

/** Limpia la muestra (no-finitos fuera, cap determinista SSR). */
function cleanDensityPoints(
  points: DensityPoint[],
  maxItems = DEFAULT_MAX_ROWS,
): CleanDensityPoint[] {
  const rawMax = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
  const clean: CleanDensityPoint[] = [];
  for (const p of points) {
    const x = toNumber(p.x, Number.NaN);
    const y = toNumber(p.y, Number.NaN);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    clean.push({ x, y, label: p.label });
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
function densityScales(
  clean: CleanDensityPoint[],
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

/**
 * Cómputo puro de contornos de densidad (d3-contour sobre el grid del
 * viewBox + puntos posicionados; sin DOM, apto SSR).
 */
export function computeDensityContours(
  points: DensityPoint[],
  innerW: number,
  innerH: number,
  bandwidth = DEFAULT_BANDWIDTH,
  thresholds = DEFAULT_LEVELS,
  gridTicks = GRID_TICKS,
  maxItems = DEFAULT_MAX_ROWS,
) {
  const clean = cleanDensityPoints(points, maxItems);
  const empty: {
    contours: ContourMultiPolygon[];
    positioned: PositionedDensityPoint[];
  } = { contours: [], positioned: [] };
  if (clean.length === 0 || !(innerW > 0) || !(innerH > 0)) return empty;
  const { x, y } = densityScales(clean, innerW, innerH, gridTicks);
  const positioned: PositionedDensityPoint[] = clean.map((p) => ({
    ...p,
    px: x(p.x),
    py: y(p.y),
  }));
  const rawBw = toNumber(bandwidth, DEFAULT_BANDWIDTH);
  const safeBw =
    Number.isFinite(rawBw) && rawBw > 0 ? rawBw : DEFAULT_BANDWIDTH;
  const rawLevels =
    Math.floor(toNumber(thresholds, DEFAULT_LEVELS)) || DEFAULT_LEVELS;
  const levels = Math.min(MAX_LEVELS, Math.max(MIN_LEVELS, rawLevels));
  const contours = contourDensity<PositionedDensityPoint>()
    .x((d) => d.px)
    .y((d) => d.py)
    .size([Math.round(innerW), Math.round(innerH)])
    .bandwidth(safeBw)
    .thresholds(levels)(positioned);
  return { contours, positioned };
}

/** Anillos GeoJSON del contorno → path SVG (coordenadas ya en píxeles). */
function contourPath(contour: ContourMultiPolygon): string {
  const parts: string[] = [];
  for (const polygon of contour.coordinates) {
    for (const ring of polygon) {
      const line = ring.map((pt) => `${pt[0] ?? 0},${pt[1] ?? 0}`).join("L");
      if (line.length > 0) parts.push(`M${line}Z`);
    }
  }
  return parts.join("");
}

/**
 * Contornos de densidad SSR (d3-contour sobre el grid del viewBox +
 * puntos encima). Filtra no-finitos; sin muestra → ChartEmpty.
 */
export function DensityContourPlot({
  points,
  ariaLabel,
  bandwidth = DEFAULT_BANDWIDTH,
  thresholds = DEFAULT_LEVELS,
  height = 260,
  format,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  showLabels = true,
  gridTicks = GRID_TICKS,
  maxItems = DEFAULT_MAX_ROWS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: DensityContourPlotProps) {
  const safeH = toNumber(height, 260);
  const safeTicks = safeGridTicks(gridTicks);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = safeH - MARGIN.top - MARGIN.bottom;
  const { contours, positioned } = computeDensityContours(
    points,
    innerW,
    innerH,
    bandwidth,
    thresholds,
    safeTicks,
    maxItems,
  );
  if (positioned.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = format ?? ((v: number) => formatDefault(v, locale));
  const { x, y } = densityScales(positioned, innerW, innerH, safeTicks);
  const ticks = y.ticks(safeTicks);
  const base = seriesColor(0);
  const total = Math.max(1, contours.length);

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
          {contours.map((c, i) => {
            const d = contourPath(c);
            if (d.length === 0) return null;
            const tip = `densidad ≥ ${fmt(c.value)}`;
            const opacity =
              CONTOUR_MIN_OPACITY + ((i + 1) / total) * CONTOUR_OPACITY_SPAN;
            return (
              <g key={stableKey([c.value], i)}>
                <title>{tip}</title>
                <path
                  d={d}
                  fill={base}
                  fillOpacity={opacity}
                  stroke={base}
                  strokeWidth={LINE_WIDTH}
                  data-chart-tip={tip}
                />
              </g>
            );
          })}
          {positioned.map((p, i) => {
            const tip = p.label
              ? `${p.label}: (${fmt(p.x)}, ${fmt(p.y)})`
              : `(${fmt(p.x)}, ${fmt(p.y)})`;
            return (
              <g key={stableKey([p.label ?? `${p.x},${p.y}`], i)}>
                <title>{tip}</title>
                <circle
                  cx={p.px}
                  cy={p.py}
                  r={POINT_RADIUS}
                  fill={base}
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
        <ChartLegend items={[{ label: "Densidad", color: base }]} />
      ) : null}
    </div>
  );
}
