/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

const W = 640;
const MARGIN = { top: 8, right: 48, bottom: 28, left: 132 };

/**
 * Barras divergentes SSR (encuestas: en contra ← centro → a favor).
 */
export function DivergingBar({
  data,
  yKey,
  left,
  right,
  ariaLabel,
  formatX = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  data: Array<Record<string, string | number>>;
  yKey: string;
  left: { key: string; label: string; color?: string };
  right: { key: string; label: string; color?: string };
  ariaLabel: string;
  formatX?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (data.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const rowH = 34;
  const height = Math.max(140, MARGIN.top + MARGIN.bottom + data.length * rowH);
  const halfW = (W - MARGIN.left - MARGIN.right) / 2;
  const top = Math.max(
    1,
    max(data, (d) =>
      Math.max(Number(d[left.key] ?? 0), Number(d[right.key] ?? 0)),
    ) ?? 1,
  );

  const scale = scaleLinear().domain([0, top]).range([0, halfW]);
  const midX = MARGIN.left + halfW;
  const leftColor = seriesColor(4, left.color);
  const rightColor = seriesColor(0, right.color);

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
          strokeWidth={1.5}
        />
        {data.map((d) => {
          const group = String(d[yKey] ?? "");
          const lv = Number(d[left.key] ?? 0);
          const rv = Number(d[right.key] ?? 0);
          const i = data.indexOf(d);
          const by = MARGIN.top + i * rowH + 6;
          const bh = rowH - 12;
          const lw = Math.max(lv === 0 ? 0 : 2, scale(lv));
          const rw = Math.max(rv === 0 ? 0 : 2, scale(rv));
          const tipL = `${group} · ${left.label}: ${formatX(lv)}`;
          const tipR = `${group} · ${right.label}: ${formatX(rv)}`;
          return (
            <g key={group}>
              <text
                x={midX}
                y={by - 4}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-muted-foreground)"
              >
                <title>{group}</title>
                {truncateLabel(group, 24)}
              </text>
              <g>
                <title>{tipL}</title>
                <rect
                  x={midX - lw}
                  y={by}
                  width={lw}
                  height={bh}
                  rx={4}
                  fill={leftColor}
                  data-chart-tip={tipL}
                />
              </g>
              <g>
                <title>{tipR}</title>
                <rect
                  x={midX}
                  y={by}
                  width={rw}
                  height={bh}
                  rx={4}
                  fill={rightColor}
                  data-chart-tip={tipR}
                />
              </g>
            </g>
          );
        })}
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
