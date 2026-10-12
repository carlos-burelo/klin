/**
 * Demo Flujo del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, FlowChart } from "@carlos-burelo/klin";

export default function FlowChartDemo() {
  return (
    <ChartTooltipPortal>
      <FlowChart
        ariaLabel="Flujo de atención de pedido"
        edges={[
          { from: "recibido", label: "valida", to: "revision" },
          { from: "revision", label: "sí", to: "pago" },
          { from: "revision", label: "no", to: "rechazado" },
          { from: "pago", to: "envio" },
        ]}
        nodes={[
          { id: "recibido", kind: "start", label: "Pedido recibido" },
          { id: "revision", kind: "decision", label: "¿Stock disponible?" },
          { id: "pago", label: "Confirmar pago", sub: "Pasarela" },
          { id: "envio", label: "Preparar envío" },
          { id: "rechazado", kind: "end", label: "Rechazado" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
