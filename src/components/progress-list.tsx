import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type ProgressRow = {
  label: string;
  value: number;
  total?: number;
  detail?: string;
};

/**
 * Lista de medidores lineales SSR (label + pista + valor tabular).
 */
export function ProgressList({
  rows,
  ariaLabel,
  formatValue = formatDefault,
  color,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  rows: ProgressRow[];
  ariaLabel: string;
  formatValue?: (value: number) => string;
  color?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (rows.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fill = seriesColor(0, color);

  return (
    <div role="img" aria-label={ariaLabel} className="flex flex-col gap-3">
      <title>{ariaLabel}</title>
      {rows.map((row) => {
        const total = Math.max(row.total ?? row.value, 1);
        const pct = Math.min(100, Math.max(0, (row.value / total) * 100));
        const tip =
          `${row.label}: ${formatValue(row.value)} de ${formatValue(row.total ?? row.value)}` +
          (row.detail ? ` (${row.detail})` : "");
        return (
          <div key={row.label} title={tip} data-chart-tip={tip}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span
                className="truncate text-xs text-muted-foreground"
                title={row.detail ? `${row.label} · ${row.detail}` : row.label}
              >
                {row.label}
              </span>
              <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums">
                {formatValue(row.value)}
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
              role="presentation"
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: fill }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
