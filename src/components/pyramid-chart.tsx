import { max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

const W = 640;
const MARGIN = { top: 8, right: 16, bottom: 34, left: 84 };
const LABEL_BAND = 96;

/**
 * Pirámide poblacional SSR (dos series espejadas): etiquetas a la izquierda,
 * barras al centro y escala abajo, como la clásica de población.
 */
export function PyramidChart({
  groups,
  left,
  right,
  ariaLabel,
  formatX = formatDefault,
  labels = "left",
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  groups: string[];
  left: { label: string; values: number[]; color?: string };
  right: { label: string; values: number[]; color?: string };
  ariaLabel: string;
  formatX?: (value: number) => string;
  /** Etiquetas de grupo a la izquierda (clásica) o en la banda central. */
  labels?: "left" | "center";
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (groups.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const rowH = 34;
  const height = Math.max(
    140,
    MARGIN.top + MARGIN.bottom + groups.length * rowH,
  );
  const band = labels === "center" ? LABEL_BAND : 0;
  const plotW = W - MARGIN.left - MARGIN.right - band;
  const halfW = plotW / 2;
  const top = Math.max(
    1,
    max([...left.values, ...right.values], (v) => v) ?? 1,
  );

  const scale = scaleLinear().domain([0, top]).nice(4).range([0, halfW]);
  const ticks = scale.ticks(4).filter((t) => t > 0);
  const leftColor = seriesColor(0, left.color);
  const rightColor = seriesColor(1, right.color);
  const midX = MARGIN.left + halfW + band;
  const leftEdge = midX - band / 2;
  const rightEdge = midX + band / 2;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        <line
          x1={midX}
          x2={midX}
          y1={MARGIN.top}
          y2={height - MARGIN.bottom}
          stroke="var(--border)"
          strokeWidth={1}
        />
        {groups.map((group, i) => {
          const lv = left.values[i] ?? 0;
          const rv = right.values[i] ?? 0;
          const by = MARGIN.top + i * rowH + 5;
          const bh = rowH - 10;
          const lw = Math.max(lv === 0 ? 0 : 2, scale(lv));
          const rw = Math.max(rv === 0 ? 0 : 2, scale(rv));
          const tipL = `${group} · ${left.label}: ${formatX(lv)}`;
          const tipR = `${group} · ${right.label}: ${formatX(rv)}`;
          return (
            <g key={group}>
              <text
                x={labels === "center" ? midX : MARGIN.left}
                y={by + bh / 2}
                dy={4}
                textAnchor={labels === "center" ? "middle" : "start"}
                fontSize={11}
                fill="var(--color-muted-foreground)"
              >
                <title>{group}</title>
                {truncateLabel(group, labels === "center" ? 14 : 12)}
              </text>
              <g>
                <title>{tipL}</title>
                <rect
                  x={leftEdge - lw}
                  y={by}
                  width={lw}
                  height={bh}
                  rx={4}
                  fill={leftColor}
                  stroke="var(--color-foreground)"
                  strokeOpacity={0.25}
                  strokeWidth={1}
                  data-chart-tip={tipL}
                />
              </g>
              <g>
                <title>{tipR}</title>
                <rect
                  x={rightEdge}
                  y={by}
                  width={rw}
                  height={bh}
                  rx={4}
                  fill={rightColor}
                  stroke="var(--color-foreground)"
                  strokeOpacity={0.25}
                  strokeWidth={1}
                  data-chart-tip={tipR}
                />
              </g>
            </g>
          );
        })}
        {ticks.map((t) => (
          <g key={t}>
            <text
              x={leftEdge - scale(t)}
              y={height - 12}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-muted-foreground)"
            >
              {formatX(t)}
            </text>
            <text
              x={rightEdge + scale(t)}
              y={height - 12}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-muted-foreground)"
            >
              {formatX(t)}
            </text>
          </g>
        ))}
      </svg>
      <ChartLegend
        items={[
          { label: left.label, color: leftColor },
          { label: right.label, color: rightColor },
        ]}
      />
    </div>
  );
}
