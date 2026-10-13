/**
 * Demo Horizonte de series del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, HorizonChart } from "@carlos-burelo/klin";

export default function HorizonChartDemo() {
  return (
    <ChartTooltipPortal>
      <HorizonChart
        ariaLabel="Horizonte de consumo eléctrico semanal por sede en megavatios"
        labels={["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"]}
        series={[
          { label: "Norte", values: [12, 18, 9, 24, 30, 22, 16, 28] },
          { label: "Sur", values: [8, -14, 20, -6, 26, 12, -10, 18] },
        ]}
      />
    </ChartTooltipPortal>
  );
}
