import {
  type HierarchyRectangularNode,
  hierarchy,
  partition,
} from "d3-hierarchy";
import { arc } from "d3-shape";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type SunburstNode = {
  label: string;
  value?: number;
  color?: string;
  children?: SunburstNode[];
};

/**
 * Sunburst SSR (jerarquía en anillos con `d3.partition`).
 */
export function SunburstChart({
  data,
  ariaLabel,
  size = 300,
  formatValue = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: SunburstNode[];
  ariaLabel: string;
  size?: number;
  formatValue?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (data.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  type Datum = {
    label: string;
    value?: number;
    color?: string;
    children?: SunburstNode[];
  };
  const root = hierarchy<Datum>({ label: "root", children: data })
    .sum((d) => d.value ?? 0)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  const proot = partition<Datum>().size([2 * Math.PI, size / 2])(root);
  const rings = proot
    .descendants()
    .filter((d) => d.depth > 0 && (d.value ?? 0) > 0);
  if (rings.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const tops = data.map((d) => d.label);
  const radius = size / 2;
  const path = arc<HierarchyRectangularNode<Datum>>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1);

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
          {rings.map((d) => {
            const chain = d
              .ancestors()
              .slice(0, -1)
              .reverse()
              .map((a) => a.data.label);
            const topIndex = Math.max(0, tops.indexOf(chain[0] ?? ""));
            const color = seriesColor(topIndex, d.data.color);
            const tip = `${chain.join(" › ")}: ${formatValue(d.value ?? 0)}`;
            const midAngle = ((d.x0 ?? 0) + (d.x1 ?? 0)) / 2;
            const midR = ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2;
            const showLabel =
              (d.x1 ?? 0) - (d.x0 ?? 0) > 0.35 &&
              (d.y1 ?? 0) - (d.y0 ?? 0) > 22;
            return (
              <g key={`${chain.join("/")}-${d.depth}`}>
                <title>{tip}</title>
                <path
                  d={
                    path({
                      ...d,
                      y0: d.y0 + 8,
                    } as HierarchyRectangularNode<Datum>) ?? ""
                  }
                  fill={color}
                  fillOpacity={d.depth === 1 ? 1 : 0.75}
                  stroke="var(--background)"
                  strokeWidth={2}
                  data-chart-tip={tip}
                />
                {showLabel ? (
                  <text
                    x={midR * Math.cos(midAngle - Math.PI / 2)}
                    y={midR * Math.sin(midAngle - Math.PI / 2)}
                    dy={3.5}
                    textAnchor="middle"
                    fontSize={10}
                    fill="white"
                    transform={`rotate(${(midAngle * 180) / Math.PI - 90} ${midR * Math.cos(midAngle - Math.PI / 2)} ${midR * Math.sin(midAngle - Math.PI / 2)})`}
                  >
                    {truncateLabel(d.data.label, 12)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
      <ChartLegend
        items={data.map((d, i) => ({
          label: `${d.label} · ${formatValue(root.children?.[i]?.value ?? 0)}`,
          color: seriesColor(i, d.color),
        }))}
      />
    </div>
  );
}
