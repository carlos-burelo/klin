import { max, min } from "d3-array";
import { scaleTime } from "d3-scale";
import { formatDefault, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type GanttTask = {
  label: string;
  start: string | Date;
  end: string | Date;
  /** 0–100. */
  progress?: number;
  color?: string;
};

const W = 640;
const MARGIN = { top: 8, right: 12, bottom: 28, left: 148 };
const ROW_H = 30;

/**
 * Gantt SSR (tareas en el tiempo, con % de avance opcional).
 * Fechas `YYYY-MM-DD` o `Date`.
 */
export function GanttChart({
  tasks,
  ariaLabel,
  formatDate,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  tasks: GanttTask[];
  ariaLabel: string;
  formatDate?: (d: Date) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (tasks.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const height = Math.max(
    120,
    MARGIN.top + MARGIN.bottom + tasks.length * ROW_H,
  );
  const innerW = W - MARGIN.left - MARGIN.right;

  const toDate = (v: string | Date) =>
    v instanceof Date ? v : new Date(`${v}T12:00:00`);
  const starts = tasks.map((t) => toDate(t.start).getTime());
  const ends = tasks.map((t) => toDate(t.end).getTime());
  const lo = min(starts) ?? Date.now();
  const hi = Math.max(max(ends) ?? Date.now(), lo + 86_400_000);

  const x = scaleTime()
    .domain([new Date(lo - 86_400_000), new Date(hi + 86_400_000)])
    .range([0, innerW]);
  const fmt =
    formatDate ??
    ((d: Date) =>
      d.toLocaleDateString("es-MX", { day: "numeric", month: "short" }));
  const ticks = x.ticks(5);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        {ticks.map((t) => (
          <g key={t.getTime()}>
            <line
              x1={MARGIN.left + x(t)}
              x2={MARGIN.left + x(t)}
              y1={MARGIN.top}
              y2={height - MARGIN.bottom}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={MARGIN.left + x(t)}
              y={height - 10}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-muted-foreground)"
            >
              {fmt(t)}
            </text>
          </g>
        ))}
        {tasks.map((task, i) => {
          const s = toDate(task.start);
          const e = toDate(task.end);
          const bx = MARGIN.left + x(s);
          const bw = Math.max(3, x(e) - x(s));
          const by = MARGIN.top + i * ROW_H + 6;
          const bh = ROW_H - 12;
          const color = task.color ?? "var(--chart-1)";
          const pct =
            task.progress === undefined
              ? null
              : Math.min(100, Math.max(0, task.progress));
          const tip =
            `${task.label}: ${fmt(s)} → ${fmt(e)}` +
            (pct === null ? "" : ` · ${formatDefault(pct)}%`);
          return (
            <g key={task.label}>
              <text
                x={MARGIN.left - 8}
                y={by + bh / 2}
                dy={4}
                textAnchor="end"
                fontSize={11}
                fill="var(--color-muted-foreground)"
              >
                <title>{task.label}</title>
                {truncateLabel(task.label, 20)}
              </text>
              <g>
                <title>{tip}</title>
                <rect
                  x={bx}
                  y={by}
                  width={bw}
                  height={bh}
                  rx={bh / 2}
                  fill="var(--muted)"
                />
                <rect
                  x={bx}
                  y={by}
                  width={Math.max(bh, (bw * (pct ?? 100)) / 100)}
                  height={bh}
                  rx={bh / 2}
                  fill={color}
                  data-chart-tip={tip}
                />
              </g>
            </g>
          );
        })}
      </svg>
      <ChartLegend
        items={[
          { label: "Programado", color: "var(--muted)" },
          { label: "Avance", color: "var(--chart-1)" },
        ]}
      />
      <p className="sr-only">{`Del ${fmt(new Date(lo))} al ${fmt(new Date(hi))}`}</p>
    </div>
  );
}
