/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type KanbanCard = {
  title: string;
  tag?: string;
  tagColor?: string;
  /** Responsable (nombre o iniciales; visible con `cardFields: ["assignee"]`). */
  assignee?: string;
  /** Vencimiento `YYYY-MM-DD` (visible con `cardFields: ["due"]`). */
  due?: string;
};

/** Campos visibles de la tarjeta. */
export type KanbanCardField = "tags" | "assignee" | "due";

export type KanbanColumn = {
  title: string;
  /** Límite WIP (se marca en destructivo si se excede). */
  limit?: number;
  cards: KanbanCard[];
};

/** Props del tablero kanban. */
export type KanbanBoardProps = {
  columns: KanbanColumn[];
  ariaLabel: string;
  /** Campos visibles de cada tarjeta. */
  cardFields?: KanbanCardField[];
  /** Resalta en destructivo el exceso de WIP. */
  wipWarn?: boolean;
  /** Títulos de columnas colapsadas (solo cabecera). */
  collapsedColumns?: string[];
  /** Densidad de columnas y tarjetas. */
  density?: "comfortable" | "compact";
  /** Máximo de tarjetas visibles por columna (resto en `+N`); sin cap. */
  maxCards?: number;
  /** Muestra el conteo de tarjetas en la cabecera. */
  showCounts?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
