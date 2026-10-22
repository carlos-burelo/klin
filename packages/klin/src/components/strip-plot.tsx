/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand } from "d3-scale";
import { buildValueAxis } from "../core/cartesian-model";
import { seriesColors } from "../core/color";

import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
} from "../core/theme";
import { CartesianFrame } from "../render/cartesian-frame";
import { CHART_MARGIN as MARGIN, CHART_W as W } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  computeStripPositions,
  DEFAULT_JITTER,
  DEFAULT_JITTER_SEED,
  GROUP_BAND_PADDING,
  STRIP_FILL_OPACITY,
} from "./strip-plot.compute";
import type { StripPlotProps } from "./strip-plot.types";

export {
  computeStripPositions,
  DEFAULT_JITTER,
  DEFAULT_JITTER_SEED,
  GROUP_BAND_PADDING,
  mulberry32,
  STRIP_FILL_OPACITY,
} from "./strip-plot.compute";
export type { StripGroup, StripPlotProps } from "./strip-plot.types";

/**
 * Puntos 1D con jitter determinista por grupo (tira cómica seria:
 * la forma de la distribución se lee sin solapamiento total).
 */
export function StripPlot({
  groups,
  ariaLabel,
  height = 260,
  formatY,
  locale = DEFAULT_LOCALE,
  jitter = DEFAULT_JITTER,
  seed = DEFAULT_JITTER_SEED,
  gridTicks = GRID_TICKS,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: StripPlotProps) {
  const computed = groups
    .slice(0, DEFAULT_MAX_ROWS)
    .map((group) => ({
      group,
      clean: group.values
        .map((v) => toNumber(v, Number.NaN))
        .filter((v) => Number.isFinite(v)),
    }))
    .filter((c) => c.clean.length > 0);
  if (isBlank(computed)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const {
    lo,
    hi,
    y,
    ticks,
    fmt: fmtY,
  } = buildValueAxis(
    {
      values: computed.flatMap((c) => c.clean),
      ticks: gridTicks,
      format: formatY,
      locale,
    },
    [innerH, 0],
  );
  const x = scaleBand()
    .domain(computed.map((c) => c.group.label))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const colors = seriesColors(computed.map((c) => ({ color: c.group.color })));
  const spread = Math.min(1, Math.max(0, toNumber(jitter, DEFAULT_JITTER)));
  const legendItems = showLegend
    ? computed.map((c, i) => ({
        label: c.group.label,
        color: colors[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;

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
      annLo={lo}
      annHi={hi}
      xLabels={computed.map((c) => {
        const cx = (x(c.group.label) ?? 0) + x.bandwidth() / 2;
        return {
          x: cx,
          label: truncateLabel(c.group.label),
          title: c.group.label,
        };
      })}
      legendItems={legendItems}
    >
      {computed.map((c, gi) => {
        const cx = MARGIN.left + (x(c.group.label) ?? 0) + x.bandwidth() / 2;
        const halfW = (x.bandwidth() / 2) * spread;
        const offsets = computeStripPositions(c.clean.length, seed + gi, halfW);
        const color = colors[gi] ?? CHART_TOKEN.chart1;
        return (
          <g key={stableKey([c.group.label], gi)}>
            {c.clean.map((v, vi) => {
              const tip = `${c.group.label}: ${fmtY(v)}`;
              return (
                <g key={stableKey([c.group.label, String(vi)], vi)}>
                  <circle
                    cx={cx + (offsets[vi] ?? 0)}
                    cy={MARGIN.top + y(v)}
                    r={POINT_RADIUS_SCATTER}
                    fill={color}
                    fillOpacity={STRIP_FILL_OPACITY}
                    stroke={CHART_TOKEN.background}
                    strokeWidth={POINT_BORDER}
                    data-chart-tip={tip}
                  />
                </g>
              );
            })}
          </g>
        );
      })}
    </CartesianFrame>
  );
}
