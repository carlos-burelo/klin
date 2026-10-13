/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { max, min } from "d3-array";
import type { CSSProperties } from "react";
import { logDomain, logFloor } from "../lib/domain";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { ChartSvg, YGrid } from "../lib/frame";
import { sumNumbers, toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor } from "../lib/palette";
import { type ValueScaleKind, valueScale } from "../lib/scale";
import {
  ANNOTATION_DASH,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type ScatterPoint = {
  x: number;
  y: number;
  label?: string;
};

const X_TICKS = 5;
const X_TICK_LABEL_OFFSET = 18;
const X_LABEL_OFFSET = 2;
const Y_LABEL_X = 12;
const SCATTER_FILL_OPACITY = 0.75;

/** Props de ScatterPlot. */
export type ScatterPlotProps = {
  points: ScatterPoint[];
  ariaLabel: string;
  xLabel?: string;
  yLabel?: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  /**
   * Color por punto. Si retorna `undefined` se usa el color base (`color`).
   */
  itemColor?: (point: ScatterPoint, index: number) => string | undefined;
  /** Dibuja una cruz en las medias de X e Y (cuadrantes). */
  quadrants?: boolean;
  /**
   * Escala del eje X (`log` para magnitudes; no-positivos se fijan al piso
   * del dominio en geometría, el tip conserva el valor crudo).
   */
  xScale?: ValueScaleKind;
  /**
   * Escala del eje Y (`log` para magnitudes; no-positivos se fijan al piso
   * del dominio en geometría, el tip conserva el valor crudo).
   */
  yScale?: ValueScaleKind;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

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
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ScatterPlotProps) {
  const clean = points
    .map((p) => ({
      x: toNumber(p.x, Number.NaN),
      y: toNumber(p.y, Number.NaN),
      label: p.label,
    }))
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  if (isBlank(clean)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const W = 640;
  const MARGIN = { top: 12, right: 16, bottom: 36, left: 48 };
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const xs = clean.map((p) => p.x);
  const ys = clean.map((p) => p.y);
  const logX = xScale === "log";
  const logY = yScale === "log";
  const [xLo, xHi] = logX
    ? logDomain(xs)
    : ([Math.min(0, min(xs) ?? 0), max(xs) ?? 1] as const);
  const [yLo, yHi] = logY
    ? logDomain(ys)
    : ([Math.min(0, min(ys) ?? 0), max(ys) ?? 1] as const);
  const x = valueScale(logX ? "log" : "linear", [xLo, xHi], [0, innerW]).nice(
    GRID_TICKS,
  );
  const y = valueScale(logY ? "log" : "linear", [yLo, yHi], [innerH, 0]).nice(
    GRID_TICKS,
  );
  const lx = (v: number) => (logX ? logFloor(v, xLo) : v);
  const ly = (v: number) => (logY ? logFloor(v, yLo) : v);
  const ticks = y.ticks(GRID_TICKS);

  const fmt = resolveFormatter(format, locale);
  const fill = seriesColor(0, color);
  const meanX = sumNumbers(xs) / xs.length;
  const meanY = sumNumbers(ys) / ys.length;

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
      {quadrants ? (
        <g>
          <title>{`medias (${fmt(meanX)}, ${fmt(meanY)})`}</title>
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
            <title>{tip}</title>
            <circle
              cx={MARGIN.left + x(lx(p.x))}
              cy={MARGIN.top + y(ly(p.y))}
              r={POINT_RADIUS_SCATTER}
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
