/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type TimelineEvent = {
  date: string;
  label: string;
  detail?: string;
  done?: boolean;
};

const W = 680;
const MARGIN = 24;
const LANE = 76;

/**
 * Línea de tiempo SSR (hitos alternados sobre un eje).
 */
export function TimelineChart({
  events,
  ariaLabel,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  events: TimelineEvent[];
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (events.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const height = LANE * 2 + 56;
  const midY = LANE + 28;
  const stepX =
    events.length === 1 ? 0 : (W - MARGIN * 2) / (events.length - 1);
  const px = (i: number) => MARGIN + i * stepX;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto"
        style={{ minWidth: Math.min(W, 560) }}
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        <line
          x1={MARGIN}
          x2={W - MARGIN}
          y1={midY}
          y2={midY}
          stroke="var(--border)"
          strokeWidth={2}
        />
        {events.map((e, i) => {
          const up = i % 2 === 0;
          const x = px(i);
          const tip = e.detail
            ? `${e.date} · ${e.label}: ${e.detail}`
            : `${e.date} · ${e.label}`;
          const color = e.done
            ? "var(--color-primary)"
            : "var(--color-muted-foreground)";
          return (
            <g key={`${e.date}-${e.label}`}>
              <title>{tip}</title>
              <line
                x1={x}
                x2={x}
                y1={midY}
                y2={up ? midY - LANE + 18 : midY + LANE - 18}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <circle
                cx={x}
                cy={midY}
                r={7}
                fill={e.done ? "var(--color-primary)" : "var(--background)"}
                stroke={color}
                strokeWidth={2}
                data-chart-tip={tip}
              />
              {e.done ? (
                <circle
                  cx={x}
                  cy={midY}
                  r={2.5}
                  fill="var(--color-primary-foreground)"
                />
              ) : null}
              <text
                x={x}
                y={up ? midY - LANE + 8 : midY + LANE - 24}
                textAnchor="middle"
                fontSize={10}
                fontFamily="var(--font-mono, monospace)"
                fill="var(--color-muted-foreground)"
              >
                {e.date}
              </text>
              <text
                x={x}
                y={up ? midY - LANE + 24 : midY + LANE - 10}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="var(--color-foreground)"
              >
                {truncateLabel(e.label, 18)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
