/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColors } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  AXIS_LABEL_OFFSET,
  buildHorizonBandPaths,
  buildHorizonScale,
  cleanHorizonRows,
  foldHorizonLane,
  HIT_RADIUS,
  LANE_LABEL_DY,
  LANE_LABEL_X,
  MARGIN,
  normalizeHorizonBands,
  resolveHorizonCount,
  resolveHorizonLayout,
  resolveHorizonMaxAbs,
  W,
} from "./horizon-chart.compute";
import type { HorizonChartProps } from "./horizon-chart.types";

export type {
  HorizonChartProps,
  HorizonMode,
  HorizonSeries,
} from "./horizon-chart.types";

/**
 * Gráfico de horizonte SSR (series densas plegadas en bandas).
 * La altura de banda sale del máximo absoluto global (comparable entre
 * carriles); todo-ceros → vacío. Determinista.
 */
export function HorizonChart({
  series,
  labels,
  ariaLabel,
  height = 260,
  bands = 4,
  mode = "mirror",
  formatY,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: HorizonChartProps) {
  const clean = cleanHorizonRows(series);
  if (isBlank(clean)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const n = resolveHorizonCount(clean);
  if (n === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const bandCount = normalizeHorizonBands(bands);
  const maxAbs = resolveHorizonMaxAbs(clean);
  if (!(maxAbs > 0)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtY = resolveFormatter(formatY, locale);
  const { innerW, laneH, bandH } = resolveHorizonLayout(
    clean,
    height,
    bandCount,
    maxAbs,
  );
  const { xs, x } = buildHorizonScale(n, labels, innerW);
  const colors = seriesColors(clean.map((c) => ({ color: c.serie.color })));

  const atX = (i: number) => MARGIN.left + (x(String(i)) ?? 0);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {clean.map((c, si) => {
          const color = colors[si] ?? CHART_TOKEN.chart1;
          const laneTop = MARGIN.top + si * laneH;
          const laneBottom = laneTop + laneH;
          const laneMid = laneTop + laneH / 2;
          // Alturas plegadas por banda en cada índice.
          const folded = foldHorizonLane(c.values, n, mode);
          const bandPaths = buildHorizonBandPaths(
            folded,
            bandCount,
            bandH,
            { laneTop, laneMid, laneBottom },
            mode,
            atX,
          );
          return (
            <g key={stableKey([c.serie.label], si)}>
              <line
                x1={MARGIN.left}
                x2={W - MARGIN.right}
                y1={laneBottom}
                y2={laneBottom}
                stroke={CHART_TOKEN.border}
                strokeWidth={GRID_WIDTH}
              />
              <text
                x={MARGIN.left + LANE_LABEL_X}
                y={laneTop + LANE_LABEL_DY}
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={c.serie.label}
              >
                {truncateLabel(c.serie.label)}
              </text>
              {bandPaths.map((b, bi) => (
                <path
                  key={stableKey(["band"], bi)}
                  d={b.d}
                  fill={color}
                  opacity={b.opacity}
                />
              ))}
              {folded.map((p, i) => {
                const tip = `${c.serie.label} · ${xs[i] ?? i}: ${fmtY(p.v)}`;
                return (
                  <g key={stableKey([String(i)], i)}>
                    <circle
                      cx={atX(i)}
                      cy={laneMid}
                      r={HIT_RADIUS}
                      fill="transparent"
                      pointerEvents="all"
                      data-chart-tip={tip}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
        {xs.map((label, i) => (
          <text
            key={stableKey([label], i)}
            x={atX(i)}
            y={height - AXIS_LABEL_OFFSET}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {truncateLabel(label)}
          </text>
        ))}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={clean.map((c, i) => ({
            label: c.serie.label,
            color: colors[i] ?? CHART_TOKEN.chart1,
          }))}
        />
      ) : null}
    </div>
  );
}
