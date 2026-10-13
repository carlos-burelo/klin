/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { stableKey } from "../lib/keys";
import { CHART_TOKEN } from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

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

/** Campos por defecto de la tarjeta. */
const DEFAULT_CARD_FIELDS: KanbanCardField[] = ["tags"];
/** Columnas colapsadas por defecto (ninguna). */
const DEFAULT_COLLAPSED_COLUMNS: string[] = [];

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
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const FALLBACK_TAG_COLOR = CHART_TOKEN.chart1;

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

/**
 * Kanban SSR (columnas + tarjetas + límite WIP). HTML puro, sin SVG.
 */
export function KanbanBoard({
  columns,
  ariaLabel,
  cardFields = DEFAULT_CARD_FIELDS,
  wipWarn = true,
  collapsedColumns = DEFAULT_COLLAPSED_COLUMNS,
  density = "comfortable",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: KanbanBoardProps) {
  if (isBlank(columns)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const stats = computeKanbanStats(columns);
  const collapsed = new Set(collapsedColumns);
  const showTags = cardFields.includes("tags");
  const showAssignee = cardFields.includes("assignee");
  const showDue = cardFields.includes("due");
  const compact = density === "compact";
  const columnCls = compact
    ? "flex min-h-24 flex-col gap-1 rounded-lg border bg-muted/40 p-1.5"
    : "flex min-h-24 flex-col gap-2 rounded-lg border bg-muted/40 p-2.5";
  const cardCls = compact
    ? "rounded-md border bg-card p-1 shadow-xs"
    : "rounded-md border bg-card p-2 shadow-xs";

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={
        className
          ? `grid auto-cols-[minmax(180px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-1 ${className}`
          : "grid auto-cols-[minmax(180px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-1"
      }
      style={style}
    >
      <title>{ariaLabel}</title>
      {columns.map((col, ci) => {
        const over = (stats[ci]?.over ?? false) && wipWarn;
        const count = stats[ci]?.count ?? col.cards.length;
        const isCollapsed = collapsed.has(col.title);
        return (
          <div key={stableKey([col.title], ci)} className={columnCls}>
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-semibold">
                {col.title}
              </span>
              <span
                className={
                  over
                    ? "rounded-full bg-destructive px-1.5 font-mono text-[11px] font-medium text-destructive-foreground tabular-nums"
                    : "rounded-full bg-muted px-1.5 font-mono text-[11px] text-muted-foreground tabular-nums"
                }
                title={
                  col.limit === undefined
                    ? `${count} tarjetas`
                    : `${count} de ${col.limit} (WIP)`
                }
              >
                {col.limit === undefined ? count : `${count}/${col.limit}`}
              </span>
            </div>
            {isCollapsed
              ? null
              : col.cards.map((card, ki) => (
                  <div
                    key={stableKey([card.title], ki)}
                    title={
                      card.tag ? `${card.title} · ${card.tag}` : card.title
                    }
                    className={cardCls}
                  >
                    <p className="text-xs leading-5">{card.title}</p>
                    {showTags && card.tag ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-px text-[10px] font-medium text-accent-foreground">
                        <span
                          aria-hidden="true"
                          className="size-1.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              card.tagColor ?? FALLBACK_TAG_COLOR,
                          }}
                        />
                        {card.tag}
                      </span>
                    ) : null}
                    {showAssignee && card.assignee ? (
                      <p className="mt-1 truncate text-[10px] text-muted-foreground">
                        {card.assignee}
                      </p>
                    ) : null}
                    {showDue && card.due ? (
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground tabular-nums">
                        {card.due}
                      </p>
                    ) : null}
                  </div>
                ))}
          </div>
        );
      })}
    </div>
  );
}
