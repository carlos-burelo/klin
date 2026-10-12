/**
 * Demo Gantt del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, GanttChart } from "@carlos-burelo/klin";

export default function GanttChartDemo() {
  return (
    <ChartTooltipPortal>
      <GanttChart
        ariaLabel="Gantt de lanzamiento de tienda en línea"
        formatDate={(d: Date) =>
          d.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
        }
        tasks={[
          {
            end: "2026-02-08",
            label: "Diseño",
            progress: 100,
            start: "2026-02-01",
          },
          {
            end: "2026-02-18",
            label: "Desarrollo",
            progress: 60,
            start: "2026-02-09",
          },
          {
            end: "2026-02-22",
            label: "Pruebas",
            progress: 25,
            start: "2026-02-16",
          },
          {
            end: "2026-02-28",
            label: "Lanzamiento",
            progress: 0,
            start: "2026-02-23",
          },
        ]}
      />
    </ChartTooltipPortal>
  );
}
