import { max } from "d3-array";
import { scaleLinear, scalePoint } from "d3-scale";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

const W = 640;
const MARGIN = { top: 12, right: 12, bottom: 32, left: 44 };

/**
 * Paleta SSR (puntos sobre palos): una serie con valores rotulados.
 */
export function LollipopChart({
  data,
  xKey,
  yKey,
  ariaLabel,
  height = 260,
  formatY = formatDefault,
  color,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  ariaLabel: string;
  height?: number;
  formatY?: (value: number) => string;
  color?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (data.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const top = Math.max(1, max(data, (d) => Number(d[yKey] ?? 0)) ?? 1);

  const y = scaleLinear().domain([0, top]).nice(4).range([innerH, 0]);
  const x = scalePoint()
    .domain(data.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(0.5);
  const ticks = y.ticks(4);
  const fill = seriesColor(0, color);

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
      {data.map((d) => {
        const group = String(d[xKey] ?? "");
        const value = Number(d[yKey] ?? 0);
        const cx = MARGIN.left + (x(group) ?? 0);
        const tip = `${group}: ${formatY(value)}`;
        return (
          <g key={group}>
            <title>{tip}</title>
            <line
              x1={cx}
              x2={cx}
              y1={MARGIN.top + innerH}
              y2={MARGIN.top + y(value)}
              stroke={fill}
              strokeWidth={2}
              strokeOpacity={0.5}
            />
            <circle
              cx={cx}
              cy={MARGIN.top + y(value)}
              r={5}
              fill={fill}
              stroke="var(--background)"
              strokeWidth={2}
              data-chart-tip={tip}
            />
            <text
              x={cx}
              y={MARGIN.top + y(value) - 10}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill="var(--color-foreground)"
            >
              {formatY(value)}
            </text>
            <text
              x={cx}
              y={height - 10}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-muted-foreground)"
            >
              <title>{group}</title>
              {truncateLabel(group)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
