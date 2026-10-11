/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import {
  type HierarchyRectangularNode,
  hierarchy,
  treemap,
} from "d3-hierarchy";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type TreemapNode = {
  label: string;
  value?: number;
  color?: string;
  children?: TreemapNode[];
};

const W = 640;
const H = 360;

/**
 * Mapa rectangular SSR (jerarquías por área). Hojas con etiqueta si caben.
 */
export function TreemapChart({
  data,
  ariaLabel,
  formatValue = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: TreemapNode[];
  ariaLabel: string;
  formatValue?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (data.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const root = hierarchy<{
    label: string;
    value?: number;
    color?: string;
    children?: TreemapNode[];
  }>({
    label: "root",
    children: data,
  })
    .sum((d) => d.value ?? 0)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  treemap<{
    label: string;
    value?: number;
    color?: string;
    children?: TreemapNode[];
  }>()
    .size([W, H])
    .paddingOuter(3)
    .paddingInner(3)
    .round(true)(root);

  const leaves = (
    root.leaves() as HierarchyRectangularNode<{
      label: string;
      value?: number;
      color?: string;
      children?: TreemapNode[];
    }>[]
  ).filter((l) => (l.value ?? 0) > 0);
  if (leaves.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  // Color por rama de primer nivel.
  const topLabels = data.map((d) => d.label);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      {leaves.map((leaf) => {
        const ancestors = leaf.ancestors();
        const top = ancestors[ancestors.length - 2];
        const topIndex = Math.max(0, topLabels.indexOf(top?.data.label ?? ""));
        const w = leaf.x1 - leaf.x0;
        const h = leaf.y1 - leaf.y0;
        const color = seriesColor(topIndex, top?.data.color ?? leaf.data.color);
        const value = leaf.value ?? 0;
        const chain = ancestors
          .slice(0, -1)
          .reverse()
          .map((a) => a.data.label)
          .join(" › ");
        const tip = `${chain}: ${formatValue(value)}`;
        const showLabel = w > 64 && h > 30;
        return (
          <g key={`${leaf.data.label}-${leaf.x0}-${leaf.y0}`}>
            <title>{tip}</title>
            <rect
              x={leaf.x0}
              y={leaf.y0}
              width={w}
              height={h}
              rx={4}
              fill={color}
              data-chart-tip={tip}
            />
            {showLabel ? (
              <>
                <text
                  x={leaf.x0 + 8}
                  y={leaf.y0 + 20}
                  fontSize={12}
                  fontWeight={600}
                  fill="white"
                >
                  {truncateLabel(leaf.data.label, Math.floor(w / 8))}
                </text>
                <text
                  x={leaf.x0 + 8}
                  y={leaf.y0 + 36}
                  fontSize={11}
                  fill="white"
                  opacity={0.85}
                >
                  {formatValue(value)}
                </text>
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
