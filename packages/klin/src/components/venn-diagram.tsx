/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";

import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  LINK_OPACITY,
  PERCENT_FACTOR,
  TICK_DY,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  computeVennGeometry,
  DEFAULT_VENN_SHOW_PERCENT,
} from "./venn-diagram.compute";
import type { VennDiagramProps } from "./venn-diagram.types";

export { computeVennGeometry } from "./venn-diagram.compute";
export type { VennDiagramProps, VennSet } from "./venn-diagram.types";

/**
 * Venn SSR de 2 o 3 conjuntos (geometría fija, valores por región).
 */
export function VennDiagram({
  sets,
  intersections,
  ariaLabel,
  size = 340,
  format,
  locale = DEFAULT_LOCALE,
  showPercent = DEFAULT_VENN_SHOW_PERCENT,
  universe,
  showLegend = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: VennDiagramProps) {
  if (sets.length < 2) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { r, pad, centers, regions } = computeVennGeometry(
    sets.length === 2 ? 2 : 3,
    size,
  );
  // Etiquetas de conjunto: en 2 van arriba; en 3 salen radiales para no
  // caer dentro de otro círculo.
  const centroid =
    sets.length === 2
      ? null
      : {
          x: centers.reduce((a, c) => a + c.x, 0) / centers.length,
          y: centers.reduce((a, c) => a + c.y, 0) / centers.length,
        };
  const labelPos = (i: number) => {
    const c = centers[i];
    if (!c) return { x: 0, y: 0 };
    if (!centroid) return { x: c.x, y: c.y - r - 10 };
    const dx = c.x - centroid.x;
    const dy = c.y - centroid.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    return { x: c.x + (dx / len) * (r + 18), y: c.y + (dy / len) * (r + 18) };
  };

  const inter = new Map(
    (intersections ?? []).map(
      (x) => [x.sets.join(","), toNumber(x.value)] as const,
    ),
  );
  const fmt = resolveFormatter(format, locale);
  const withPercent =
    showPercent && Number.isFinite(universe) && (universe as number) > 0;
  const fmtShare = (v: number) =>
    withPercent
      ? `${fmt(v)} (${Math.round((v / (universe as number)) * PERCENT_FACTOR)}%)`
      : fmt(v);
  const tipFor = (idx: number[]) => {
    const names = idx.map((i) => sets[i]?.label ?? "").join(" ∩ ");
    const v = inter.get(idx.join(","));
    return v === undefined ? names : `${names}: ${fmtShare(v)}`;
  };

  return (
    <div
      className={
        className
          ? `flex flex-col items-center ${className}`
          : "flex flex-col items-center"
      }
      style={style}
    >
      <svg
        viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
        width={size}
        height={size}
        className="h-auto max-w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {centers.map((c, i) => {
          const color = seriesColor(i, sets[i]?.color);
          const tip = `${sets[i]?.label}: ${fmtShare(toNumber(sets[i]?.value))}`;
          return (
            <g key={stableKey([sets[i]?.label ?? ""], i)}>
              <circle
                cx={c.x}
                cy={c.y}
                r={r}
                fill={color}
                fillOpacity={LINK_OPACITY}
                stroke={color}
                strokeWidth={2}
                data-chart-tip={tip}
              />
            </g>
          );
        })}
        {regions.map((rg, i) => {
          const tip = tipFor(rg.sets);
          return (
            <g key={stableKey([rg.sets.join(",")], i)}>
              <text
                x={rg.x}
                y={rg.y}
                textAnchor="middle"
                dy={TICK_DY}
                fontSize={12}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
                data-chart-tip={tip}
              >
                {inter.get(rg.sets.join(",")) !== undefined
                  ? fmtShare(inter.get(rg.sets.join(",")) ?? 0)
                  : ""}
              </text>
            </g>
          );
        })}
        {centers.map((c, ci) => {
          const lp = labelPos(ci);
          return (
            <text
              key={stableKey(["vlabel", c.x, c.y], ci)}
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dy={TICK_DY}
              fontSize={12}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.foreground}
            >
              {sets[ci]?.label}
            </text>
          );
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={sets.map((s, i) => ({
            label: `${s.label} · ${fmt(toNumber(s.value))}`,
            color: seriesColor(i, s.color),
          }))}
        />
      ) : null}
    </div>
  );
}
