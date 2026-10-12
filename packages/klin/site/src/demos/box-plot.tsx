/**
 * Demo Cajas y bigotes del site (no se publica en el bundle de la lib).
 */
import { BoxPlot, ChartTooltipPortal } from "@carlos-burelo/klin";

export default function BoxPlotDemo() {
  return (
    <ChartTooltipPortal>
      <BoxPlot
        ariaLabel="Diagrama de cajas de calificaciones por grupo"
        groups={[
          { label: "Grupo A", values: [7, 8, 8, 9, 9, 10, 6, 8] },
          { label: "Grupo B", values: [5, 6, 7, 7, 8, 8, 9, 6] },
          { label: "Grupo C", values: [8, 9, 9, 9, 10, 10, 8, 9] },
          { label: "Grupo D", values: [4, 5, 6, 6, 7, 7, 8, 5] },
        ]}
      />
    </ChartTooltipPortal>
  );
}
