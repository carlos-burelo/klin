/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { topPositive } from "../lib/domain";
import type { ChartMargin } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  LABEL_GAP_PX,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

const W = 640;
const MARGIN: ChartMargin = { top: 8, right: 48, bottom: 28, left: 132 };

const LABEL_MAX_X = 24;
const ROW_H = 34;
const ROW_TOP_OFFSET = 6;
const BAR_VERTICAL_INSET = 12;
const CENTER_LINE_WIDTH = 1.5;
const MIN_HEIGHT = 140;

/** Props de barras divergentes SSR (encuesta izquierda/derecha). */
export type DivergingBarProps = {
  data: Array<Record<string, string | number>>;
  yKey: string;
  left: { key: string; label: string; color?: string };
  right: { key: string; label: string; color?: string };
  ariaLabel: string;
  formatX?: ValueFormatter;
  locale?: string;
  annotations?: ValueAnnotation[];
  /**
   * Color por grupo (aplica a ambos lados de la fila).
   * Si retorna `undefined` se usan los colores de cada lado.
   */
  itemColor?: (
    datum: Record<string, string | number>,
    index: number,
  ) => string | undefined;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Barras divergentes SSR (encuestas: en contra ← centro → a favor).
 */
export function DivergingBar({
  data,
  yKey,
  left,
  right,
  ariaLabel,
  locale = "es-MX",
  formatX = (v: number) => formatDefault(v, locale),
  annotations,
  itemColor,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: DivergingBarProps) {
  if (data.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const rowH = ROW_H;
  const height = Math.max(
    MIN_HEIGHT,
    MARGIN.top + MARGIN.bottom + data.length * rowH,
  );
  const halfW = (W - MARGIN.left - MARGIN.right) / 2;
  // Magnitudes opuestas: se grafica el valor absoluto de cada lado.
  const magOf = (d: Record<string, string | number>, key: string) =>
    Math.abs(toNumber(d[key]));
  const top = topPositive(
    data.flatMap((d) => [magOf(d, left.key), magOf(d, right.key)]),
  );

  const scale = scaleLinear().domain([0, top]).range([0, halfW]);
  const midX = MARGIN.left + halfW;
  const leftColor = seriesColor(4, left.color);
  const rightColor = seriesColor(0, right.color);

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
          strokeWidth={CENTER_LINE_WIDTH}
        />
        {(annotations ?? []).map((a, ai) => {
          const clamped = Math.min(top, Math.max(0, toNumber(a.value)));
          const stroke = a.color ?? CHART_TOKEN.accent;
          return (
            <g key={stableKey([a.label ?? `${a.value}`], ai)}>
              <title>{a.label ?? formatX(a.value)}</title>
              <line
                x1={midX - scale(clamped)}
                x2={midX - scale(clamped)}
                y1={MARGIN.top}
                y2={height - MARGIN.bottom}
                stroke={stroke}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              <line
                x1={midX + scale(clamped)}
                x2={midX + scale(clamped)}
                y1={MARGIN.top}
                y2={height - MARGIN.bottom}
                stroke={stroke}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              {a.label ? (
                <text
                  x={midX + scale(clamped) + LABEL_GAP_PX}
                  y={MARGIN.top + LABEL_GAP_PX}
                  fontSize={TICK_FONT_SIZE}
                  fill={stroke}
                >
                  {a.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {data.map((d, i) => {
          const group = String(d[yKey] ?? "");
          const lv = magOf(d, left.key);
          const rv = magOf(d, right.key);
          const by = MARGIN.top + i * rowH + ROW_TOP_OFFSET;
          const bh = rowH - BAR_VERTICAL_INSET;
          const lw = Math.max(lv === 0 ? 0 : ZERO_MARK_PX, scale(lv));
          const rw = Math.max(rv === 0 ? 0 : ZERO_MARK_PX, scale(rv));
          const override = itemColor?.(d, i);
          const leftFill = override ?? leftColor;
          const rightFill = override ?? rightColor;
          const rowTotal = lv + rv;
          const pctL =
            rowTotal > 0 ? Math.round((lv / rowTotal) * PERCENT_FACTOR) : 0;
          const pctR =
            rowTotal > 0 ? Math.round((rv / rowTotal) * PERCENT_FACTOR) : 0;
          const tipL = `${group} · ${left.label}: ${formatX(lv)} (${pctL}% de la fila)`;
          const tipR = `${group} · ${right.label}: ${formatX(rv)} (${pctR}% de la fila)`;
          return (
            <g key={stableKey([group], i)}>
              <text
                x={midX}
                y={by - LABEL_GAP_PX}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{group}</title>
                {truncateLabel(group, LABEL_MAX_X)}
              </text>
              <g>
                <title>{tipL}</title>
                <rect
                  x={midX - lw}
                  y={by}
                  width={lw}
                  height={bh}
                  rx={BAR_RADIUS}
                  fill={leftFill}
                  data-chart-tip={tipL}
                />
              </g>
              <g>
                <title>{tipR}</title>
                <rect
                  x={midX}
                  y={by}
                  width={rw}
                  height={bh}
                  rx={BAR_RADIUS}
                  fill={rightFill}
                  data-chart-tip={tipR}
                />
              </g>
            </g>
          );
        })}
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
