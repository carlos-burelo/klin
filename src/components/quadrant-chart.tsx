/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { formatDefault, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type QuadrantPoint = {
  x: number;
  y: number;
  label: string;
};

const W = 560;
const H = 460;
const MARGIN = { top: 36, right: 16, bottom: 36, left: 16 };

/**
 * Cuadrantes SSR (matriz 2×2 con puntos). x/y en 0–100.
 */
export function QuadrantChart({
  points,
  ariaLabel,
  xLabel = "→ Esfuerzo",
  yLabel = "↑ Impacto",
  quads = ["Apuestas", "Ganancias rápidas", "Relleno", "Evitar"],
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  points: QuadrantPoint[];
  ariaLabel: string;
  xLabel?: string;
  yLabel?: string;
  /** [arriba-izq, arriba-der, abajo-izq, abajo-der]. */
  quads?: [string, string, string, string];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (points.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = H - MARGIN.top - MARGIN.bottom;
  const px = (v: number) =>
    MARGIN.left + (Math.min(100, Math.max(0, v)) / 100) * innerW;
  const py = (v: number) =>
    MARGIN.top + (1 - Math.min(100, Math.max(0, v)) / 100) * innerH;
  const midX = MARGIN.left + innerW / 2;
  const midY = MARGIN.top + innerH / 2;

  const quadPos = [
    { x: MARGIN.left + 10, y: MARGIN.top + 18, anchor: "start" as const },
    {
      x: MARGIN.left + innerW - 10,
      y: MARGIN.top + 18,
      anchor: "end" as const,
    },
    {
      x: MARGIN.left + 10,
      y: MARGIN.top + innerH - 10,
      anchor: "start" as const,
    },
    {
      x: MARGIN.left + innerW - 10,
      y: MARGIN.top + innerH - 10,
      anchor: "end" as const,
    },
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      <rect
        x={midX}
        y={MARGIN.top}
        width={innerW / 2}
        height={innerH / 2}
        rx={8}
        fill="var(--chart-1)"
        fillOpacity={0.12}
      />
      <rect
        x={MARGIN.left}
        y={midY}
        width={innerW / 2}
        height={innerH / 2}
        rx={8}
        fill="var(--chart-1)"
        fillOpacity={0.05}
      />
      <line
        x1={midX}
        x2={midX}
        y1={MARGIN.top}
        y2={MARGIN.top + innerH}
        stroke="var(--border)"
        strokeWidth={1.5}
      />
      <line
        x1={MARGIN.left}
        x2={MARGIN.left + innerW}
        y1={midY}
        y2={midY}
        stroke="var(--border)"
        strokeWidth={1.5}
      />
      {quads.map((q, i) => (
        <text
          key={q}
          x={quadPos[i]?.x ?? 0}
          y={quadPos[i]?.y ?? 0}
          textAnchor={quadPos[i]?.anchor ?? "start"}
          fontSize={12}
          fontWeight={600}
          fill="var(--color-muted-foreground)"
        >
          {q}
        </text>
      ))}
      {points.map((p, i) => {
        const tip = `${p.label} (${formatDefault(p.x)}, ${formatDefault(p.y)})`;
        return (
          <g key={`${p.label}-${i}`}>
            <title>{tip}</title>
            <circle
              cx={px(p.x)}
              cy={py(p.y)}
              r={9}
              fill="var(--color-primary)"
              fillOpacity={0.85}
              stroke="var(--background)"
              strokeWidth={2}
              data-chart-tip={tip}
            />
            <text
              x={px(p.x)}
              y={py(p.y) + 3.5}
              textAnchor="middle"
              fontSize={8}
              fontWeight={700}
              fill="var(--color-primary-foreground)"
            >
              {i + 1}
            </text>
            <text
              x={px(p.x)}
              y={py(p.y) - 13}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-foreground)"
            >
              {truncateLabel(p.label, 16)}
            </text>
          </g>
        );
      })}
      <text
        x={MARGIN.left + innerW / 2}
        y={H - 6}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-muted-foreground)"
      >
        {xLabel}
      </text>
      <text
        x={10}
        y={MARGIN.top + innerH / 2}
        textAnchor="middle"
        fontSize={11}
        fill="var(--color-muted-foreground)"
        transform={`rotate(-90, 10, ${MARGIN.top + innerH / 2})`}
      >
        {yLabel}
      </text>
    </svg>
  );
}
