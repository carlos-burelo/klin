/**
 * Demo Velocímetro del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, GaugeChart } from "@carlos-burelo/klin";

export default function GaugeChartDemo() {
  return (
    <ChartTooltipPortal>
      <GaugeChart
        ariaLabel="Velocímetro de meta de satisfacción al 72 por ciento"
        label="Satisfacción"
        value={72}
      />
    </ChartTooltipPortal>
  );
}
