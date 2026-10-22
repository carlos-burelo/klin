/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  capKanbanCards,
  computeKanbanStats,
  DEFAULT_CARD_FIELDS,
  DEFAULT_COLLAPSED_COLUMNS,
  FALLBACK_TAG_COLOR,
  resolveKanbanDensity,
  resolveKanbanVisibility,
} from "./kanban-board.compute";
import type { KanbanBoardProps } from "./kanban-board.types";

export type { KanbanDensity, KanbanVisibility } from "./kanban-board.compute";
export {
  capKanbanCards,
  computeKanbanStats,
  DEFAULT_CARD_FIELDS,
  DEFAULT_COLLAPSED_COLUMNS,
  FALLBACK_TAG_COLOR,
  resolveKanbanDensity,
  resolveKanbanVisibility,
} from "./kanban-board.compute";
export type {
  KanbanBoardProps,
  KanbanCard,
  KanbanCardField,
  KanbanColumn,
} from "./kanban-board.types";

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
  maxCards,
  showCounts = true,
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
  const { showTags, showAssignee, showDue } =
    resolveKanbanVisibility(cardFields);
  const { columnCls, cardCls } = resolveKanbanDensity(density);

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
              {showCounts ? (
                <span
                  className={
                    over
                      ? "rounded-full bg-destructive px-1.5 font-mono text-[11px] font-medium text-destructive-foreground tabular-nums"
                      : "rounded-full bg-muted px-1.5 font-mono text-[11px] text-muted-foreground tabular-nums"
                  }
                  data-chart-tip={
                    col.limit === undefined
                      ? `${count} tarjetas`
                      : `${count} de ${col.limit} (WIP)`
                  }
                >
                  {col.limit === undefined ? count : `${count}/${col.limit}`}
                </span>
              ) : null}
            </div>
            {isCollapsed
              ? null
              : (() => {
                  const view = capKanbanCards(col.cards, maxCards);
                  return (
                    <>
                      {view.shown.map((card, ki) => (
                        <div
                          key={stableKey([card.title], ki)}
                          data-chart-tip={
                            card.tag
                              ? `${card.title} · ${card.tag}`
                              : card.title
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
                      {view.hidden > 0 ? (
                        <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                          {`+${view.hidden} más`}
                        </p>
                      ) : null}
                    </>
                  );
                })()}
          </div>
        );
      })}
    </div>
  );
}
