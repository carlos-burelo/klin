/**
 * Demo Torta del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, PieChart } from "@carlos-burelo/klin";

export default function PieChartDemo() {
  return (
    <ChartTooltipPortal>
      <PieChart
        ariaLabel="Torta de ventas por canal"
        data={[
          { label: "Tienda física", value: 420 },
          { label: "En línea", value: 310 },
          { label: "Mayoreo", value: 180 },
          { label: "Marketplace", value: 120 },
          { label: "Teléfono", value: 60 },
        ]}
        size={220}
      />
    </ChartTooltipPortal>
  );
}
