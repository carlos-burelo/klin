/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { useId } from "react";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../core/theme";
import { pctOf, shareTip } from "../core/tips";
import {
  layoutXLabels,
  ROTATE_EDGE_GAP,
  ROTATE_MAX_W,
  ROTATE_MIN_GAP,
  ROTATE_PAD,
  ROTATE_SIN,
  STAGGER_DY,
} from "../render/cartesian-frame";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
} from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { fitTextMiddle } from "../render/measure";
import { YGrid } from "../render/y-grid";
import {
  ANNOTATION_LABEL_DX,
  ANNOTATION_LABEL_DY,
  AXIS_LABEL_OFFSET,
  computeVerticalStackedModel,
  MIN_SEGMENT_LABEL_PX,
} from "./vertical-stacked-bar.compute";
import type { VerticalStackedBarProps } from "./vertical-stacked-bar.types";

export type { VerticalStackedBarProps } from "./vertical-stacked-bar.types";

/**
 * Barras verticales apiladas SSR, con modo `normalize` (100 %).
 * Soporta negativos con doble base (positivos arriba, negativos abajo);
 * en `normalize` los negativos se clamp a 0 (no se apilan negativos).
 */
export function VerticalStackedBar({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  formatValues,
  normalize = false,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  barRadius = BAR_RADIUS,
  showValues = false,
  gridTicks = GRID_TICKS,
  sortGroups = "none",
  id,
}: VerticalStackedBarProps) {
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
    ordered,
    raws,
    posSums,
    negSums,
    lo,
    hi,
    y,
    x,
    ticks,
    colors,
    fmtY,
    fmt,
  } = computeVerticalStackedModel({
    data,
    xKey,
    series,
    innerW,
    innerH,
    normalize,
    formatY,
    locale,
    gridTicks,
    sortGroups,
    barRadius,
    showLegend,
  });

  const fmtV = formatValues ? resolveFormatter(formatValues, locale) : fmtY;

  // Etiquetas X sin choques (medidas; las omitidas siguen en tips).
  const xLabelLayout = layoutXLabels(
    ordered.map((d, di) => {
      const group = String(d[xKey] ?? "");
      return {
        di,
        x: (x(group) ?? 0) + x.bandwidth() / 2,
        label: truncateLabel(group),
        title: group,
      };
    }),
    innerW,
  );
  const shownLabelIdx = new Set(xLabelLayout.shown.map((l) => l.di));
  const shownLabelPos = new Map(
    xLabelLayout.shown.map((l, i) => [l.di, i] as const),
  );
  const shownLabelByDi = new Map(
    xLabelLayout.shown.map((l) => [l.di, l] as const),
  );
  const rotateExtra = xLabelLayout.rotate
    ? Math.ceil(Math.min(xLabelLayout.maxW, ROTATE_MAX_W) * ROTATE_SIN) +
      ROTATE_PAD
    : 0;
  const viewH = height + rotateExtra;
  const xLabelBaseY =
    height - AXIS_LABEL_OFFSET - (xLabelLayout.stagger ? STAGGER_DY : 0);
  // Rotadas nacen pegadas al plot con tick de anclaje (si no, flotan).
  const vsPlotBottom = height - MARGIN.bottom;
  const vsRotateBaseY = vsPlotBottom + 12;

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={viewH}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmt} />
        {(annotations ?? []).map((a, ai) => {
          const annLo = normalize ? 0 : lo;
          const annHi = normalize ? 1 : hi;
          if (a.value < annLo || a.value > annHi) return null;
          const ay = MARGIN.top + y(a.value);
          return (
            <g
              key={`ann-${a.value}-${ai}`}
              data-chart-tip={a.label ?? String(a.value)}
            >
              <line
                x1={MARGIN.left}
                x2={W - MARGIN.right}
                y1={ay}
                y2={ay}
                stroke={a.color ?? CHART_TOKEN.accent}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              <text
                x={W - MARGIN.right - ANNOTATION_LABEL_DX}
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
        {ordered.map((d, di) => {
          const group = String(d[xKey] ?? "");
          const vals = raws[di] ?? [];
          const posTotal = posSums[di] ?? 0;
          const negTotal = negSums[di] ?? 0;
          const topVal = normalize ? 1 : posTotal;
          const bottomVal = normalize ? 0 : negTotal;
          const yTopPix = y(topVal);
          const yBottomPix = y(bottomVal);
          const colX = MARGIN.left + (x(group) ?? 0);
          const clipId = `${prefix}-vs-${di}`;
          let posBase = 0;
          let negBase = 0;
          return (
            <g key={stableKey([group], di)}>
              {shownLabelIdx.has(di) ? (
                xLabelLayout.rotate ? (
                  (() => {
                    const l = shownLabelByDi.get(di);
                    const lx = colX + x.bandwidth() / 2;
                    const rightRoom =
                      (innerW - (lx - MARGIN.left)) / ROTATE_SIN -
                      ROTATE_EDGE_GAP;
                    const flip = rightRoom < ROTATE_MIN_GAP * 2;
                    const budget = Math.min(
                      ROTATE_MAX_W,
                      Math.max(
                        0,
                        flip
                          ? (lx - MARGIN.left) / ROTATE_SIN - ROTATE_EDGE_GAP
                          : rightRoom,
                      ),
                    );
                    const text = fitTextMiddle(
                      l?.title ?? l?.label ?? group,
                      budget,
                    );
                    if (!text) return null;
                    return (
                      <g key={stableKey([group, "xlabel"], di)}>
                        <line
                          x1={lx}
                          x2={lx}
                          y1={vsPlotBottom}
                          y2={vsRotateBaseY + 2}
                          stroke={CHART_TOKEN.border}
                          strokeWidth={GRID_WIDTH}
                        />
                        <text
                          x={lx}
                          y={vsRotateBaseY}
                          transform={`rotate(45 ${lx} ${vsRotateBaseY})`}
                          textAnchor={flip ? "end" : "start"}
                          fontSize={TICK_FONT_SIZE}
                          fill={CHART_TOKEN.muted}
                          data-chart-tip={group}
                        >
                          {text}
                        </text>
                      </g>
                    );
                  })()
                ) : (
                  <text
                    x={colX + x.bandwidth() / 2}
                    y={xLabelBaseY}
                    dy={
                      xLabelLayout.stagger &&
                      (shownLabelPos.get(di) ?? 0) % 2 === 1
                        ? STAGGER_DY
                        : undefined
                    }
                    textAnchor="middle"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                    data-chart-tip={group}
                  >
                    {truncateLabel(group)}
                  </text>
                )
              ) : null}
              <defs>
                <clipPath id={clipId}>
                  <rect
                    x={colX}
                    y={MARGIN.top + Math.min(yTopPix, yBottomPix)}
                    width={x.bandwidth()}
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
                  // En normalize los negativos se clamp a 0 (no se apilan).
                  const frac =
                    normalize && posTotal > 0
                      ? Math.max(0, raw) / posTotal
                      : raw;
                  const base = frac < 0 ? negBase : posBase;
                  const v0 = base;
                  const v1 = base + frac;
                  if (frac < 0) negBase = v1;
                  else posBase = v1;
                  const y0pix = y(v0);
                  const y1pix = y(v1);
                  const pixH = Math.abs(y1pix - y0pix);
                  const total = posTotal + negTotal;
                  const tip = normalize
                    ? `${group} · ${s.label}: ${fmtY(raw)} (${pctOf(Math.max(0, raw), posTotal)}%)`
                    : shareTip({
                        label: group,
                        series: s.label,
                        formatted: fmtY(raw),
                        value: raw,
                        total,
                        multi: series.length >= 2,
                        of: "grupo",
                      });
                  if (frac === 0) return <g key={s.key} />;
                  return (
                    <g key={s.key}>
                      <rect
                        x={colX}
                        y={MARGIN.top + Math.min(y0pix, y1pix)}
                        width={x.bandwidth()}
                        height={Math.max(MIN_SHAPE_PX, pixH)}
                        fill={colors[si] ?? CHART_TOKEN.chart1}
                        data-chart-tip={tip}
                      />
                      {showValues && pixH >= MIN_SEGMENT_LABEL_PX ? (
                        <text
                          x={colX + x.bandwidth() / 2}
                          y={MARGIN.top + (y0pix + y1pix) / 2}
                          dy={TICK_DY}
                          textAnchor="middle"
                          fontSize={TICK_FONT_SIZE}
                          fill={CHART_TOKEN.background}
                        >
                          {normalize
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
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={series.map((s, i) => ({
            label: s.label,
            color: colors[i] ?? CHART_TOKEN.chart1,
          }))}
        />
      ) : null}
    </div>
  );
}
