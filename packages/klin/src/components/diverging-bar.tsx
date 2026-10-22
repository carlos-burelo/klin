/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  LABEL_GAP_PX,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  BAR_VERTICAL_INSET,
  buildDivergingScale,
  CENTER_LINE_WIDTH,
  clampDivergingAnnotation,
  divergingRowShare,
  divergingSideWidth,
  LABEL_MAX_X,
  MARGIN,
  magOfSide,
  orderDivergingRows,
  ROW_H,
  ROW_TOP_OFFSET,
  resolveDivergingColors,
  resolveDivergingHeight,
  topDivergingValue,
  W,
} from "./diverging-bar.compute";
import type { DivergingBarProps } from "./diverging-bar.types";

export type { DivergingBarProps } from "./diverging-bar.types";

/**
 * Barras divergentes SSR (encuestas: en contra ← centro → a favor).
 */
export function DivergingBar({
  data,
  yKey,
  left,
  right,
  ariaLabel,
  locale = DEFAULT_LOCALE,
  formatX,
  formatValues,
  annotations,
  itemColor,
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  height: heightProp,
  midLabels = "outside",
  showShare = false,
  showValues = false,
  sortBy = "none",
}: DivergingBarProps) {
  if (data.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const height = resolveDivergingHeight(data.length, heightProp);
  const halfW = (W - MARGIN.left - MARGIN.right) / 2;
  const ordered = orderDivergingRows(data, left.key, right.key, sortBy);
  const top = topDivergingValue(ordered, left.key, right.key);

  const scale = buildDivergingScale(top, halfW);
  const midX = MARGIN.left + halfW;
  const { leftColor, rightColor } = resolveDivergingColors(
    left.color,
    right.color,
  );
  const fmtX = resolveFormatter(formatX, locale);
  const fmtV = formatValues ? resolveFormatter(formatValues, locale) : fmtX;

  return (
    <div className={className} style={style}>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <line
          x1={midX}
          x2={midX}
          y1={MARGIN.top}
          y2={height - MARGIN.bottom}
          stroke={CHART_TOKEN.border}
          strokeWidth={CENTER_LINE_WIDTH}
        />
        {(annotations ?? []).map((a, ai) => {
          const clamped = clampDivergingAnnotation(a.value, top);
          const stroke = a.color ?? CHART_TOKEN.accent;
          return (
            <g
              key={stableKey([a.label ?? `${a.value}`], ai)}
              data-chart-tip={a.label ?? fmtX(a.value)}
            >
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
        {ordered.map((d, i) => {
          const group = String(d[yKey] ?? "");
          const lv = magOfSide(d, left.key);
          const rv = magOfSide(d, right.key);
          const by = MARGIN.top + i * ROW_H + ROW_TOP_OFFSET;
          const bh = ROW_H - BAR_VERTICAL_INSET;
          const lw = divergingSideWidth(lv, scale);
          const rw = divergingSideWidth(rv, scale);
          const override = itemColor?.(d, i);
          const leftFill = override ?? leftColor;
          const rightFill = override ?? rightColor;
          const { pctL, pctR } = divergingRowShare(lv, rv);
          const tipL = `${group} · ${left.label}: ${fmtX(lv)} (${pctL}% de la fila)`;
          const tipR = `${group} · ${right.label}: ${fmtX(rv)} (${pctR}% de la fila)`;
          return (
            <g key={stableKey([group], i)}>
              {midLabels === "center" ? (
                <text
                  x={midX}
                  y={by + bh / 2}
                  dy={TICK_DY}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                  data-chart-tip={group}
                >
                  {truncateLabel(group, LABEL_MAX_X)}
                </text>
              ) : (
                <text
                  x={midX}
                  y={by - LABEL_GAP_PX}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                  data-chart-tip={group}
                >
                  {truncateLabel(group, LABEL_MAX_X)}
                </text>
              )}
              <g>
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
              {showValues && lw > 0 ? (
                <text
                  x={midX - lw / 2}
                  y={by + bh / 2}
                  dy={TICK_DY}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.onFill}
                >
                  {fmtV(lv)}
                </text>
              ) : null}
              {showValues && rw > 0 ? (
                <text
                  x={midX + rw / 2}
                  y={by + bh / 2}
                  dy={TICK_DY}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.onFill}
                >
                  {fmtV(rv)}
                </text>
              ) : null}
              {showShare ? (
                <>
                  <text
                    x={midX - lw - LABEL_GAP_PX}
                    y={by + bh / 2}
                    dy={TICK_DY}
                    textAnchor="end"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {pctL}%
                  </text>
                  <text
                    x={midX + rw + LABEL_GAP_PX}
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
