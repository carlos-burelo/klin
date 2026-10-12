/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { topPositive } from "../lib/domain";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor } from "../lib/palette";
import { FONT_SEMIBOLD, PERCENT_FACTOR, TICK_FONT_SIZE } from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Etapa del embudo (etiqueta, valor y color opcional). */
export type FunnelStage = {
  label: string;
  value: number;
  color?: string;
};

/** Props del embudo SSR (conversión por etapas). */
export type FunnelChartProps = {
  stages: FunnelStage[];
  ariaLabel: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  /**
   * Color por etapa. Si retorna `undefined` se usa el color de serie.
   * Se respeta `stage.color` primero.
   */
  itemColor?: (stage: FunnelStage, index: number) => string | undefined;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const W = 640;
const GAP = 6;
/** Ancho mínimo visible del trapecio. */
const FUNNEL_MIN_W = 8;
/** Tipografía de la etiqueta de etapa y opacidad del valor. */
const STAGE_LABEL_FONT_SIZE = 12;
const STAGE_VALUE_OPACITY = 0.85;
/** Desplazamientos verticales de etiqueta y valor respecto al centro de fila. */
const STAGE_LABEL_DY = 2;
const STAGE_VALUE_DY = 14;

/**
 * Embudo SSR (conversión por etapas). Trapecios proporcionales al valor.
 */
export function FunnelChart({
  stages,
  ariaLabel,
  height = 280,
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
  itemColor,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: FunnelChartProps) {
  if (stages.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  // Conteos: negativos se fijan a 0.
  const counts = stages.map((s) => Math.max(0, toNumber(s.value)));
  const top = topPositive(counts);
  const rowH = (height - GAP * (stages.length - 1)) / stages.length;
  const first = counts[0] ?? 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{ariaLabel}</title>
      {stages.map((stage, i) => {
        const value = counts[i] ?? 0;
        const next = counts[i + 1] ?? value;
        const wTop = Math.max(FUNNEL_MIN_W, (value / top) * W);
        const wBottom = Math.max(FUNNEL_MIN_W, (next / top) * W);
        const y = i * (rowH + GAP);
        const cx = W / 2;
        const color = stage.color ?? itemColor?.(stage, i) ?? seriesColor(i);
        const conv =
          i === 0
            ? PERCENT_FACTOR
            : Math.round(((value / first) * PERCENT_FACTOR || 0) * 10) / 10;
        const prev = counts[i - 1] ?? 0;
        const step =
          i === 0 || prev <= 0
            ? 0
            : Math.round(((value / prev) * PERCENT_FACTOR || 0) * 10) / 10;
        const tip =
          i === 0
            ? `${stage.label}: ${format(value)} (${conv}% del inicio)`
            : `${stage.label}: ${format(value)} (${conv}% del inicio · ${step}% previo)`;
        return (
          <g key={stableKey([stage.label], i)}>
            <title>{tip}</title>
            <polygon
              points={`${cx - wTop / 2},${y} ${cx + wTop / 2},${y} ${cx + wBottom / 2},${y + rowH} ${cx - wBottom / 2},${y + rowH}`}
              fill={color}
              data-chart-tip={tip}
            />
            <text
              x={cx}
              y={y + rowH / 2 - STAGE_LABEL_DY}
              textAnchor="middle"
              fontSize={STAGE_LABEL_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill="white"
            >
              {stage.label}
            </text>
            <text
              x={cx}
              y={y + rowH / 2 + STAGE_VALUE_DY}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill="white"
              opacity={STAGE_VALUE_OPACITY}
            >
              {`${format(value)} · ${conv}%`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
