import { max } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type BarSeries = {
  key: string;
  label: string;
  color?: string;
};

const W = 640;
const MARGIN = { top: 12, right: 12, bottom: 32, left: 44 };

/**
 * Barras verticales SSR (una serie o agrupadas). Función pura props → SVG,
 * responsiva por `viewBox`. Ejes y grid calculados con d3-scale/d3-array.
 */
export function BarChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
  barColor,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: BarSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  /**
   * Override de color por barra (p. ej. una serie con un color por categoría).
   * Devuelve un color (token/var) o undefined para usar el de la serie.
   */
  barColor?: (
    datum: Record<string, string | number>,
    datumIndex: number,
    serie: BarSeries,
    serieIndex: number,
  ) => string | undefined;
}) {
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const top =
    max(data, (d) => Math.max(...series.map((s) => Number(d[s.key] ?? 0)))) ??
    0;

  const y = scaleLinear()
    .domain([0, Math.max(1, top)])
    .nice(4)
    .range([innerH, 0]);
  const x0 = scaleBand()
    .domain(data.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(0.22);
  const x1 = scaleBand()
    .domain(series.map((s) => s.key))
    .range([0, x0.bandwidth()])
    .padding(0.08);

  const ticks = y.ticks(4);
  const colors = series.map((s, i) => seriesColor(i, s.color));

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
        {data.map((d, di) => {
          const group = String(d[xKey] ?? "");
          return (
            <g key={group}>
              <text
                x={MARGIN.left + (x0(group) ?? 0) + x0.bandwidth() / 2}
                y={height - 10}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-muted-foreground)"
              >
                <title>{group}</title>
                {truncateLabel(group)}
              </text>
              {series.map((s, si) => {
                const value = Number(d[s.key] ?? 0);
                const bw = x1.bandwidth();
                const bx = MARGIN.left + (x0(group) ?? 0) + (x1(s.key) ?? 0);
                const by = MARGIN.top + y(value);
                const bh = Math.max(0, innerH - y(value));
                const tip = `${group} · ${s.label}: ${formatY(value)}`;
                const fill = barColor?.(d, di, s, si) ?? colors[si];
                return (
                  <g key={s.key}>
                    <title>{tip}</title>
                    <rect
                      x={bx}
                      y={value === 0 ? MARGIN.top + innerH - 2 : by}
                      width={Math.max(1, bw)}
                      height={value === 0 ? 2 : bh}
                      rx={4}
                      fill={fill}
                      data-chart-tip={tip}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <ChartLegend
        items={series.map((s, i) => ({
          label: s.label,
          color: colors[i] ?? "var(--chart-1)",
        }))}
      />
    </div>
  );
}
