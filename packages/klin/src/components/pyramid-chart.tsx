/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import { topPositive } from "../lib/domain";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import type { ChartMargin } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  PERCENT_FACTOR,
  TICK_DY,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Props de pirámide poblacional SSR (dos series espejadas). */
export type PyramidChartProps = {
  groups: string[];
  left: { label: string; values: number[]; color?: string };
  right: { label: string; values: number[]; color?: string };
  ariaLabel: string;
  formatX?: ValueFormatter;
  /** Etiquetas de grupo a la izquierda (clásica) o en la banda central. */
  labels?: "left" | "center";
  locale?: string;
  /**
   * Color por grupo y lado. Si retorna `undefined` se usan los colores
   * de cada lado (`left.color` / `right.color` primero).
   */
  itemColor?: (
    group: string,
    side: "left" | "right",
    index: number,
  ) => string | undefined;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Alto fijo del lienzo (por defecto, automático según filas). */
  height?: number;
  /** Etiqueta con el % de cada lado (el tooltip ya lo trae). */
  showShare?: boolean;
  /** Ancho de la banda central (por defecto, según `labels`). */
  centerGap?: number;
  /** Orden de grupos por total (suma de ambos lados). */
  sortGroups?: "none" | "asc" | "desc";
};

const W = 640;
const MARGIN: ChartMargin = { top: 8, right: 16, bottom: 34, left: 84 };
const LABEL_BAND = 96;
/** Alto de fila, alto mínimo del lienzo y relleno vertical de barra. */
const ROW_H = 34;
const PYRAMID_MIN_H = 140;
const BAR_Y_PAD = 5;
/** Máximos de truncado de etiqueta (banda central / lateral). */
const LABEL_MAX_CENTER = 14;
const LABEL_MAX_SIDE = 12;
/** Separación de la etiqueta del eje inferior. */
const AXIS_LABEL_BOTTOM_PAD = 12;
/** Opacidad del borde de barra. */
const BAR_STROKE_OPACITY = 0.25;
/** Separación de la etiqueta de % al extremo de la barra. */
const SHARE_GAP_PX = 4;

/** Fila de pirámide con conteos ya saneados (negativos a 0). */
type PyramidRow = {
  group: string;
  l: number;
  r: number;
};

/**
 * Pirámide poblacional SSR (dos series espejadas): etiquetas a la izquierda,
 * barras al centro y escala abajo, como la clásica de población.
 */
