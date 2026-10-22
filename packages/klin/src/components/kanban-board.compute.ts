/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { CHART_TOKEN } from "../core/theme";
import type { KanbanCardField, KanbanColumn } from "./kanban-board.types";

/** Campos por defecto de la tarjeta. */
export const DEFAULT_CARD_FIELDS: KanbanCardField[] = ["tags"];
/** Columnas colapsadas por defecto (ninguna). */
export const DEFAULT_COLLAPSED_COLUMNS: string[] = [];

export const FALLBACK_TAG_COLOR = CHART_TOKEN.chart1;

/** Densidad del tablero. */
export type KanbanDensity = "comfortable" | "compact";

/** Visibilidad de campos de la tarjeta (verbatim de la vista). */
export type KanbanVisibility = {
  showTags: boolean;
  showAssignee: boolean;
  showDue: boolean;
};

/**
 * Cómputo puro de conteos WIP por columna (testable, sin JSX).
 */
export function computeKanbanStats(columns: KanbanColumn[]): Array<{
  count: number;
  over: boolean;
}> {
  return columns.map((col) => ({
    count: col.cards.length,
    over: col.limit !== undefined && col.cards.length > col.limit,
  }));
}

/** Visibilidad por campo (verbatim de la vista). */
export function resolveKanbanVisibility(
  cardFields: KanbanCardField[],
): KanbanVisibility {
  return {
    showTags: cardFields.includes("tags"),
    showAssignee: cardFields.includes("assignee"),
    showDue: cardFields.includes("due"),
  };
}

/** Tarjetas visibles por `maxCards` + ocultas (`+N`); sin cap por defecto. */
export function capKanbanCards(
  cards: KanbanColumn["cards"],
  maxCards?: number,
): { shown: KanbanColumn["cards"]; hidden: number } {
  if (maxCards === undefined) return { shown: cards, hidden: 0 };
  const limit = Math.max(0, Math.floor(maxCards));
  const shown = cards.slice(0, limit);
  return { shown, hidden: cards.length - shown.length };
}

/** Clases por densidad (verbatim de la vista). */
export function resolveKanbanDensity(density: KanbanDensity): {
  compact: boolean;
  columnCls: string;
  cardCls: string;
} {
  const compact = density === "compact";
  return {
    compact,
    columnCls: compact
      ? "flex min-h-24 flex-col gap-1 rounded-lg border bg-muted/40 p-1.5"
      : "flex min-h-24 flex-col gap-2 rounded-lg border bg-muted/40 p-2.5",
    cardCls: compact
      ? "rounded-md border bg-card p-1 shadow-xs"
      : "rounded-md border bg-card p-2 shadow-xs",
  };
}
