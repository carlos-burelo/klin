/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";

import {
  CHART_TOKEN,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { markerUrl, SvgMarkers } from "../render/markers";
import {
  computeSequenceLayout,
  DASH_LIFELINE,
  DASH_RETURN,
  SEQ_ARROW_NUDGE,
  SEQ_HEAD_H,
  SEQ_HEAD_RX,
  SEQ_HEAD_TEXT_DY,
  SEQ_HEAD_W,
  SEQ_HEAD_Y,
  SEQ_LABEL_DY,
  SEQ_LABEL_X,
  SEQ_LIFELINE_BOTTOM_PAD,
  SEQ_LIFELINE_TOP_PAD,
  SEQ_MSG_DY,
  SEQ_MSG_LABEL_DY,
  SEQ_PAD_X,
  SEQ_SELF_H,
  SEQ_SELF_TOP,
  SEQ_SELF_W,
  SEQ_STEP,
  SEQ_TOP,
  SEQ_W,
} from "./sequence-diagram.compute";
import type { SequenceDiagramProps } from "./sequence-diagram.types";

export {
  computeSequenceLayout,
  MAX_SEQUENCE_MESSAGES,
} from "./sequence-diagram.compute";
export type {
  SequenceDiagramProps,
  SequenceMessage,
} from "./sequence-diagram.types";

/**
 * Secuencia SSR (participantes, líneas de vida y mensajes ordenados).
 */
export function SequenceDiagram({
  participants,
  messages,
  ariaLabel,
  showNumbers = true,
  showLegend = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: SequenceDiagramProps) {
  if (isBlank(participants) || isBlank(messages)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { clean, colIndex, height } = computeSequenceLayout(
    participants,
    messages,
  );
  const innerW = SEQ_W - SEQ_PAD_X * 2;
  const colX = (i: number) =>
    SEQ_PAD_X +
    (participants.length === 1
      ? innerW / 2
      : (i * innerW) / (participants.length - 1));

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <svg
        viewBox={`0 0 ${SEQ_W} ${height}`}
        className="h-auto w-full"
        style={{ minWidth: SEQ_W }}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <SvgMarkers prefix="charts-seq" kinds={["arrow"]} />
        {participants.map((p, i) => (
          <g key={stableKey([p], i)}>
            <rect
              x={colX(i) - SEQ_HEAD_W / 2}
              y={SEQ_HEAD_Y}
              width={SEQ_HEAD_W}
              height={SEQ_HEAD_H}
              rx={SEQ_HEAD_RX}
              fill={CHART_TOKEN.card}
              stroke={CHART_TOKEN.border}
              strokeWidth={EDGE_WIDTH}
            />
            <text
              x={colX(i)}
              y={SEQ_HEAD_TEXT_DY}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.foreground}
            >
              {truncateLabel(p, 16)}
            </text>
            <line
              x1={colX(i)}
              x2={colX(i)}
              y1={SEQ_TOP - SEQ_LIFELINE_TOP_PAD}
              y2={height - SEQ_LIFELINE_BOTTOM_PAD}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
              strokeDasharray={DASH_LIFELINE}
            />
          </g>
        ))}
        {clean.map((m, order) => {
          const y = SEQ_TOP + order * SEQ_STEP + SEQ_MSG_DY;
          const x1 = colX(colIndex.get(m.from) ?? 0);
          const x2 = colX(colIndex.get(m.to) ?? 0);
          const dashed = m.kind === "return";
          const numbered = showNumbers ? `${order + 1}. ${m.label}` : m.label;
          const tip = showNumbers
            ? `${order + 1}. ${m.from} → ${m.to}: ${m.label}`
            : `${m.from} → ${m.to}: ${m.label}`;
          if (m.from === m.to) {
            return (
              <g key={stableKey([m.from, m.label, y], order)}>
                <path
                  d={`M ${x1} ${y - SEQ_SELF_TOP} h ${SEQ_SELF_W} v ${SEQ_SELF_H} h -${SEQ_SELF_W}`}
                  fill="none"
                  stroke={CHART_TOKEN.accent}
                  strokeWidth={EDGE_WIDTH}
                  strokeDasharray={dashed ? DASH_RETURN : undefined}
                  markerEnd={markerUrl("charts-seq", "arrow")}
                  data-chart-tip={tip}
                />
                <text
                  x={x1 + SEQ_LABEL_X}
                  y={y + SEQ_LABEL_DY}
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(numbered, 30)}
                </text>
              </g>
            );
          }
          const leftToRight = x2 > x1;
          return (
            <g key={stableKey([m.from, m.to, m.label, y], order)}>
              <line
                x1={x1}
                x2={x2 + (leftToRight ? -SEQ_ARROW_NUDGE : SEQ_ARROW_NUDGE)}
                y1={y}
                y2={y}
                stroke={dashed ? CHART_TOKEN.muted : CHART_TOKEN.accent}
                strokeWidth={EDGE_WIDTH}
                strokeDasharray={dashed ? DASH_RETURN : undefined}
                markerEnd={markerUrl("charts-seq", "arrow")}
                data-chart-tip={tip}
              />
              <text
                x={(x1 + x2) / 2}
                y={y + SEQ_MSG_LABEL_DY}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {truncateLabel(numbered, 34)}
              </text>
            </g>
          );
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Llamada", color: CHART_TOKEN.accent },
            { label: "Retorno", color: CHART_TOKEN.muted },
          ]}
        />
      ) : null}
    </div>
  );
}
