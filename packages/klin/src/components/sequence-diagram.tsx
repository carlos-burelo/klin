/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_NODES } from "../lib/limits";
import { truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type SequenceMessage = {
  from: string;
  to: string;
  label: string;
  /** `call` (sólida) o `return` (punteada). */
  kind?: "call" | "return";
};

/** Props del diagrama de secuencia. */
export type SequenceDiagramProps = {
  participants: string[];
  messages: SequenceMessage[];
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const SEQ_W = 680;
const SEQ_TOP = 44;
const SEQ_STEP = 40;
const SEQ_HEAD_W = 120;
const SEQ_PAD_X = 72;
const SEQ_HEAD_H = 28;
const SEQ_HEAD_Y = 8;
const SEQ_HEAD_RX = 8;
const SEQ_HEAD_TEXT_DY = 26;
const SEQ_LIFELINE_TOP_PAD = 4;
const SEQ_LIFELINE_BOTTOM_PAD = 8;
const SEQ_BOTTOM_PAD = 24;
const SEQ_MSG_DY = 16;
const SEQ_SELF_W = 34;
const SEQ_SELF_H = 14;
const SEQ_SELF_TOP = 8;
const SEQ_LABEL_X = 40;
const SEQ_LABEL_DY = -2;
const SEQ_ARROW_NUDGE = 2;
const SEQ_MSG_LABEL_DY = -6;
const ARROW_MARKER = {
  SIZE: 10,
  REF_X: 8,
  REF_Y: 5,
  WIDTH: 7,
  HEIGHT: 7,
} as const;
const DASH_LIFELINE = "4 4";
const DASH_RETURN = "4 3";

/** Cap de mensajes (alias de DEFAULT_MAX_NODES, compat). */
export const MAX_SEQUENCE_MESSAGES = DEFAULT_MAX_NODES;

/**
 * Cómputo puro de la secuencia: filtra desconocidos, trunca a N y
 * precalcula posiciones X por participante + altura.
 */
export function computeSequenceLayout(
  participants: string[],
  messages: SequenceMessage[],
): {
  clean: SequenceMessage[];
  colIndex: Map<string, number>;
  height: number;
} {
  const known = new Set(participants);
  const clean = messages
    .filter((m) => known.has(m.from) && known.has(m.to))
    .slice(0, MAX_SEQUENCE_MESSAGES);
  return {
    clean,
    colIndex: new Map(participants.map((p, i) => [p, i])),
    height: SEQ_TOP + clean.length * SEQ_STEP + SEQ_BOTTOM_PAD,
  };
}

/**
 * Secuencia SSR (participantes, líneas de vida y mensajes ordenados).
 */
export function SequenceDiagram({
  participants,
  messages,
  ariaLabel,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: SequenceDiagramProps) {
  if (participants.length === 0 || messages.length === 0) {
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
        <title>{ariaLabel}</title>
        <defs>
          <marker
            id="charts-seq-arrow"
            viewBox={`0 0 ${ARROW_MARKER.SIZE} ${ARROW_MARKER.SIZE}`}
            refX={ARROW_MARKER.REF_X}
            refY={ARROW_MARKER.REF_Y}
            markerWidth={ARROW_MARKER.WIDTH}
            markerHeight={ARROW_MARKER.HEIGHT}
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={CHART_TOKEN.muted} />
          </marker>
        </defs>
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
          const tip = `${order + 1}. ${m.from} → ${m.to}: ${m.label}`;
          if (m.from === m.to) {
            return (
              <g key={stableKey([m.from, m.label, y], order)}>
                <title>{tip}</title>
                <path
                  d={`M ${x1} ${y - SEQ_SELF_TOP} h ${SEQ_SELF_W} v ${SEQ_SELF_H} h -${SEQ_SELF_W}`}
                  fill="none"
                  stroke={CHART_TOKEN.accent}
                  strokeWidth={EDGE_WIDTH}
                  strokeDasharray={dashed ? DASH_RETURN : undefined}
                  markerEnd="url(#charts-seq-arrow)"
                  data-chart-tip={tip}
                />
                <text
                  x={x1 + SEQ_LABEL_X}
                  y={y + SEQ_LABEL_DY}
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(`${order + 1}. ${m.label}`, 30)}
                </text>
              </g>
            );
          }
          const leftToRight = x2 > x1;
          return (
            <g key={stableKey([m.from, m.to, m.label, y], order)}>
              <title>{tip}</title>
              <line
                x1={x1}
                x2={x2 + (leftToRight ? -SEQ_ARROW_NUDGE : SEQ_ARROW_NUDGE)}
                y1={y}
                y2={y}
                stroke={dashed ? CHART_TOKEN.muted : CHART_TOKEN.accent}
                strokeWidth={EDGE_WIDTH}
                strokeDasharray={dashed ? DASH_RETURN : undefined}
                markerEnd="url(#charts-seq-arrow)"
                data-chart-tip={tip}
              />
              <text
                x={(x1 + x2) / 2}
                y={y + SEQ_MSG_LABEL_DY}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {truncateLabel(`${order + 1}. ${m.label}`, 34)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
