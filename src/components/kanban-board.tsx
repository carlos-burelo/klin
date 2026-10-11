import { ChartEmpty } from "./empty";

export type KanbanCard = {
  title: string;
  tag?: string;
  tagColor?: string;
};

export type KanbanColumn = {
  title: string;
  /** Límite WIP (se marca en destructivo si se excede). */
  limit?: number;
  cards: KanbanCard[];
};

/**
 * Kanban SSR (columnas + tarjetas + límite WIP). HTML puro, sin SVG.
 */
export function KanbanBoard({
  columns,
  ariaLabel,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  columns: KanbanColumn[];
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (columns.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="grid auto-cols-[minmax(180px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-1"
    >
      <title>{ariaLabel}</title>
      {columns.map((col) => {
        const over = col.limit !== undefined && col.cards.length > col.limit;
        return (
          <div
            key={col.title}
            className="flex min-h-24 flex-col gap-2 rounded-lg border bg-muted/40 p-2.5"
          >
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
                    ? `${col.cards.length} tarjetas`
                    : `${col.cards.length} de ${col.limit} (WIP)`
                }
              >
                {col.limit === undefined
                  ? col.cards.length
                  : `${col.cards.length}/${col.limit}`}
              </span>
            </div>
            {col.cards.map((card) => (
              <div
                key={card.title}
                title={card.tag ? `${card.title} · ${card.tag}` : card.title}
                className="rounded-md border bg-card p-2 shadow-xs"
              >
                <p className="text-xs leading-5">{card.title}</p>
                {card.tag ? (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-px text-[10px] font-medium text-accent-foreground">
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: card.tagColor ?? "var(--chart-1)",
                      }}
                    />
                    {card.tag}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
