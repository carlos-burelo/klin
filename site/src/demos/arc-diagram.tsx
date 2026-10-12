/**
 * Demo Arcos del site (no se publica en el bundle de la lib).
 */
import { ArcDiagram, ChartTooltipPortal } from "@carlos-burelo/klin";

export default function ArcDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <ArcDiagram
        ariaLabel="Diagrama de arcos de colaboraciones entre áreas"
        nodes={[
          { id: "ventas", label: "Ventas" },
          { id: "soporte", label: "Soporte" },
          { id: "producto", label: "Producto" },
          { id: "logistica", label: "Logística" },
          { id: "finanzas", label: "Finanzas" },
        ]}
        edges={[
          { from: "ventas", to: "soporte", label: "12 casos" },
          { from: "ventas", to: "logistica", label: "8 pedidos" },
          { from: "soporte", to: "producto", label: "5 mejoras" },
          { from: "logistica", to: "finanzas", label: "6 facturas" },
          { from: "producto", to: "finanzas", label: "3 presupuestos" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
