/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type StackSegment = {
  key: string;
  label: string;
  color?: string;
};

export type StackRow = {
  label: string;
  detail?: string;
  values: Record<string, number>;
};

const TRACK_W = 600;
const TRACK_H = 24;

/**
 * Barras horizontales apiladas SSR (progreso y comparativas).
 * Render HTML+SVG: etiqueta truncada + pista flexible + % tabular.
 * Puntas redondeadas vía clip (funciona con N segmentos).
 */
export function StackedBar({
  rows,
  segments,
  ariaLabel,
  formatValue = formatDefault,
  percentOf,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  rows: StackRow[];
  segments: StackSegment[];
  ariaLabel: string;
  formatValue?: (value: number) => string;
  /** Clave del segmento para el % (por defecto, el primero). */
  percentOf?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (rows.length === 0 || segments.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const mainKey = percentOf ?? segments[0]?.key ?? "";
  const colors = segments.map((s, i) => seriesColor(i, s.color));
  const maxTotal = Math.max(
    1,
    ...rows.map((r) =>
      segments.reduce((acc, s) => acc + (r.values[s.key] ?? 0), 0),
    ),
  );

  return (
    <div role="img" aria-label={ariaLabel}>
      <title>{ariaLabel}</title>
      <div className="flex flex-col gap-2.5">
        {rows.map((row, ri) => {
          const total = segments.reduce(
            (acc, s) => acc + (row.values[s.key] ?? 0),
            0,
          );
          const main = row.values[mainKey] ?? 0;
          const percent = total === 0 ? 0 : Math.round((main / total) * 100);
          let offset = 0;
          const clipId = `st-${ri}-${total}`;
          return (
            <div key={row.label} className="flex items-center gap-2">
              <span
                className="w-36 shrink-0 truncate text-xs text-muted-foreground"
                title={row.detail ? `${row.label} · ${row.detail}` : row.label}
              >
                {row.label}
              </span>
              <svg
                viewBox={`0 0 ${TRACK_W} ${TRACK_H}`}
                className="h-6 min-w-0 flex-1"
                aria-hidden="true"
              >
                <defs>
                  <clipPath id={clipId}>
                    <rect width={TRACK_W} height={TRACK_H} rx={12} />
                  </clipPath>
                </defs>
                <rect
                  width={TRACK_W}
                  height={TRACK_H}
                  rx={12}
                  fill="var(--muted)"
                />
                <g clipPath={`url(#${clipId})`}>
                  {segments.map((seg, si) => {
                    const value = row.values[seg.key] ?? 0;
                    const w = (value / maxTotal) * TRACK_W;
                    const x = offset;
                    offset += w;
                    if (w <= 0) return null;
                    const tip =
                      `${row.label} · ${seg.label}: ${formatValue(value)}` +
                      (row.detail ? ` (${row.detail})` : "");
                    return (
                      <g key={seg.key}>
                        <title>{tip}</title>
                        <rect
                          x={x}
                          y={0}
                          width={w}
                          height={TRACK_H}
                          fill={colors[si]}
                          data-chart-tip={tip}
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>
              <span className="w-10 shrink-0 text-right font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
      <ChartLegend
        items={segments.map((s, i) => ({
          label: s.label,
          color: colors[i] ?? "var(--chart-1)",
        }))}
      />
    </div>
  );
}
