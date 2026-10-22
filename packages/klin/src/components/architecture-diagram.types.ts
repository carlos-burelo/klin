/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type ArchNode = {
  id: string;
  label: string;
  sub?: string;
  kind?: "service" | "database" | "queue" | "actor" | "external";
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
};

/** Props del diagrama de arquitectura. */
export type ArchitectureDiagramProps = {
  nodes: ArchNode[];
  edges: ArchEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Sobrescribe el color de trazo por tipo de nodo. */
  statusColors?: Partial<Record<Exclude<ArchNode["kind"], undefined>, string>>;
  /** Muestra la insignia con el tipo de cada nodo. */
  showBadges?: boolean;
  /** Reduce la altura de nodo para mapas grandes. */
  compact?: boolean;
  /** Muestra la leyenda de kinds. */
  showLegend?: boolean;
  /** Tope de nodos (SSR acotado; por defecto `LAYOUT.MAX_NODES`). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
