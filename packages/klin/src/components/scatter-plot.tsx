/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  AREA_FILL_OPACITY,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { YGrid } from "../render/y-grid";
import {
  ANNOTATION_LABEL_DX,
  ANNOTATION_LABEL_DY,
  buildScatterScales,
  cleanScatterPoints,
  resolveScatterRadius,
  SCATTER_FILL_OPACITY,
  X_LABEL_OFFSET,
  X_TICK_LABEL_OFFSET,
  X_TICKS,
  Y_LABEL_X,
} from "./scatter-plot.compute";
import type { ScatterPlotProps } from "./scatter-plot.types";

export type { ScatterPlotProps, ScatterPoint } from "./scatter-plot.types";

/**
 * Dispersión XY SSR (correlaciones, outliers). Soporta negativos en
 * ambos ejes; filtra puntos no-finitos.
 */
export function ScatterPlot({
  points,
  ariaLabel,
  xLabel = "x",
  yLabel = "y",
  height = 260,
  locale = DEFAULT_LOCALE,
  format,
  color,
  itemColor,
  quadrants = false,
  xScale = "linear",
  yScale = "linear",
  annotations,
  gridTicks = GRID_TICKS,
  pointRadius = POINT_RADIUS_SCATTER,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ScatterPlotProps) {
  const clean = cleanScatterPoints(points);
  if (isBlank(clean)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const W = 640;
  const MARGIN = { top: 12, right: 16, bottom: 36, left: 48 };
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const { x, y, lx, ly, ticks, meanX, meanY } = buildScatterScales(
    clean,
    xScale,
    yScale,
    innerW,
    innerH,
    gridTicks,
  );

  const fmt = resolveFormatter(format, locale);
  const fill = seriesColor(0, color);
  const dotR = resolveScatterRadius(pointRadius, POINT_RADIUS_SCATTER);
  // Dominio Y efectivo (con `nice`) para recortar anotaciones.
  const yDom = y.domain();
  const yLo = yDom[0] ?? 0;
  const yHi = yDom[1] ?? 1;

  return (
    <ChartSvg
      width={W}
      height={height}
      ariaLabel={ariaLabel}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      ariaDescribedBy={ariaDescribedBy}
    >
      <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmt} />
      {(annotations ?? []).map((a, ai) => {
        const end = a.to === undefined ? a.value : a.to;
        const top = MARGIN.top + y(ly(Math.max(a.value, end)));
        const bottom = MARGIN.top + y(ly(Math.min(a.value, end)));
        // Banda sombreada cuando el intervalo recorta algo visible.
        if (end !== a.value && bottom > top) {
          const cTop = Math.max(MARGIN.top, Math.min(top, MARGIN.top + innerH));
          const cBottom = Math.max(
            MARGIN.top,
            Math.min(bottom, MARGIN.top + innerH),
          );
          if (!(cBottom > cTop)) return null;
          return (
            <g
              key={`ann-${a.value}-${end}-${ai}`}
              data-chart-tip={a.label ?? `${a.value} – ${end}`}
            >
              <rect
                x={MARGIN.left}
                y={cTop}
                width={innerW}
                height={cBottom - cTop}
                fill={a.color ?? CHART_TOKEN.accent}
                opacity={AREA_FILL_OPACITY}
              />
              <text
                x={MARGIN.left + innerW - ANNOTATION_LABEL_DX}
                y={cTop}
                dy={ANNOTATION_LABEL_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={a.color ?? CHART_TOKEN.muted}
              >
                {a.label ?? `${a.value} – ${end}`}
              </text>
            </g>
          );
        }
        const lifted = ly(a.value);
        if (lifted < yLo || lifted > yHi) return null;
        const ay = MARGIN.top + y(lifted);
        return (
          <g
            key={`ann-${a.value}-${ai}`}
            data-chart-tip={a.label ?? String(a.value)}
          >
            <line
              x1={MARGIN.left}
              x2={MARGIN.left + innerW}
              y1={ay}
              y2={ay}
              stroke={a.color ?? CHART_TOKEN.accent}
              strokeWidth={ANNOTATION_WIDTH}
              strokeDasharray={ANNOTATION_DASH}
            />
            <text
              x={MARGIN.left + innerW - ANNOTATION_LABEL_DX}
              y={ay}
              dy={ANNOTATION_LABEL_DY}
              textAnchor="end"
              fontSize={TICK_FONT_SIZE}
              fill={a.color ?? CHART_TOKEN.muted}
            >
              {a.label ?? String(a.value)}
            </text>
          </g>
        );
      })}
      {quadrants ? (
        <g data-chart-tip={`medias (${fmt(meanX)}, ${fmt(meanY)})`}>
          <line
            x1={MARGIN.left + x(lx(meanX))}
            x2={MARGIN.left + x(lx(meanX))}
            y1={MARGIN.top}
            y2={MARGIN.top + innerH}
            stroke={CHART_TOKEN.muted}
            strokeWidth={GRID_WIDTH}
            strokeDasharray={ANNOTATION_DASH}
          />
          <line
            x1={MARGIN.left}
            x2={MARGIN.left + innerW}
            y1={MARGIN.top + y(ly(meanY))}
            y2={MARGIN.top + y(ly(meanY))}
            stroke={CHART_TOKEN.muted}
            strokeWidth={GRID_WIDTH}
            strokeDasharray={ANNOTATION_DASH}
          />
        </g>
      ) : null}
      {x.ticks(X_TICKS).map((t) => (
        <text
          key={`x${t}`}
          x={MARGIN.left + x(lx(t))}
          y={height - X_TICK_LABEL_OFFSET}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fill={CHART_TOKEN.muted}
        >
          {fmt(t)}
        </text>
      ))}
      <text
        x={MARGIN.left + innerW / 2}
        y={height - X_LABEL_OFFSET}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fill={CHART_TOKEN.muted}
      >
        {xLabel}
      </text>
      {clean.map((p, i) => {
        const tip = `${p.label ? `${p.label}: ` : ""}(${fmt(p.x)}, ${fmt(p.y)})`;
        return (
          <g key={`${p.x}-${p.y}-${i}`}>
            <circle
              cx={MARGIN.left + x(lx(p.x))}
              cy={MARGIN.top + y(ly(p.y))}
              r={dotR}
              fill={itemColor?.(p, i) ?? fill}
              fillOpacity={SCATTER_FILL_OPACITY}
              stroke={CHART_TOKEN.background}
              strokeWidth={POINT_BORDER}
              data-chart-tip={tip}
            />
          </g>
        );
      })}
      <text
        x={Y_LABEL_X}
        y={MARGIN.top + innerH / 2}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fill={CHART_TOKEN.muted}
        transform={`rotate(-90, ${Y_LABEL_X}, ${MARGIN.top + innerH / 2})`}
      >
        {yLabel}
      </text>
    </ChartSvg>
  );
}
