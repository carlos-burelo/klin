/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type ActorNode = {
  id: string;
  label: string;
};

export type UseCaseNode = {
  id: string;
  label: string;
};

export type UseCaseEdge = {
  from: string;
  to: string;
  /** `include` / `extend` (punteada) o asociación simple. */
  kind?: "association" | "include" | "extend";
};

/** Props del diagrama de casos de uso. */
export type UseCaseDiagramProps = {
  actors: ActorNode[];
  usecases: UseCaseNode[];
  edges: UseCaseEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Título del rectángulo de sistema que enmarca los casos de uso. */
  boundary?: string;
  /** Muestra las etiquetas de estereotipo (`«include»`/`«extend»`). */
  showStereotypes?: boolean;
  /** Muestra la leyenda (association/include/extend). */
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
