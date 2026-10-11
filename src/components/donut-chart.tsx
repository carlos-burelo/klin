import { sum } from "d3-array";
import { arc, pie } from "d3-shape";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type DonutDatum = {
  label: string;
  value: number;
  color?: string;
};

/**
 * Dona SSR: arcos con d3-shape, total al centro, leyenda HTML.
 */
export function DonutChart({
  data,
  ariaLabel,
  size = 220,
  thickness = 38,
  formatValue = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: DonutDatum[];
  ariaLabel: string;
  size?: number;
  thickness?: number;
  formatValue?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const total = sum(data, (d) => d.value);
  if (data.length === 0 || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const radius = size / 2;
  const arcs = pie<DonutDatum>()
    .value((d) => d.value)
    .sort(null)(data);
  const path = arc<(typeof arcs)[number]>()
    .innerRadius(radius - thickness)
    .outerRadius(radius);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="h-auto max-w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        <g transform={`translate(${radius},${radius})`}>
          {arcs.map((a, i) => {
            const datum = a.data;
            const color = seriesColor(i, datum.color);
            const tip = `${datum.label}: ${formatValue(datum.value)}`;
            return (
              <g key={datum.label}>
                <title>{tip}</title>
                <path
                  d={path(a) ?? ""}
                  fill={color}
                  stroke="var(--background)"
                  strokeWidth={2}
                  data-chart-tip={tip}
                />
              </g>
            );
          })}
        </g>
        <text
          x={radius}
          y={radius - 4}
          textAnchor="middle"
          fontSize={22}
          fontWeight={600}
          fill="var(--color-foreground)"
        >
          {formatValue(total)}
        </text>
        <text
          x={radius}
          y={radius + 14}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-muted-foreground)"
        >
          Total
        </text>
      </svg>
      <ChartLegend
        items={data.map((d, i) => ({
          label: `${d.label} · ${formatValue(d.value)}`,
          color: seriesColor(i, d.color),
        }))}
      />
    </div>
  );
}

/** Torta SSR (dona sin agujero). */
export function PieChart({
  data,
  ariaLabel,
  size = 220,
  formatValue = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: DonutDatum[];
  ariaLabel: string;
  size?: number;
  formatValue?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  return (
    <DonutChart
      data={data}
      ariaLabel={ariaLabel}
      size={size}
      thickness={size / 2}
      formatValue={formatValue}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
