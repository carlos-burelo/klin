/**
 * Demo Cohorte de retención del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, CohortChart } from "@carlos-burelo/klin";

export default function CohortChartDemo() {
  return (
    <ChartTooltipPortal>
      <CohortChart
        ariaLabel="Retención mensual por cohorte de registro de enero a abril"
        cohorts={[
          { label: "Ene", values: [1200, 840, 600, 480] },
          { label: "Feb", values: [950, 640, 430] },
          { label: "Mar", values: [1100, 770] },
          { label: "Abr", values: [800] },
        ]}
        periodLabels={["Mes 0", "Mes 1", "Mes 2", "Mes 3"]}
      />
    </ChartTooltipPortal>
  );
}
