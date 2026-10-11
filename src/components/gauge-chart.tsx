import { arc } from "d3-shape";
import { formatDefault } from "../lib/palette";
import { ChartEmpty } from "./empty";

const START = -Math.PI;
const END = 0;

/**
 * Velocímetro SSR (semicírculo 0–100 con marcas y valor central).
 */
export function GaugeChart({
  value,
  ariaLabel,
  label,
  size = 220,
  thickness = 22,
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
  const datum = { innerRadius: inner, outerRadius: radius };
  const bg = arc().innerRadius(inner).outerRadius(radius)({
    ...datum,
    startAngle: START,
    endAngle: END,
  });
  const fg = arc().innerRadius(inner).outerRadius(radius)({
    ...datum,
    startAngle: START,
    endAngle: START + (clamped / 100) * Math.PI,
  });
  const fmt = formatValue ?? ((v: number) => `${formatDefault(v)}%`);
  const tip = `${label ? `${label}: ` : ""}${fmt(clamped)}`;
  const tick = (v: number) => {
    const a = START + (v / 100) * Math.PI;
    const r1 = inner - 6;
    const r2 = inner - 12;
    return {
      x1: radius + r1 * Math.cos(a),
      y1: radius + r1 * Math.sin(a),
      x2: radius + r2 * Math.cos(a),
      y2: radius + r2 * Math.sin(a),
      lx: radius + (r2 - 12) * Math.cos(a),
      ly: radius + (r2 - 12) * Math.sin(a),
    };
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${radius + 22}`}
      width={size}
      height={radius + 22}
      className="h-auto max-w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{tip}</title>
      <g transform={`translate(0,0)`}>
        <path
          d={bg ?? ""}
          fill={trackColor}
          transform={`translate(${radius},${radius})`}
        />
        {clamped > 0 ? (
          <path
            d={fg ?? ""}
            fill={color}
            transform={`translate(${radius},${radius})`}
            data-chart-tip={tip}
          />
        ) : null}
      </g>
      {[0, 25, 50, 75, 100].map((t) => {
        const p = tick(t);
        return (
          <g key={t}>
            <line
              x1={p.x1}
              y1={p.y1}
              x2={p.x2}
              y2={p.y2}
              stroke="var(--color-muted-foreground)"
              strokeWidth={1.5}
            />
            <text
              x={p.lx}
              y={p.ly}
              dy={3}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-muted-foreground)"
            >
              {t}
            </text>
          </g>
        );
      })}
      <text
        x={radius}
        y={radius - 8}
        textAnchor="middle"
        fontSize={26}
        fontWeight={600}
        fill="var(--color-foreground)"
      >
        {fmt(clamped)}
      </text>
      {label ? (
        <text
          x={radius}
          y={radius + 6}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-muted-foreground)"
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}
