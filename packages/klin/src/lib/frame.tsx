/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties, ReactNode } from "react";
import {
  CHART_TOKEN,
  CHART_WIDTH,
  GRID_WIDTH,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "./theme";

export const CHART_W = CHART_WIDTH;

export type ChartMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const CHART_MARGIN: ChartMargin = {
  top: 12,
  right: 12,
  bottom: 32,
  left: 44,
};

export type ChartSvgProps = {
  width?: number;
  height: number;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  /** Tope de ancho renderizado (los SVG chicos no se estiran más allá). */
  maxWidth?: number;
};

/** SVG responsivo homogéneo (role img + title + viewBox). */
export function ChartSvg({
  width = CHART_W,
  height,
  ariaLabel,
  children,
  className = "h-auto w-full",
  style,
  ariaDescribedBy,
  maxWidth,
}: ChartSvgProps) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={maxWidth === undefined ? style : { maxWidth, ...style }}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{ariaLabel}</title>
      {children}
    </svg>
  );
}

export type YGridProps = {
  ticks: number[];
  y: (value: number) => number;
  margin: Pick<ChartMargin, "top" | "left" | "right">;
  width: number;
  format: (value: number) => string;
};

/** Grid horizontal + etiquetas Y (tokens del tema). */
export function YGrid({ ticks, y, margin, width, format }: YGridProps) {
  return (
    <>
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={margin.left}
            x2={width - margin.right}
            y1={margin.top + y(t)}
            y2={margin.top + y(t)}
            stroke={CHART_TOKEN.border}
            strokeWidth={GRID_WIDTH}
          />
          <text
            x={margin.left - TICK_GAP_PX}
            y={margin.top + y(t)}
            dy={TICK_DY}
            textAnchor="end"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {format(t)}
          </text>
        </g>
      ))}
    </>
  );
}
