/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { ChartSvg, CHART_MARGIN as MARGIN, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor } from "../lib/palette";
import {
  CHART_TOKEN,
  FONT_SEMIBOLD,
  GRID_TICKS,
  GRID_WIDTH,
  LINE_WIDTH,
  PERCENT_FACTOR,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Punto ternario (a + b + c se normaliza a 1; suma <= 0 se filtra). */
export type TernaryPoint = {
  a: number;
  b: number;
  c: number;
  label?: string;
  color?: string;
};

/** Props de TernaryPlot. */
export type TernaryPlotProps = {
  points: TernaryPoint[];
  ariaLabel: string;
  aLabel?: string;
  bLabel?: string;
  cLabel?: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Muestra las etiquetas de vértices (A/B/C). */
  showLabels?: boolean;
  /** Niveles de rejilla por lado (por defecto GRID_TICKS). */
  gridLevels?: number;
  /** Tope de puntos (SSR acotado). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

/** Mitad del lado (x del vértice A) y altura del equilátero unitario. */
const TERNARY_HALF = 0.5;
const TERNARY_ALT = Math.sqrt(3) / 2;
/** Separación vértice-etiqueta. */
const VERTEX_LABEL_GAP = 8;

type TernaryClean = {
  a: number;
  b: number;
  c: number;
  label?: string;
  color?: string;
};

/**
 * Ternario SSR (composiciones a/b/c normalizadas sobre triángulo
 * equilátero: A arriba, B abajo-izquierda, C abajo-derecha).
 * Rejilla en tercios de GRID_TICKS + vértices rotulados.
 */
export function TernaryPlot({
  points,
  ariaLabel,
  aLabel = "A",
  bLabel = "B",
  cLabel = "C",
  height = 260,
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  showLabels = true,
  gridLevels = GRID_TICKS,
  maxItems = DEFAULT_MAX_ROWS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: TernaryPlotProps) {
  const rawLevels = Math.floor(toNumber(gridLevels, GRID_TICKS));
  const safeLevels =
    Number.isFinite(rawLevels) && rawLevels > 0 ? rawLevels : GRID_TICKS;
  const rawMax = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
  const clean: TernaryClean[] = [];
  for (const p of points.slice(0, safeMax)) {
    const sum = toNumber(p.a) + toNumber(p.b) + toNumber(p.c);
    if (!(sum > 0)) continue;
    clean.push({
      a: toNumber(p.a) / sum,
      b: toNumber(p.b) / sum,
      c: toNumber(p.c) / sum,
      label: p.label,
      color: p.color,
    });
  }
  if (clean.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const side = Math.min(innerW, innerH / TERNARY_ALT);
  const triH = side * TERNARY_ALT;
  const ox = MARGIN.left + (innerW - side) / 2;
  const oy = MARGIN.top + (innerH - triH) / 2;
  const toXY = (a: number, b: number, c: number) => ({
    x: ox + side * (TERNARY_HALF * a + c),
    y: oy + triH * (b + c),
  });
  const apex = toXY(1, 0, 0);
  const left = toXY(0, 1, 0);
  const right = toXY(0, 0, 1);

  const levels: number[] = [];
  for (let k = 1; k < safeLevels; k++) levels.push(k / safeLevels);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {levels.map((f) => {
          const a0 = toXY(f, 1 - f, 0);
          const a1 = toXY(f, 0, 1 - f);
          const b0 = toXY(1 - f, f, 0);
          const b1 = toXY(0, f, 1 - f);
          const c0 = toXY(0, 1 - f, f);
          const c1 = toXY(1 - f, 0, f);
          return (
            <g
              key={`grid-${f}`}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            >
              <line x1={a0.x} y1={a0.y} x2={a1.x} y2={a1.y} />
              <line x1={b0.x} y1={b0.y} x2={b1.x} y2={b1.y} />
              <line x1={c0.x} y1={c0.y} x2={c1.x} y2={c1.y} />
            </g>
          );
        })}
        <polygon
          points={`${apex.x},${apex.y} ${left.x},${left.y} ${right.x},${right.y}`}
          fill="none"
          stroke={CHART_TOKEN.foreground}
          strokeWidth={LINE_WIDTH}
          strokeLinejoin="round"
        />
        {showLabels ? (
          <>
            <text
              x={apex.x}
              y={apex.y - VERTEX_LABEL_GAP}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.muted}
            >
              {aLabel}
            </text>
            <text
              x={left.x - VERTEX_LABEL_GAP}
              y={left.y}
              dy={TICK_DY}
              textAnchor="end"
              fontSize={TICK_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.muted}
            >
              {bLabel}
            </text>
            <text
              x={right.x + VERTEX_LABEL_GAP}
              y={right.y}
              dy={TICK_DY}
              textAnchor="start"
              fontSize={TICK_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.muted}
            >
              {cLabel}
            </text>
          </>
        ) : null}
        {clean.map((p, i) => {
          const pos = toXY(p.a, p.b, p.c);
          const head = p.label ? `${p.label}: ` : "";
          const tip =
            `${head}${format(p.a * PERCENT_FACTOR)}% · ` +
            `${format(p.b * PERCENT_FACTOR)}% · ` +
            `${format(p.c * PERCENT_FACTOR)}%`;
          return (
            <g key={stableKey([p.label ?? `${p.a}-${p.b}-${p.c}`], i)}>
              <title>{tip}</title>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={POINT_RADIUS_SCATTER}
                fill={seriesColor(i, p.color)}
                stroke={CHART_TOKEN.background}
                strokeWidth={POINT_BORDER}
                data-chart-tip={tip}
              />
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={clean.map((p, i) => ({
            label: p.label ?? `Punto ${i + 1}`,
            color: seriesColor(i, p.color),
          }))}
        />
      ) : null}
    </div>
  );
}
