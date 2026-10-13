/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import { formatDefault, seriesColor } from "../lib/palette";
import { CHART_TOKEN, PERCENT_FACTOR } from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

export type VennSet = {
  label: string;
  value: number;
  color?: string;
};

export type VennDiagramProps = {
  sets: [VennSet, VennSet] | [VennSet, VennSet, VennSet];
  /** Valores de intersecciones por índices (`[0,1]`, `[0,1,2]`…). */
  intersections?: { sets: number[]; value: number }[];
  ariaLabel: string;
  size?: number;
  format?: (value: number) => string;
  locale?: string;
  /** Añade el % del universo junto a cada valor. */
  showPercent?: boolean;
  /** Total de referencia para `showPercent` (obligatorio si se activa). */
  universe?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/** Sin % por defecto (solo valores absolutos, como hasta ahora). */
const DEFAULT_VENN_SHOW_PERCENT = false;

/**
 * Cómputo puro de la geometría fija del Venn (centros + regiones).
 */
export function computeVennGeometry(
  count: 2 | 3,
  size: number,
): {
  r: number;
  pad: number;
  cy: number;
  centers: Array<{ x: number; y: number }>;
  regions: Array<{ sets: number[]; x: number; y: number }>;
} {
  const r = size * 0.26;
  const pad = 34;
  const cy = size / 2;
  const centers =
    count === 2
      ? [
          { x: size * 0.36, y: cy },
          { x: size * 0.64, y: cy },
        ]
      : [
          { x: size * 0.5, y: size * 0.36 },
          { x: size * 0.34, y: size * 0.64 },
          { x: size * 0.66, y: size * 0.64 },
        ];
  const regions =
    count === 2
      ? [
          { sets: [0], x: size * 0.24, y: cy },
          { sets: [1], x: size * 0.76, y: cy },
          { sets: [0, 1], x: size * 0.5, y: cy },
        ]
      : [
          { sets: [0], x: size * 0.5, y: size * 0.2 },
          { sets: [1], x: size * 0.22, y: size * 0.72 },
          { sets: [2], x: size * 0.78, y: size * 0.72 },
          { sets: [0, 1], x: size * 0.4, y: size * 0.5 },
          { sets: [0, 2], x: size * 0.6, y: size * 0.5 },
          { sets: [1, 2], x: size * 0.5, y: size * 0.72 },
          { sets: [0, 1, 2], x: size * 0.5, y: size * 0.57 },
        ];
  return { r, pad, cy, centers, regions };
}

/**
 * Venn SSR de 2 o 3 conjuntos (geometría fija, valores por región).
 */
export function VennDiagram({
  sets,
  intersections,
  ariaLabel,
  size = 340,
  format,
  locale = "es-MX",
  showPercent = DEFAULT_VENN_SHOW_PERCENT,
  universe,
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
  const fmt = format ?? ((v: number) => formatDefault(v, locale));
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
        <title>{ariaLabel}</title>
        {centers.map((c, i) => {
          const color = seriesColor(i, sets[i]?.color);
          const tip = `${sets[i]?.label}: ${fmtShare(toNumber(sets[i]?.value))}`;
          return (
            <g key={stableKey([sets[i]?.label ?? ""], i)}>
              <title>{tip}</title>
              <circle
                cx={c.x}
                cy={c.y}
                r={r}
                fill={color}
                fillOpacity={0.35}
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
              <title>{tip}</title>
              <text
                x={rg.x}
                y={rg.y}
                textAnchor="middle"
                dy={4}
                fontSize={12}
                fontWeight={600}
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
              dy={4}
              fontSize={12}
              fontWeight={600}
              fill={CHART_TOKEN.foreground}
            >
              {sets[ci]?.label}
            </text>
          );
        })}
      </svg>
      <ChartLegend
        items={sets.map((s, i) => ({
          label: `${s.label} · ${fmt(toNumber(s.value))}`,
          color: seriesColor(i, s.color),
        }))}
      />
    </div>
  );
}
