/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  NODE_BORDER_WIDTH,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { fitText, measureText } from "../render/measure";
import type { DonutSlice } from "./donut-chart.compute";
import {
  buildDonutArcs,
  buildDonutPath,
  CENTER_LABEL_DY,
  CENTER_VALUE_DY,
  CENTER_VALUE_FONT_SIZE,
  cleanDonutData,
  donutFitsInner,
  donutInnerLabel,
  donutLayout,
  donutLegendLabel,
  donutPercent,
  donutTotal,
  layoutDonutOuterLabels,
  normalizeDonutAngles,
  OUTER_V_PAD,
  orderDonutSlices,
  resolveDonutSliceColor,
  resolveTotalPill,
  TOTAL_PILL_RX,
  totalPillHits,
} from "./donut-chart.compute";
import type { DonutChartProps, PieChartProps } from "./donut-chart.types";

export type {
  DonutChartProps,
  DonutDatum,
  DonutLabelMode,
  PieChartProps,
} from "./donut-chart.types";

/**
 * Dona SSR: arcos con d3-shape, total al centro, leyenda HTML.
 * Filtra no-finitos y valores <= 0; sin datos o total <= 0 → ChartEmpty.
 */
export function DonutChart({
  data,
  ariaLabel,
  size = 220,
  thickness = 38,
  locale = DEFAULT_LOCALE,
  format,
  itemColor,
  totalLabel = "Total",
  showTotal = true,
  startAngle = 0,
  padAngle = 0,
  sortSlices = false,
  cornerRadius = 0,
  innerLabels = "none",
  outerLabels = "none",
  showLegend = true,
  showLegendValues = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: DonutChartProps) {
  const clean = cleanDonutData(data);
  const total = donutTotal(clean);
  if (clean.length === 0 || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);

  const { start, pad, corners } = normalizeDonutAngles(
    startAngle,
    padAngle,
    cornerRadius,
  );
  const { radius, midRadius } = donutLayout(size, thickness);
  const ordered = orderDonutSlices(clean, sortSlices);
  const arcs = buildDonutArcs(ordered, start, pad);
  const path = buildDonutPath(radius, thickness, corners);
  const withInner = innerLabels !== "none";
  const withOuter = outerLabels !== "none";
  const sliceColor = (datum: DonutSlice) =>
    resolveDonutSliceColor(datum, itemColor);
  // Etiquetas externas colocadas en conjunto (con carriles medidos).
  const outerLayout = withOuter
    ? layoutDonutOuterLabels(arcs, radius, size, (datum) =>
        donutInnerLabel(datum, outerLabels, fmt, total),
      )
    : { labels: [], lane: 0 };
  const outerByIndex = new Map(outerLayout.labels.map((p) => [p.index, p]));
  const lane = outerLayout.lane;
  const vpad = lane > 0 ? OUTER_V_PAD : 0;
  const viewW = size + lane * 2;
  const viewH = size + vpad * 2;
  // Total: píldora solo si no cabe en el agujero (siempre en torta).
  const hasHole = thickness < radius;
  const totalText = fmt(total);
  const holeDiam = hasHole ? (radius - thickness) * 2 : 0;
  const pill = showTotal
    ? resolveTotalPill(measureText(totalText, CENTER_VALUE_FONT_SIZE), holeDiam)
    : { show: false, w: 0, h: 0 };

  return (
    <div
      className={
        className
          ? `flex flex-col items-center ${className}`
          : "flex flex-col items-center"
      }
      style={style}
    >
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        width={viewW}
        height={viewH}
        className="h-auto max-w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <g transform={`translate(${viewW / 2},${viewH / 2})`}>
          {arcs.map((a, i) => {
            const datum = a.data;
            const color = sliceColor(datum);
            const pct = donutPercent(datum.value, total);
            const tip = `${datum.label}: ${fmt(datum.value)} (${pct}% del total)`;
            const baseFits = donutFitsInner(withInner, midRadius, a);
            const [innerX, innerY] = baseFits ? path.centroid(a) : [0, 0];
            // Vetada si cae bajo la píldora del total (info intacta en tip).
            const fitsInner = baseFits && !totalPillHits(pill, innerX, innerY);
            const innerText = donutInnerLabel(datum, innerLabels, fmt, total);
            // En modo nombre se recorta al arco disponible.
            const arcLen = (a.endAngle - a.startAngle) * midRadius;
            const shownInner =
              innerLabels === "label" ? fitText(innerText, arcLen) : innerText;
            const outer = outerByIndex.get(i) ?? null;
            return (
              <g key={stableKey([datum.label], i)}>
                <path
                  d={path(a) ?? ""}
                  fill={color}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={NODE_BORDER_WIDTH}
                  data-chart-tip={tip}
                />
                {fitsInner ? (
                  <text
                    x={innerX}
                    y={innerY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.background}
                  >
                    {shownInner}
                  </text>
                ) : null}
                {outer === null ? null : (
                  <g data-chart-tip={tip}>
                    <path
                      d={outer.leader}
                      fill="none"
                      stroke={CHART_TOKEN.muted}
                      strokeWidth={GRID_WIDTH}
                    />
                    <text
                      x={outer.x}
                      y={outer.y}
                      textAnchor={outer.anchor}
                      dominantBaseline="central"
                      fontSize={TICK_FONT_SIZE}
                      fill={CHART_TOKEN.foreground}
                    >
                      {outer.text}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
        {showTotal ? (
          <>
            {pill.show ? (
              <rect
                x={viewW / 2 - pill.w / 2}
                y={viewH / 2 - pill.h / 2}
                width={pill.w}
                height={pill.h}
                rx={TOTAL_PILL_RX}
                fill={CHART_TOKEN.background}
                stroke={CHART_TOKEN.border}
                strokeWidth={NODE_BORDER_WIDTH}
                data-chart-tip={`${totalLabel}: ${totalText}`}
              />
            ) : null}
            <text
              x={viewW / 2}
              y={viewH / 2 - CENTER_VALUE_DY}
              textAnchor="middle"
              fontSize={CENTER_VALUE_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.foreground}
            >
              {fmt(total)}
            </text>
            <text
              x={viewW / 2}
              y={viewH / 2 + CENTER_LABEL_DY}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {totalLabel}
            </text>
          </>
        ) : null}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={ordered.map((d) => ({
            label: donutLegendLabel(d.label, fmt(d.value), showLegendValues),
            color: sliceColor(d),
          }))}
        />
      ) : null}
    </div>
  );
}

/** Torta SSR (dona sin agujero). */
export function PieChart({
  data,
  ariaLabel,
  size = 220,
  locale = DEFAULT_LOCALE,
  format,
  itemColor,
  totalLabel = "Total",
  showTotal = false,
  startAngle = 0,
  padAngle = 0,
  sortSlices = false,
  cornerRadius = 0,
  innerLabels = "none",
  outerLabels = "none",
  showLegend = true,
  showLegendValues = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: PieChartProps) {
  return (
    <DonutChart
      data={data}
      ariaLabel={ariaLabel}
      size={size}
      thickness={size / 2}
      format={format}
      locale={locale}
      itemColor={itemColor}
      totalLabel={totalLabel}
      showTotal={showTotal}
      startAngle={startAngle}
      padAngle={padAngle}
      sortSlices={sortSlices}
      cornerRadius={cornerRadius}
      innerLabels={innerLabels}
      outerLabels={outerLabels}
      showLegend={showLegend}
      showLegendValues={showLegendValues}
      className={className}
      style={style}
      ariaDescribedBy={ariaDescribedBy}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
