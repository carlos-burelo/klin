/**
 * Demo Calor de calendario del site (no se publica en el bundle de la lib).
 */
import { CalendarHeatmap, ChartTooltipPortal } from "@carlos-burelo/klin";

export default function CalendarHeatmapDemo() {
  return (
    <ChartTooltipPortal>
      <CalendarHeatmap
        ariaLabel="Mapa de calor de pedidos diarios, últimas 12 semanas"
        end="2026-03-31"
        weeks={12}
        values={{
          "2026-01-06": 3,
          "2026-01-09": 7,
          "2026-01-15": 5,
          "2026-01-22": 11,
          "2026-01-29": 4,
          "2026-02-04": 8,
          "2026-02-11": 6,
          "2026-02-18": 12,
          "2026-02-25": 7,
          "2026-03-04": 9,
          "2026-03-11": 6,
          "2026-03-18": 12,
          "2026-03-24": 7,
          "2026-03-30": 10,
        }}
      />
    </ChartTooltipPortal>
  );
}
