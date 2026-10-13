/**
 * Demo Combo de barras y líneas del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, ComboChart } from "@carlos-burelo/klin";

export default function ComboChartDemo() {
  return (
    <ChartTooltipPortal>
      <ComboChart
        ariaLabel="Gráfico combinado de ventas por canal y ticket medio por trimestre"
        data={[
          { trimestre: "T1", linea: 420, tienda: 380, ticket: 45 },
          { trimestre: "T2", linea: 510, tienda: 400, ticket: 52 },
          { trimestre: "T3", linea: 480, tienda: 450, ticket: 48 },
          { trimestre: "T4", linea: 620, tienda: 530, ticket: 61 },
        ]}
        xKey="trimestre"
        bars={[
          { key: "linea", label: "En línea" },
          { key: "tienda", label: "Tienda" },
        ]}
        lines={[{ key: "ticket", label: "Ticket medio" }]}
        yAxisRight
      />
    </ChartTooltipPortal>
  );
}
