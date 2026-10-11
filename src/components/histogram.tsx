/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { bin, extent, max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";

const W = 640;
const MARGIN = { top: 12, right: 12, bottom: 32, left: 44 };

/**
 * Histograma SSR (distribuciones). Cubetas con `d3.bin`.
 */
export function Histogram({
  values,
  ariaLabel,
  bins = 12,
  height = 240,
  formatTick = formatDefault,
  color,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  values: number[];
  ariaLabel: string;
  bins?: number;
  height?: number;
  formatTick?: (value: number) => string;
  color?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (values.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const [lo, hi] = extent(values);
  const domain: [number, number] =
    lo === undefined || hi === undefined || lo === hi
      ? [Math.min(0, lo ?? 0), Math.max(1, hi ?? 1)]
      : [lo, hi];

  const buckets = bin().domain(domain).thresholds(bins)(values);
  const top = Math.max(1, max(buckets, (b) => b.length) ?? 1);

  const x = scaleLinear().domain(domain).range([0, innerW]);
  const y = scaleLinear().domain([0, top]).nice(4).range([innerH, 0]);
  const fill = seriesColor(2, color);

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{`${ariaLabel} (${values.length} valores)`}</title>
      {y.ticks(4).map((t) => (
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
            {formatTick(t)}
          </text>
        </g>
      ))}
      {buckets.map((b) => {
        const bx = MARGIN.left + (x(b.x0 ?? 0) + 1);
        const bw = Math.max(1, x(b.x1 ?? 0) - x(b.x0 ?? 0) - 2);
        const tip = `${formatTick(b.x0 ?? 0)} – ${formatTick(b.x1 ?? 0)}: ${b.length}`;
        return (
          <g key={`${b.x0}-${b.x1}`}>
            <title>{tip}</title>
            <rect
              x={bx}
              y={MARGIN.top + y(b.length)}
              width={bw}
              height={Math.max(1, innerH - y(b.length))}
              rx={4}
              fill={fill}
              data-chart-tip={tip}
            />
          </g>
        );
      })}
      <text
        x={MARGIN.left + innerW / 2}
        y={height - 10}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-muted-foreground)"
      >
        {`${values.length} valores en ${buckets.length} intervalos`}
      </text>
    </svg>
  );
}
