/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type StateNode = {
  id: string;
  label: string;
  kind?: "state" | "initial" | "final";
};

export type StateEdge = {
  from: string;
  to: string;
  /** Evento que dispara la transición. */
  label?: string;
};

/** Props del diagrama de estados. */
export type StateDiagramProps = {
  nodes: StateNode[];
  edges: StateEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Dibuja el pseudoinicio aunque ningún nodo lo declare. */
  showInitial?: boolean;
  /** Muestra la leyenda (inicial/final/estado). */
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
