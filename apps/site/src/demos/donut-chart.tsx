/**
 * Demo Dona del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, DonutChart } from "@carlos-burelo/klin";

export default function DonutChartDemo() {
  return (
    <ChartTooltipPortal>
      <DonutChart
        ariaLabel="Gráfico de dona de matrícula por estado"
        totalLabel="Alumnos"
        data={[
          { label: "Jalisco", value: 320 },
          { label: "Nuevo León", value: 280 },
          { label: "Puebla", value: 190 },
          { label: "Oaxaca", value: 140 },
          { label: "Yucatán", value: 110 },
        ]}
      />
    </ChartTooltipPortal>
  );
}
