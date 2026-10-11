import { formatDefault, seriesColor } from "../lib/palette";
import { ChartEmpty } from "./empty";

const CELL = 13;
const GAPC = 3;
const TOP_H = 22;
const LEFT_W = 20;

/**
 * Calor de calendario SSR estilo contribuciones (7 filas Lun–Dom × semanas).
 * `values` mapea `YYYY-MM-DD` → intensidad.
 */
export function CalendarHeatmap({
  values,
  ariaLabel,
  end,
  weeks = 26,
  formatValue = formatDefault,
  color,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  values: Record<string, number>;
  ariaLabel: string;
  /** Fecha de fin `YYYY-MM-DD` (por defecto hoy; pasar fija para determinismo). */
  end?: string;
  weeks?: number;
  formatValue?: (value: number) => string;
  color?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const entries = Object.entries(values);
  if (entries.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const endDate = end ? new Date(`${end}T12:00:00`) : new Date();
  // Domingo que cierra la última semana (getDay: 0 = domingo).
  const lastSunday = new Date(endDate);
  lastSunday.setDate(lastSunday.getDate() + ((7 - lastSunday.getDay()) % 7));
  // Lunes que abre la primera semana (las filas son Lun..Dom).
  const start = new Date(lastSunday);
  start.setDate(start.getDate() - (weeks - 1) * 7 - 6);

  const top = Math.max(1, ...entries.map(([, v]) => v));
  const fill = seriesColor(0, color);
  const W = LEFT_W + weeks * (CELL + GAPC);
  const H = TOP_H + 7 * (CELL + GAPC);
  // Lun..Dom en orden de fila (getDay 1..6,0).
  const DOW = ["L", "M", "X", "J", "V", "S", "D"];

  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const monthMarks: { x: number; label: string }[] = [];
  let prevMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const d = new Date(start);
    d.setDate(d.getDate() + w * 7);
    if (d.getMonth() !== prevMonth) {
      prevMonth = d.getMonth();
      monthMarks.push({
        x: LEFT_W + w * (CELL + GAPC),
        label: d.toLocaleString("es-MX", { month: "short" }),
      });
    }
  }

  return (
    <div className="overflow-x-auto" role="img" aria-label={ariaLabel}>
      <title>{ariaLabel}</title>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto"
        style={{ minWidth: Math.min(W, 560) }}
        aria-hidden="true"
      >
        {monthMarks.map((m) => (
          <text
            key={`${m.x}-${m.label}`}
            x={m.x}
            y={12}
            fontSize={10}
            fill="var(--color-muted-foreground)"
          >
            {m.label}
          </text>
        ))}
        {DOW.map((d, i) =>
          i % 2 === 1 ? (
            <text
              key={d}
              x={0}
              y={TOP_H + i * (CELL + GAPC) + CELL - 3}
              fontSize={9}
              fill="var(--color-muted-foreground)"
            >
              {d}
            </text>
          ) : null,
        )}
        {Array.from({ length: weeks }, (_, w) =>
          Array.from({ length: 7 }, (_, dow) => {
            // dow 0 = lunes … 6 = domingo.
            const d = new Date(start);
            d.setDate(d.getDate() + w * 7 + dow);
            if (d > lastSunday) return null;
            const key = iso(d);
            const v = values[key] ?? 0;
            const tip = `${key}: ${formatValue(v)}`;
            return (
              <g key={key}>
                <title>{tip}</title>
                <rect
                  x={LEFT_W + w * (CELL + GAPC)}
                  y={TOP_H + dow * (CELL + GAPC)}
                  width={CELL}
                  height={CELL}
                  rx={3}
                  fill={fill}
                  fillOpacity={v <= 0 ? 0.08 : 0.2 + 0.8 * (v / top)}
                  data-chart-tip={tip}
                />
              </g>
            );
          }),
        )}
      </svg>
      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span>Menos</span>
        {[0.08, 0.35, 0.6, 0.85, 1].map((o) => (
          <span
            key={o}
            className="inline-block size-[10px] rounded-[3px]"
            style={{ backgroundColor: fill, opacity: o }}
          />
        ))}
        <span>Más</span>
      </p>
    </div>
  );
}
