/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

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
  /** Muestra el número de orden antes de cada mensaje. */
  showNumbers?: boolean;
  /** Muestra la leyenda (call/return). */
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
