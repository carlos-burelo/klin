/**
 * Demo Calor de calendario del site (no se publica en el bundle de la lib).
 */
import { CalendarHeatmap, ChartTooltipPortal } from "@carlos-burelo/klin";

export default function CalendarHeatmapDemo() {
  return (
    <ChartTooltipPortal>
      <CalendarHeatmap
        ariaLabel="Mapa de calor de pedidos diarios de marzo de 2026"
        end="2026-03-31"
        weeks={5}
        values={{
          "2026-03-02": 4,
          "2026-03-05": 9,
          "2026-03-11": 6,
          "2026-03-18": 12,
          "2026-03-24": 7,
          "2026-03-30": 10,
        }}
      />
    </ChartTooltipPortal>
  );
}
