/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type VennSet = {
  label: string;
  value: number;
  color?: string;
};

/**
 * Venn SSR de 2 o 3 conjuntos (geometría fija, valores por región).
 */
export function VennDiagram({
  sets,
  intersections,
  ariaLabel,
  size = 340,
  formatValue = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  sets: [VennSet, VennSet] | [VennSet, VennSet, VennSet];
  /** Valores de intersecciones por índices (`[0,1]`, `[0,1,2]`…). */
  intersections?: { sets: number[]; value: number }[];
  ariaLabel: string;
  size?: number;
  formatValue?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (sets.length < 2) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const r = size * 0.26;
  const pad = 34;
  const cy = size / 2;
  const centers =
    sets.length === 2
      ? [
          { x: size * 0.36, y: cy },
          { x: size * 0.64, y: cy },
        ]
      : [
          { x: size * 0.5, y: size * 0.36 },
          { x: size * 0.34, y: size * 0.64 },
          { x: size * 0.66, y: size * 0.64 },
        ];
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
  // Centroides de regiones (2: izq, der, centro; 3: 3 pétalos + 3 pares + centro).
  const regions =
    sets.length === 2
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

  const inter = new Map(
    (intersections ?? []).map((x) => [x.sets.join(","), x.value]),
  );
  const tipFor = (idx: number[]) => {
    const names = idx.map((i) => sets[i]?.label ?? "").join(" ∩ ");
    const v = inter.get(idx.join(","));
    return v === undefined ? names : `${names}: ${formatValue(v)}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
        width={size}
        height={size}
        className="h-auto max-w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        {centers.map((c, i) => {
          const color = seriesColor(i, sets[i]?.color);
          const tip = `${sets[i]?.label}: ${formatValue(sets[i]?.value ?? 0)}`;
          return (
            <g key={sets[i]?.label ?? i}>
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
        {regions.map((rg) => {
          const tip = tipFor(rg.sets);
          return (
            <g key={rg.sets.join(",")}>
              <title>{tip}</title>
              <text
                x={rg.x}
                y={rg.y}
                textAnchor="middle"
                dy={4}
                fontSize={12}
                fontWeight={600}
                fill="var(--color-foreground)"
                data-chart-tip={tip}
              >
                {inter.get(rg.sets.join(",")) !== undefined
                  ? formatValue(inter.get(rg.sets.join(",")) ?? 0)
                  : ""}
              </text>
            </g>
          );
        })}
        {centers.map((c, ci) => {
          const lp = labelPos(ci);
          return (
            <text
              key={`vlabel-${c.x}-${c.y}`}
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dy={4}
              fontSize={12}
              fontWeight={600}
              fill="var(--color-foreground)"
            >
              {sets[ci]?.label}
            </text>
          );
        })}
      </svg>
      <ChartLegend
        items={sets.map((s, i) => ({
          label: `${s.label} · ${formatValue(s.value)}`,
          color: seriesColor(i, s.color),
        }))}
      />
    </div>
  );
}
