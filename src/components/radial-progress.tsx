/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { arc } from "d3-shape";
import { formatDefault, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

const START = -Math.PI / 2;
const TAU = Math.PI * 2;

/**
 * Progreso radial SSR (anillo 0–100 %). Ideal para avances e indicadores.
 */
export function RadialProgress({
  value,
  ariaLabel,
  label,
  size = 160,
  thickness = 16,
  color = "var(--chart-1)",
  trackColor = "var(--muted)",
  formatValue,
  emptyTitle = "Sin datos todavía",
}: {
  /** 0–100. */
  value: number;
  ariaLabel: string;
  label?: string;
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  formatValue?: (value: number) => string;
  emptyTitle?: string;
}) {
  if (!Number.isFinite(value)) {
    return <ChartEmpty title={emptyTitle} />;
  }
  const clamped = Math.min(100, Math.max(0, value));
  const radius = size / 2;
  const inner = radius - thickness;
  const bg = arc().innerRadius(inner).outerRadius(radius)({
    innerRadius: inner,
    outerRadius: radius,
    startAngle: START,
    endAngle: START + TAU,
  });
  const fg = arc()
    .innerRadius(inner)
    .outerRadius(radius)
    .cornerRadius(thickness / 2)({
    innerRadius: inner,
    outerRadius: radius,
    startAngle: START,
    endAngle: START + (clamped / 100) * TAU,
  });
  const fmt = formatValue ?? ((v: number) => `${formatDefault(v)}%`);
  const tip = `${label ? `${label}: ` : ""}${fmt(clamped)}`;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="h-auto max-w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{tip}</title>
      <g transform={`translate(${radius},${radius})`}>
        <path d={bg ?? ""} fill={trackColor} />
        {clamped > 0 ? (
          <path d={fg ?? ""} fill={color} data-chart-tip={tip} />
        ) : null}
      </g>
      <text
        x={radius}
        y={radius + (label ? -2 : 6)}
        textAnchor="middle"
        fontSize={24}
        fontWeight={600}
        fill="var(--color-foreground)"
      >
        {fmt(clamped)}
      </text>
      {label ? (
        <text
          x={radius}
          y={radius + 16}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-muted-foreground)"
        >
          {truncateLabel(label, 18)}
          <title>{label}</title>
        </text>
      ) : null}
    </svg>
  );
}
