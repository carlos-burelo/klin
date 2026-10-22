/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties, ReactNode } from "react";
import { CHART_WIDTH } from "../core/theme";

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
      {children}
    </svg>
  );
}
