/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max, min } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { formatDefault, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type WaterfallStep = {
  label: string;
  /** Delta (positivo suma, negativo resta). */
  value: number;
};

const W = 640;
const MARGIN = { top: 28, right: 12, bottom: 32, left: 48 };

const UP = "var(--chart-1)";
const DOWN = "var(--chart-5)";
const TOTAL = "var(--color-primary)";

/**
 * Cascada SSR (acumulado por deltas + total). Subidas, bajadas y conectores.
 */
export function WaterfallChart({
  steps,
  ariaLabel,
  height = 280,
  totalLabel = "Total",
  formatY = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  steps: WaterfallStep[];
  ariaLabel: string;
  height?: number;
  totalLabel?: string;
  formatY?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (steps.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  let acc = 0;
  const floats = steps.map((s) => {
    const from = acc;
    acc += s.value;
    return { ...s, from, to: acc };
  });
  const total = acc;
  const lo = Math.min(0, min(floats, (f) => Math.min(f.from, f.to)) ?? 0);
  const hi = Math.max(0, max(floats, (f) => Math.max(f.from, f.to)) ?? 1);

  const labels = [...steps.map((s) => s.label), totalLabel];
  const y = scaleLinear().domain([lo, hi]).nice(4).range([innerH, 0]);
  const x = scaleBand().domain(labels).range([0, innerW]).padding(0.3);
  const ticks = y.ticks(4);
  const bw = x.bandwidth();

  const bar = (
    key: string,
    label: string,
    from: number,
    to: number,
    color: string,
    tip: string,
    dashed: boolean,
  ) => {
    const yTop = y(Math.max(from, to));
    const yBase = y(Math.min(from, to));
    return (
      <g key={key}>
        <title>{tip}</title>
        <rect
          x={MARGIN.left + (x(label) ?? 0)}
          y={MARGIN.top + yTop}
          width={bw}
          height={Math.max(2, yBase - yTop)}
          rx={4}
          fill={color}
          data-chart-tip={tip}
        />
        <text
          x={MARGIN.left + (x(label) ?? 0) + bw / 2}
          y={MARGIN.top + yTop - 6}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill="var(--color-foreground)"
        >
          {formatY(to)}
        </text>
        {dashed ? (
          <line
            x1={MARGIN.left + (x(label) ?? 0) + bw}
            x2={MARGIN.left + (x(labels[labels.indexOf(label) + 1] ?? "") ?? 0)}
            y1={MARGIN.top + y(to)}
            y2={MARGIN.top + y(to)}
            stroke="var(--color-muted-foreground)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ) : null}
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={MARGIN.left}
            x2={W - MARGIN.right}
            y1={MARGIN.top + y(t)}
            y2={MARGIN.top + y(t)}
            stroke="var(--border)"
            strokeWidth={1}
          />
          <text
            x={MARGIN.left - 8}
            y={MARGIN.top + y(t)}
            dy={4}
            textAnchor="end"
            fontSize={11}
            fill="var(--color-muted-foreground)"
          >
            {formatY(t)}
          </text>
        </g>
      ))}
      {floats.map((f, i) => (
        <g key={f.label}>
          {bar(
            f.label,
            f.label,
            f.from,
            f.to,
            f.value >= 0 ? UP : DOWN,
            `${f.label}: ${f.value >= 0 ? "+" : ""}${formatY(f.value)} (acumulado ${formatY(f.to)})`,
            i < floats.length,
          )}
          <text
            x={MARGIN.left + (x(f.label) ?? 0) + bw / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize={11}
            fill="var(--color-muted-foreground)"
          >
            <title>{f.label}</title>
            {truncateLabel(f.label)}
          </text>
        </g>
      ))}
      {bar(
        totalLabel,
        totalLabel,
        0,
        total,
        TOTAL,
        `${totalLabel}: ${formatY(total)}`,
        false,
      )}
      <text
        x={MARGIN.left + (x(totalLabel) ?? 0) + bw / 2}
        y={height - 10}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-muted-foreground)"
      >
        {totalLabel}
      </text>
    </svg>
  );
}
