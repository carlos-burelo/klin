import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type BulletRow = {
  label: string;
  /** Valor alcanzado. */
  value: number;
  /** Meta. */
  target: number;
  /** Cortes de las bandas cualitativas [bajo, medio, alto]. */
  ranges: [number, number, number];
  detail?: string;
};

const TRACK_W = 600;
const TRACK_H = 22;

/**
 * Bala SSR (valor vs. meta sobre bandas cualitativas).
 */
export function BulletChart({
  rows,
  ariaLabel,
  formatValue = formatDefault,
  color,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  rows: BulletRow[];
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
  const maxTotal = Math.max(
    1,
    ...rows.map((r) => Math.max(r.value, r.target, r.ranges[2])),
  );
  const bandFills = ["var(--muted)", "var(--muted)", "var(--muted)"];
  const bandOpacity = [0.45, 0.7, 1];

  return (
    <div role="img" aria-label={ariaLabel}>
      <title>{ariaLabel}</title>
      <div className="flex flex-col gap-3">
        {rows.map((row, ri) => {
          const [lo, mid, hi] = row.ranges;
          const tip =
            `${row.label}: ${formatValue(row.value)} (meta ${formatValue(row.target)})` +
            (row.detail ? ` · ${row.detail}` : "");
          const segs = [
            { from: 0, to: Math.max(0, lo), o: bandOpacity[0] ?? 0.45 },
            {
              from: Math.max(0, lo),
              to: Math.max(0, mid),
              o: bandOpacity[1] ?? 0.7,
            },
            {
              from: Math.max(0, mid),
              to: Math.max(0, hi),
              o: bandOpacity[2] ?? 1,
            },
          ];
          return (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span
                  className="truncate text-xs text-muted-foreground"
                  title={row.label}
                >
                  {row.label}
                </span>
                <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums">
                  {`${formatValue(row.value)} / ${formatValue(row.target)}`}
                </span>
              </div>
              <svg
                viewBox={`0 0 ${TRACK_W} ${TRACK_H}`}
                className="h-6 min-w-0 flex-1"
                aria-hidden="true"
              >
                <title>{tip}</title>
                <defs>
                  <clipPath id={`bullet-${ri}`}>
                    <rect width={TRACK_W} height={TRACK_H} rx={6} />
                  </clipPath>
                </defs>
                <g clipPath={`url(#bullet-${ri})`}>
                  {segs.map((s) => (
                    <rect
                      key={`${s.from}-${s.to}`}
                      x={(s.from / maxTotal) * TRACK_W}
                      y={0}
                      width={Math.max(
                        0,
                        ((s.to - s.from) / maxTotal) * TRACK_W,
                      )}
                      height={TRACK_H}
                      fill={bandFills[segs.indexOf(s)] ?? "var(--muted)"}
                      opacity={s.o}
                    />
                  ))}
                </g>
                <rect
                  x={0}
                  y={TRACK_H / 2 - 3.5}
                  width={Math.max(2, (row.value / maxTotal) * TRACK_W)}
                  height={7}
                  rx={3.5}
                  fill={fill}
                  stroke="var(--background)"
                  strokeWidth={1}
                  data-chart-tip={tip}
                />
                <line
                  x1={(row.target / maxTotal) * TRACK_W}
                  x2={(row.target / maxTotal) * TRACK_W}
                  y1={0}
                  y2={TRACK_H}
                  stroke="var(--color-foreground)"
                  strokeWidth={3}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
