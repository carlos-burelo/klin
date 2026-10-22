/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import {
  CHART_TOKEN,
  GRID_WIDTH,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../core/theme";
import type { ChartMargin } from "./chart-svg";

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
