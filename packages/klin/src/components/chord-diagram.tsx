/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { Chord as ChordDatum, ChordGroup, ChordSubgroup } from "d3-chord";
import { ribbon } from "d3-chord";
import { arc } from "d3-shape";
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  LINK_OPACITY,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartSvg, CHART_W as W } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  ANCHOR_EPS,
  CHORD_PAD_ANGLE,
  computeChordLayout,
  LABEL_DX,
  LABEL_MARGIN,
  MAX_CHORD,
  MIN_OUTER_RADIUS,
  RIBBON_STROKE,
  RING_STROKE,
  RING_THICKNESS,
} from "./chord-diagram.compute";
import type { ChordDiagramProps } from "./chord-diagram.types";

export { computeChordLayout, MAX_CHORD } from "./chord-diagram.compute";
export type {
  ChordDiagramProps,
  ChordLayoutOptions,
} from "./chord-diagram.types";

/**
 * Diagrama de cuerdas SSR (flujos dirigidos entre N grupos en un anillo).
 * Arco por grupo con color de serie + cintas con el color del origen.
 */
export function ChordDiagram({
  labels,
  matrix,
  ariaLabel,
  height = 260,
  format,
  locale = DEFAULT_LOCALE,
  padAngle = CHORD_PAD_ANGLE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  showLabels = true,
  sortGroups = false,
  maxItems = MAX_CHORD,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ChordDiagramProps) {
  if (isBlank(labels) || isBlank(matrix)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const safeH = toNumber(height, 260);
  const {
    labels: capped,
    chords,
    total,
  } = computeChordLayout(labels, matrix, {
    sortGroups,
    maxItems,
    padAngle,
  });
  if (isBlank(capped) || isBlank(chords.groups) || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);
  const cx = W / 2;
  const cy = safeH / 2;
  const outerR = Math.max(
    MIN_OUTER_RADIUS,
    Math.min(W, safeH) / 2 - LABEL_MARGIN,
  );
  const innerR = Math.max(RING_STROKE, outerR - RING_THICKNESS);
  const arcGen = arc<ChordGroup>().innerRadius(innerR).outerRadius(outerR);
  const ribbonGen = ribbon<ChordDatum, ChordSubgroup>().radius(innerR);
  const labelOf = (index: number) => capped[index] ?? "";

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={safeH}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <g transform={`translate(${cx}, ${cy})`}>
          {chords.map((c, i) => {
            const src = labelOf(c.source.index);
            const dst = labelOf(c.target.index);
            const tip = `${src} → ${dst}: ${fmt(c.source.value)}`;
            const color = seriesColor(c.source.index);
            return (
              <g key={stableKey([src, dst], i)}>
                <path
                  d={ribbonGen(c) ?? ""}
                  fill={color}
                  fillOpacity={LINK_OPACITY}
                  stroke={color}
                  strokeWidth={RIBBON_STROKE}
                  data-chart-tip={tip}
                />
              </g>
            );
          })}
          {chords.groups.map((g) => {
            const label = labelOf(g.index);
            const tip = `${label}: ${fmt(g.value)}`;
            const color = seriesColor(g.index);
            const mid = (g.startAngle + g.endAngle) / 2;
            const cos = Math.cos(mid);
            const lx = (outerR + LABEL_DX) * cos;
            const ly = (outerR + LABEL_DX) * Math.sin(mid);
            const anchor =
              cos > ANCHOR_EPS ? "start" : cos < -ANCHOR_EPS ? "end" : "middle";
            return (
              <g key={stableKey([label, g.index], g.index)}>
                <path
                  d={arcGen(g) ?? ""}
                  fill={color}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={RING_STROKE}
                  data-chart-tip={tip}
                />
                {showLabels ? (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={anchor}
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {truncateLabel(label)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={capped.map((label, i) => ({
            label,
            color: seriesColor(i),
          }))}
        />
      ) : null}
    </div>
  );
}
