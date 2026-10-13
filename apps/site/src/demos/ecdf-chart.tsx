/**
 * Demo ECDF del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, ECDFChart } from "@carlos-burelo/klin";

export default function ECDFChartDemo() {
  return (
    <ChartTooltipPortal>
      <ECDFChart
        ariaLabel="Distribución acumulada de latencias p50 por centro de datos"
        groups={[
          { label: "Este", values: [18, 22, 25, 31, 35, 42, 55] },
          { label: "Oeste", values: [28, 33, 40, 48, 61, 77] },
        ]}
        showPoints
      />
    </ChartTooltipPortal>
  );
}
