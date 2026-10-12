/**
 * Demo Bala del site (no se publica en el bundle de la lib).
 */
import { BulletChart, ChartTooltipPortal } from "@carlos-burelo/klin";

export default function BulletChartDemo() {
  return (
    <ChartTooltipPortal>
      <BulletChart
        ariaLabel="Gráfico de bala de avance contra meta por región"
        rows={[
          { label: "Norte", value: 82, target: 90, ranges: [50, 75, 100] },
          { label: "Centro", value: 68, target: 80, ranges: [50, 75, 100] },
          { label: "Sur", value: 91, target: 85, ranges: [50, 75, 100] },
          { label: "Occidente", value: 55, target: 70, ranges: [40, 60, 90] },
        ]}
      />
    </ChartTooltipPortal>
  );
}
