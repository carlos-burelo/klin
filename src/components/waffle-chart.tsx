import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";
import { ChartLegend } from "./legend";

export type WafflePart = {
  label: string;
  /** 0–100 (se normaliza si la suma difiere). */
  value: number;
  color?: string;
};

/**
 * Waffle SSR (100 cuadros 10×10 para porcentajes y partes).
 */
export function WaffleChart({
  parts,
  ariaLabel,
  size = 220,
  formatValue = formatDefault,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  parts: WafflePart[];
  ariaLabel: string;
  size?: number;
  formatValue?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  if (parts.length === 0 || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const gap = 3;
  const cell = (size - gap * 9) / 10;
  // Celdas por parte (redondeo con resto mayor).
  const raw = parts.map((p) => (p.value / total) * 100);
  const base = raw.map(Math.floor);
  let rest = 100 - base.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (const o of order) {
    if (rest <= 0) break;
    base[o.i] = (base[o.i] ?? 0) + 1;
    rest--;
  }

  const cells: { part: number }[] = [];
  base.forEach((n, pi) => {
    for (let k = 0; k < (n ?? 0); k++) cells.push({ part: pi });
  });
  const colors = parts.map((p, i) => seriesColor(i, p.color));

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="h-auto max-w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{`${ariaLabel}: ${parts.map((p) => `${p.label} ${formatValue((p.value / total) * 100)}%`).join(" · ")}`}</title>
        {cells.map((c, i) => {
          const col = i % 10;
          const row = 9 - Math.floor(i / 10);
          const part = parts[c.part];
          if (!part) return null;
          const tip = `${part.label}: ${formatValue((part.value / total) * 100)}%`;
          return (
            <g key={`${col}-${row}`}>
              <title>{tip}</title>
              <rect
                x={col * (cell + gap)}
                y={row * (cell + gap)}
                width={cell}
                height={cell}
                rx={4}
                fill={colors[c.part]}
                data-chart-tip={tip}
              />
            </g>
          );
        })}
      </svg>
      <ChartLegend
        items={parts.map((p, i) => ({
          label: `${p.label} · ${formatValue((p.value / total) * 100)}%`,
          color: colors[i] ?? "var(--chart-1)",
        }))}
      />
    </div>
  );
}
