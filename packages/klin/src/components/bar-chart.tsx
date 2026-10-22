/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { useId } from "react";
import { placeTopValueLabel } from "../core/cartesian-model";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  TICK_DY,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../core/theme";
import { pctOf, shareTip } from "../core/tips";
import { CartesianFrame } from "../render/cartesian-frame";
import { CHART_MARGIN as MARGIN, CHART_W as W } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  computeBarModel,
  HIGHLIGHT_WIDTH,
  MIN_SEGMENT_LABEL_PX,
} from "./bar-chart.compute";
import type { BarChartProps } from "./bar-chart.types";

export type { BarChartProps } from "./bar-chart.types";

/**
 * Barras verticales SSR (agrupadas, apiladas o al 100 %). Función pura
 * props → SVG, responsiva por `viewBox`. Ejes y grid calculados con
 * d3-scale/d3-array. Soporta negativos (línea de cero) y filtra
 * no-finitos como 0.
 */
export function BarChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  formatValues,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  barColor,
  layout = "grouped",
  barRadius = BAR_RADIUS,
  showValues = false,
  yMin,
  yMax,
  gridTicks = GRID_TICKS,
  sortGroups = "none",
  highlightMax = false,
  yScale = "linear",
  id,
}: BarChartProps) {
  // useId arriba: hooks siempre en mismo orden (antes del early return).
  const uid = useId();
  if (isBlank(data) || isBlank(series)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const prefix =
    id == null || id === ""
      ? uid.replace(/:/g, "")
      : id.replace(/[^a-zA-Z0-9_-]/g, "");

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const {
    radius,
    stacked,
    percent,
    ordered,
    raws,
    posSums,
    negSums,
    totals,
    maxGroup,
    y,
    ticks,
    fmtY,
    lv,
    x0,
    x1,
    colors,
    annLo,
    annHi,
    legendItems,
    y0,
  } = computeBarModel({
    data,
    xKey,
    series,
    innerW,
    innerH,
    layout,
    sortGroups,
    barRadius,
    gridTicks,
    yMin,
    yMax,
    yScale,
    formatY,
    locale,
    showLegend,
  });

  const fmtV = formatValues ? resolveFormatter(formatValues, locale) : fmtY;

  return (
    <CartesianFrame
      height={height}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      className={className}
      style={style}
      ticks={ticks}
      y={y}
      formatY={fmtY}
      annotations={annotations}
      annLo={annLo}
      annHi={annHi}
      xLabels={ordered.map((d) => {
        const group = String(d[xKey] ?? "");
        return {
          x: (x0(group) ?? 0) + x0.bandwidth() / 2,
          label: truncateLabel(group),
          title: group,
        };
      })}
      legendItems={legendItems}
    >
      {ordered.map((d, di) => {
        const group = String(d[xKey] ?? "");
        const total = totals[di] ?? 0;
        const isMax = highlightMax && di === maxGroup;
        const hl = isMax
          ? { stroke: CHART_TOKEN.accent, strokeWidth: HIGHLIGHT_WIDTH }
          : {};
        if (stacked) {
          const vals = raws[di] ?? [];
          const posTotal = posSums[di] ?? 0;
          const topVal = percent ? 1 : posTotal;
          const bottomVal = percent ? 0 : (negSums[di] ?? 0);
          const yTopPix = y(lv(topVal));
          const yBottomPix = y(lv(bottomVal));
          const colX = MARGIN.left + (x0(group) ?? 0);
          const colW = x0.bandwidth();
          const clipId = `${prefix}-bc-${di}`;
          let posBase = 0;
          let negBase = 0;
          return (
            <g key={stableKey([group], di)}>
              <defs>
                <clipPath id={clipId}>
                  <rect
                    x={colX}
                    y={MARGIN.top + Math.min(yTopPix, yBottomPix)}
                    width={colW}
                    height={Math.max(
                      MIN_SHAPE_PX,
                      Math.abs(yBottomPix - yTopPix),
                    )}
                    rx={radius}
                  />
                </clipPath>
              </defs>
              <g clipPath={`url(#${clipId})`}>
                {series.map((s, si) => {
                  const raw = vals[si] ?? toNumber(d[s.key]);
                  // En percent los negativos se fijan a 0 (no se apilan).
                  const frac =
                    percent && posTotal > 0 ? Math.max(0, raw) / posTotal : raw;
                  const base = frac < 0 ? negBase : posBase;
                  const v0 = base;
                  const v1 = base + frac;
                  if (frac < 0) negBase = v1;
                  else posBase = v1;
                  const yA = y(lv(v0));
                  const yB = y(lv(v1));
                  const pixH = Math.abs(yB - yA);
                  const multi = series.length >= 2;
                  const baseTip = `${group} · ${s.label}: ${fmtY(raw)}`;
                  const tip = percent
                    ? `${baseTip} (${pctOf(Math.max(0, raw), posTotal)}%)`
                    : shareTip({
                        label: group,
                        series: s.label,
                        formatted: fmtY(raw),
                        value: raw,
                        total,
                        multi,
                        of: "grupo",
                      });
                  if (frac === 0) return <g key={s.key} />;
                  const fill = barColor?.(d, di, s, si) ?? colors[si];
                  return (
                    <g key={s.key}>
                      <rect
                        x={colX}
                        y={MARGIN.top + Math.min(yA, yB)}
                        width={colW}
                        height={Math.max(MIN_SHAPE_PX, pixH)}
                        fill={fill}
                        data-chart-tip={tip}
                        {...hl}
                      />
                      {showValues && pixH >= MIN_SEGMENT_LABEL_PX ? (
                        <text
                          x={colX + colW / 2}
                          y={MARGIN.top + (yA + yB) / 2}
                          dy={TICK_DY}
                          textAnchor="middle"
                          fontSize={TICK_FONT_SIZE}
                          fill={CHART_TOKEN.background}
                        >
                          {percent
                            ? `${Math.round(frac * PERCENT_FACTOR)}%`
                            : fmtV(raw)}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
              </g>
            </g>
          );
        }
        return (
          <g key={stableKey([group], di)}>
            {series.map((s, si) => {
              const value = toNumber(d[s.key]);
              const bw = x1.bandwidth();
              const bx = MARGIN.left + (x0(group) ?? 0) + (x1(s.key) ?? 0);
              const yV = y(lv(value));
              const rectY =
                value === 0
                  ? MARGIN.top + y0 - ZERO_MARK_PX / 2
                  : MARGIN.top + Math.min(y0, yV);
              const rectH =
                value === 0
                  ? ZERO_MARK_PX
                  : Math.max(MIN_SHAPE_PX, Math.abs(y0 - yV));
              const tip = shareTip({
                label: group,
                series: s.label,
                formatted: fmtY(value),
                value,
                total,
                multi: series.length >= 2,
                of: "grupo",
              });
              const fill = barColor?.(d, di, s, si) ?? colors[si];
              const vl = placeTopValueLabel(rectY, MARGIN.top, TICK_FONT_SIZE);
              return (
                <g key={s.key}>
                  <rect
                    x={bx}
                    y={rectY}
                    width={Math.max(MIN_SHAPE_PX, bw)}
                    height={rectH}
                    rx={radius}
                    fill={fill}
                    data-chart-tip={tip}
                    {...hl}
                  />
                  {showValues ? (
                    <text
                      x={bx + Math.max(MIN_SHAPE_PX, bw) / 2}
                      y={vl.pos}
                      textAnchor="middle"
                      fontSize={TICK_FONT_SIZE}
                      fill={
                        vl.inside ? CHART_TOKEN.background : CHART_TOKEN.muted
                      }
                    >
                      {fmtV(value)}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
        );
      })}
    </CartesianFrame>
  );
}
