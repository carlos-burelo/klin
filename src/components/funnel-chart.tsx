/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max } from "d3-array";
import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";

export type FunnelStage = {
  label: string;
  value: number;
  color?: string;
};

const W = 640;
const GAP = 6;

/**
 * Embudo SSR (conversión por etapas). Trapecios proporcionales al valor.
 */
export function FunnelChart({
  stages,
  ariaLabel,
  height = 280,
  formatValue = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  stages: FunnelStage[];
  ariaLabel: string;
  height?: number;
  formatValue?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (stages.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const top = Math.max(1, max(stages, (s) => s.value) ?? 1);
  const rowH = (height - GAP * (stages.length - 1)) / stages.length;
  const first = stages[0]?.value ?? 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      {stages.map((stage, i) => {
        const next = stages[i + 1]?.value ?? stage.value;
        const wTop = Math.max(8, (stage.value / top) * W);
        const wBottom = Math.max(8, (next / top) * W);
        const y = i * (rowH + GAP);
        const cx = W / 2;
        const color = seriesColor(i, stage.color);
        const conv =
          i === 0
            ? 100
            : Math.round(((stage.value / first) * 100 || 0) * 10) / 10;
        const tip = `${stage.label}: ${formatValue(stage.value)} (${conv}% del inicio)`;
        return (
          <g key={stage.label}>
            <title>{tip}</title>
            <polygon
              points={`${cx - wTop / 2},${y} ${cx + wTop / 2},${y} ${cx + wBottom / 2},${y + rowH} ${cx - wBottom / 2},${y + rowH}`}
              fill={color}
              data-chart-tip={tip}
            />
            <text
              x={cx}
              y={y + rowH / 2 - 2}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill="white"
            >
              {stage.label}
            </text>
            <text
              x={cx}
              y={y + rowH / 2 + 14}
              textAnchor="middle"
              fontSize={11}
              fill="white"
              opacity={0.85}
            >
              {`${formatValue(stage.value)} · ${conv}%`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
