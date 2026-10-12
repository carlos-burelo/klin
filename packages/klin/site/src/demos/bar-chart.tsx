/**
 * Demo Barras verticales del site (no se publica en el bundle de la lib).
 */
import { BarChart, ChartTooltipPortal } from "@carlos-burelo/klin";

export default function BarChartDemo() {
  return (
    <ChartTooltipPortal>
      <BarChart
        ariaLabel="Gráfico de barras de ventas por trimestre en línea y tienda"
        data={[
          { trimestre: "T1", linea: 420, tienda: 380 },
          { trimestre: "T2", linea: 510, tienda: 400 },
          { trimestre: "T3", linea: 480, tienda: 450 },
          { trimestre: "T4", linea: 620, tienda: 530 },
        ]}
        xKey="trimestre"
        series={[
          { key: "linea", label: "En línea" },
          { key: "tienda", label: "Tienda" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
