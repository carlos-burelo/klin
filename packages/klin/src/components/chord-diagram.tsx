/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import {
  type Chord as ChordDatum,
  type ChordGroup,
  type ChordSubgroup,
  type Chords,
  chord,
  ribbon,
} from "d3-chord";
import { arc } from "d3-shape";
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { ChartSvg, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  LINK_OPACITY,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Cap SSR de la matriz (trunca determinista a 12x12). */
export const MAX_CHORD = 12;

/** Separación entre grupos vecinos (radianes). */
const CHORD_PAD_ANGLE = 0.05;
/** Grosor del anillo de grupos y reserva radial para etiquetas. */
const RING_THICKNESS = 18;
const LABEL_MARGIN = 64;
const LABEL_DX = 12;
/** Coseno mínimo para alinear etiqueta a un lado (si no, centrada). */
const ANCHOR_EPS = 0.2;
/** Radio exterior mínimo (evita colapso con alturas diminutas). */
const MIN_OUTER_RADIUS = 48;
/** Grosores de trazo del anillo y de la cinta. */
const RING_STROKE = 1.5;
const RIBBON_STROKE = 1;

/** Props de ChordDiagram. */
export type ChordDiagramProps = {
  labels: string[];
  matrix: number[][];
  ariaLabel: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Muestra las etiquetas de cada grupo del anillo. */
  showLabels?: boolean;
  /** Ordena grupos por flujo total descendente (reordena la matriz). */
  sortGroups?: boolean;
  /** Tope de grupos (1–MAX_CHORD). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

/** Opciones puras del layout chord (paridad S del componente). */
export type ChordLayoutOptions = {
  /** Ordena grupos por flujo total descendente (reordena la matriz). */
  sortGroups?: boolean;
  /** Tope de grupos (1–MAX_CHORD). */
  maxItems?: number;
};

/**
 * Cómputo puro del layout chord (trunca determinista a MAX_CHORD,
 * clamp a >= 0 con toNumber; nunca toca el DOM).
 */
export function computeChordLayout(
  labels: string[],
  matrix: number[][],
  opts?: ChordLayoutOptions,
) {
  const rawMax = Math.floor(toNumber(opts?.maxItems ?? MAX_CHORD, MAX_CHORD));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0
      ? Math.min(rawMax, MAX_CHORD)
      : MAX_CHORD;
  const order = labels.slice(0, safeMax).map((_, i) => i);
  if (opts?.sortGroups) {
    const totals = order.map((i) => {
      let acc = 0;
      for (const j of order) {
        acc += Math.max(0, toNumber(matrix[i]?.[j]));
        acc += Math.max(0, toNumber(matrix[j]?.[i]));
      }
      return acc;
    });
    order.sort((a, b) => (totals[b] ?? 0) - (totals[a] ?? 0));
  }
  const capped = order.map((i) => labels[i] ?? "");
  const n = capped.length;
  const clean: number[][] = [];
  for (let i = 0; i < n; i += 1) {
    const src = order[i] ?? i;
    const row = matrix[src] ?? [];
    const cleanRow: number[] = [];
    for (let j = 0; j < n; j += 1) {
      cleanRow.push(Math.max(0, toNumber(row[order[j] ?? j])));
    }
    clean.push(cleanRow);
  }
  const layout = chord().padAngle(CHORD_PAD_ANGLE);
  const chords: Chords = layout(clean);
  let total = 0;
  for (const row of clean) {
    for (const v of row) total += v;
  }
  return { labels: capped, matrix: clean, chords, total };
}

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
                <title>{tip}</title>
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
                <title>{tip}</title>
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
