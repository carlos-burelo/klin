/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import {
  CHART_TOKEN,
  EDGE_LABEL_CHAR_WIDTH,
  EDGE_LABEL_DY,
  EDGE_LABEL_FONT_SIZE,
  EDGE_LABEL_HEIGHT,
  EDGE_LABEL_MAX_CHARS,
  EDGE_LABEL_MIN_WIDTH,
  EDGE_LABEL_PAD_X,
  ELLIPSIS,
  FONT_MONO,
  GRID_WIDTH,
} from "../core/theme";

export type EdgeLabelProps = {
  mx: number;
  my: number;
  text: string;
};

/** Etiqueta de arista: píldora mono centrada en (mx, my). */
export function EdgeLabel({ mx, my, text }: EdgeLabelProps) {
  const chars = Array.from(text);
  const short =
    chars.length > EDGE_LABEL_MAX_CHARS
      ? `${chars.slice(0, EDGE_LABEL_MAX_CHARS - 1).join("")}${ELLIPSIS}`
      : text;
  const w = Math.max(
    EDGE_LABEL_MIN_WIDTH,
    Array.from(short).length * EDGE_LABEL_CHAR_WIDTH + EDGE_LABEL_PAD_X,
  );
  return (
    <g transform={`translate(${mx},${my})`} data-chart-tip={text}>
      <rect
        x={-w / 2}
        y={-EDGE_LABEL_HEIGHT / 2}
        width={w}
        height={EDGE_LABEL_HEIGHT}
        rx={EDGE_LABEL_HEIGHT / 2}
        fill={CHART_TOKEN.background}
        stroke={CHART_TOKEN.border}
        strokeWidth={GRID_WIDTH}
      />
      <text
        textAnchor="middle"
        dy={EDGE_LABEL_DY}
        fontSize={EDGE_LABEL_FONT_SIZE}
        fontFamily={FONT_MONO}
        fill={CHART_TOKEN.muted}
      >
        {short}
      </text>
    </g>
  );
}