export function PyramidChart({
  groups,
  left,
  right,
  ariaLabel,
  locale = DEFAULT_LOCALE,
  formatX,
  labels = "left",
  itemColor,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  height: heightProp,
  showShare = false,
  centerGap,
  sortGroups = "none",
}: PyramidChartProps) {
  if (isBlank(groups)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtX = resolveFormatter(formatX, locale);

  const rows: PyramidRow[] = groups.map((group, i) => ({
    group,
    // Conteos: negativos se fijan a 0.
    l: Math.max(0, toNumber(left.values[i] ?? 0)),
    r: Math.max(0, toNumber(right.values[i] ?? 0)),
  }));
  if (sortGroups !== "none") {
    rows.sort((a, b) =>
      sortGroups === "asc" ? a.l + a.r - (b.l + b.r) : b.l + b.r - (a.l + a.r),
    );
  }

  const rowH = ROW_H;
  const autoHeight = Math.max(
    PYRAMID_MIN_H,
    MARGIN.top + MARGIN.bottom + rows.length * rowH,
  );
  const height =
    heightProp == null
      ? autoHeight
      : Math.max(PYRAMID_MIN_H, Math.round(toNumber(heightProp, autoHeight)));
  const baseBand = labels === "center" ? LABEL_BAND : 0;
  const band = centerGap == null ? baseBand : toNumber(centerGap, baseBand);
  const plotW = W - MARGIN.left - MARGIN.right - band;
  const halfW = plotW / 2;
  const top = topPositive([...left.values, ...right.values]);

  const scale = scaleLinear()
    .domain([0, top])
    .nice(GRID_TICKS)
    .range([0, halfW]);
  const ticks = scale.ticks(GRID_TICKS).filter((t) => t > 0);
  const leftColor = seriesColor(0, left.color);
  const rightColor = seriesColor(1, right.color);
  const midX = MARGIN.left + halfW + band;
  const leftEdge = midX - band / 2;
  const rightEdge = midX + band / 2;
  const totalL = left.values.reduce(
    (acc, v) => acc + Math.max(0, toNumber(v)),
    0,
  );
  const totalR = right.values.reduce(
    (acc, v) => acc + Math.max(0, toNumber(v)),
    0,
  );

  return (
    <div className={className} style={style}>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <title>{ariaLabel}</title>
        <line
          x1={midX}
          x2={midX}
          y1={MARGIN.top}
          y2={height - MARGIN.bottom}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
        />
        {rows.map((row, i) => {
          const group = row.group;
          const lv = row.l;
          const rv = row.r;
          const by = MARGIN.top + i * rowH + BAR_Y_PAD;
          const bh = rowH - BAR_Y_PAD * 2;
          const lw = Math.max(lv === 0 ? 0 : ZERO_MARK_PX, scale(lv));
          const rw = Math.max(rv === 0 ? 0 : ZERO_MARK_PX, scale(rv));
          const leftFill = itemColor?.(group, "left", i) ?? leftColor;
          const rightFill = itemColor?.(group, "right", i) ?? rightColor;
          const pctL =
            totalL > 0 ? Math.round((lv / totalL) * PERCENT_FACTOR) : 0;
          const pctR =
            totalR > 0 ? Math.round((rv / totalR) * PERCENT_FACTOR) : 0;
          const tipL = `${group} · ${left.label}: ${fmtX(lv)} (${pctL}% de ${left.label})`;
          const tipR = `${group} · ${right.label}: ${fmtX(rv)} (${pctR}% de ${right.label})`;
          return (
            <g key={stableKey([group], i)}>
              <text
                x={labels === "center" ? midX : MARGIN.left}
                y={by + bh / 2}
                dy={TICK_DY}
                textAnchor={labels === "center" ? "middle" : "start"}
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{group}</title>
                {truncateLabel(
                  group,
                  labels === "center" ? LABEL_MAX_CENTER : LABEL_MAX_SIDE,
                )}
              </text>
              <g>
                <title>{tipL}</title>
                <rect
                  x={leftEdge - lw}
                  y={by}
                  width={lw}
                  height={bh}
                  rx={BAR_RADIUS}
                  fill={leftFill}
                  stroke={CHART_TOKEN.foreground}
                  strokeOpacity={BAR_STROKE_OPACITY}
                  strokeWidth={GRID_WIDTH}
                  data-chart-tip={tipL}
                />
              </g>
              <g>
                <title>{tipR}</title>
                <rect
                  x={rightEdge}
                  y={by}
                  width={rw}
                  height={bh}
                  rx={BAR_RADIUS}
                  fill={rightFill}
                  stroke={CHART_TOKEN.foreground}
                  strokeOpacity={BAR_STROKE_OPACITY}
                  strokeWidth={GRID_WIDTH}
                  data-chart-tip={tipR}
                />
              </g>
              {showShare ? (
                <>
                  <text
                    x={leftEdge - lw - SHARE_GAP_PX}
                    y={by + bh / 2}
                    dy={TICK_DY}
                    textAnchor="end"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {pctL}%
                  </text>
                  <text
                    x={rightEdge + rw + SHARE_GAP_PX}
                    y={by + bh / 2}
                    dy={TICK_DY}
                    textAnchor="start"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {pctR}%
                  </text>
                </>
              ) : null}
            </g>
          );
        })}
        {ticks.map((t) => (
          <g key={t}>
            <text
              x={leftEdge - scale(t)}
              y={height - AXIS_LABEL_BOTTOM_PAD}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtX(t)}
            </text>
            <text
              x={rightEdge + scale(t)}
              y={height - AXIS_LABEL_BOTTOM_PAD}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtX(t)}
            </text>
          </g>
        ))}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: left.label, color: leftColor },
            { label: right.label, color: rightColor },
          ]}
        />
      ) : null}
    </div>
  );
}
