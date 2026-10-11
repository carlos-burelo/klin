/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type SequenceMessage = {
  from: string;
  to: string;
  label: string;
  /** `call` (sólida) o `return` (punteada). */
  kind?: "call" | "return";
};

const W = 680;
const TOP = 44;
const STEP = 40;
const HEAD_W = 120;
const PAD_X = 72;

/**
 * Secuencia SSR (participantes, líneas de vida y mensajes ordenados).
 */
export function SequenceDiagram({
  participants,
  messages,
  ariaLabel,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  participants: string[];
  messages: SequenceMessage[];
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (participants.length === 0 || messages.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const known = new Set(participants);
  const clean = messages.filter((m) => known.has(m.from) && known.has(m.to));
  const height = TOP + clean.length * STEP + 24;
  const innerW = W - PAD_X * 2;
  const colX = (i: number) =>
    PAD_X +
    (participants.length === 1
      ? innerW / 2
      : (i * innerW) / (participants.length - 1));

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        style={{ minWidth: W }}
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        <defs>
          <marker
            id="charts-seq-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 1 L 9 5 L 0 9 z"
              fill="var(--color-muted-foreground)"
            />
          </marker>
        </defs>
        {participants.map((p, i) => (
          <g key={p}>
            <rect
              x={colX(i) - HEAD_W / 2}
              y={8}
              width={HEAD_W}
              height={28}
              rx={8}
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth={1.5}
            />
            <text
              x={colX(i)}
              y={26}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill="var(--color-foreground)"
            >
              {truncateLabel(p, 16)}
            </text>
            <line
              x1={colX(i)}
              x2={colX(i)}
              y1={TOP - 4}
              y2={height - 8}
              stroke="var(--border)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          </g>
        ))}
        {clean.map((m) => {
          const order = clean.indexOf(m);
          const y = TOP + order * STEP + 16;
          const x1 = colX(participants.indexOf(m.from));
          const x2 = colX(participants.indexOf(m.to));
          const dashed = m.kind === "return";
          const tip = `${order + 1}. ${m.from} → ${m.to}: ${m.label}`;
          if (m.from === m.to) {
            return (
              <g key={`${m.from}-${m.label}-${y}`}>
                <title>{tip}</title>
                <path
                  d={`M ${x1} ${y - 8} h 34 v 14 h -34`}
                  fill="none"
                  stroke="var(--color-chart-2)"
                  strokeWidth={1.5}
                  strokeDasharray={dashed ? "4 3" : undefined}
                  markerEnd="url(#charts-seq-arrow)"
                  data-chart-tip={tip}
                />
                <text
                  x={x1 + 40}
                  y={y - 2}
                  fontSize={11}
                  fill="var(--color-muted-foreground)"
                >
                  {truncateLabel(`${order + 1}. ${m.label}`, 30)}
                </text>
              </g>
            );
          }
          const leftToRight = x2 > x1;
          return (
            <g key={`${m.from}-${m.to}-${m.label}-${y}`}>
              <title>{tip}</title>
              <line
                x1={x1}
                x2={x2 + (leftToRight ? -2 : 2)}
                y1={y}
                y2={y}
                stroke={
                  dashed
                    ? "var(--color-muted-foreground)"
                    : "var(--color-chart-2)"
                }
                strokeWidth={1.5}
                strokeDasharray={dashed ? "4 3" : undefined}
                markerEnd="url(#charts-seq-arrow)"
                data-chart-tip={tip}
              />
              <text
                x={(x1 + x2) / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-muted-foreground)"
              >
                {truncateLabel(`${order + 1}. ${m.label}`, 34)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
