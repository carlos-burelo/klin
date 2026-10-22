/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { DEFAULT_MAX_NODES } from "../core/limits";
import type { SequenceMessage } from "./sequence-diagram.types";

export const SEQ_W = 680;
export const SEQ_TOP = 44;
export const SEQ_STEP = 40;
export const SEQ_HEAD_W = 120;
export const SEQ_PAD_X = 72;
export const SEQ_HEAD_H = 28;
export const SEQ_HEAD_Y = 8;
export const SEQ_HEAD_RX = 8;
export const SEQ_HEAD_TEXT_DY = 26;
export const SEQ_LIFELINE_TOP_PAD = 4;
export const SEQ_LIFELINE_BOTTOM_PAD = 8;
export const SEQ_BOTTOM_PAD = 24;
export const SEQ_MSG_DY = 16;
export const SEQ_SELF_W = 34;
export const SEQ_SELF_H = 14;
export const SEQ_SELF_TOP = 8;
export const SEQ_LABEL_X = 40;
export const SEQ_LABEL_DY = -2;
export const SEQ_ARROW_NUDGE = 2;
export const SEQ_MSG_LABEL_DY = -6;
export const DASH_LIFELINE = "4 4";
export const DASH_RETURN = "4 3";

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
