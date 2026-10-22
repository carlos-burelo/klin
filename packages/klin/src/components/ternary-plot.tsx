/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  GRID_TICKS,
  GRID_WIDTH,
  LINE_WIDTH,
  PERCENT_FACTOR,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../core/theme";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
} from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  cleanTernaryPoints,
  safeTernaryLevels,
  ternaryLayout,
  ternaryLevels,
  ternaryOrigin,
  ternaryToXY,
  VERTEX_LABEL_GAP,
} from "./ternary-plot.compute";
import type { TernaryPlotProps } from "./ternary-plot.types";

export {
  cleanTernaryPoints,
  ternaryLayout,
  ternaryLevels,
  ternaryOrigin,
  ternaryToXY,
} from "./ternary-plot.compute";
export type { TernaryPlotProps, TernaryPoint } from "./ternary-plot.types";

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
  locale = DEFAULT_LOCALE,
  format,
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
  const safeLevels = safeTernaryLevels(gridLevels);
  const clean = cleanTernaryPoints(points, maxItems);
  if (clean.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const { side, triH } = ternaryLayout(innerW, innerH);
  const { x: ox, y: oy } = ternaryOrigin(
    innerW,
    innerH,
    side,
    triH,
    MARGIN.left,
    MARGIN.top,
  );
  const toXY = (a: number, b: number, c: number) =>
    ternaryToXY(a, b, c, ox, oy, side, triH);
  const apex = toXY(1, 0, 0);
  const left = toXY(0, 1, 0);
  const right = toXY(0, 0, 1);

  const levels = ternaryLevels(safeLevels);

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
            `${head}${fmt(p.a * PERCENT_FACTOR)}% · ` +
            `${fmt(p.b * PERCENT_FACTOR)}% · ` +
            `${fmt(p.c * PERCENT_FACTOR)}%`;
          return (
            <g key={stableKey([p.label ?? `${p.a}-${p.b}-${p.c}`], i)}>
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
