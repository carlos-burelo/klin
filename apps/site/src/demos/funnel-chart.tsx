/**
 * Demo Embudo del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, FunnelChart } from "@carlos-burelo/klin";

export default function FunnelChartDemo() {
  return (
    <ChartTooltipPortal>
      <FunnelChart
        ariaLabel="Embudo de conversión de visitas a compras"
        stages={[
          { label: "Visitas", value: 1200 },
          { label: "Registro", value: 640 },
          { label: "Carrito", value: 320 },
          { label: "Pago", value: 180 },
          { label: "Compra", value: 96 },
        ]}
      />
    </ChartTooltipPortal>
  );
}
