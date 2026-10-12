/**
 * Demo Arquitectura del site (no se publica en el bundle de la lib).
 */
import { ArchitectureDiagram, ChartTooltipPortal } from "@carlos-burelo/klin";

export default function ArchitectureDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <ArchitectureDiagram
        ariaLabel="Diagrama de arquitectura de tienda en línea"
        nodes={[
          {
            id: "cliente",
            label: "Cliente",
            sub: "Navegador web",
            kind: "actor",
          },
          { id: "tienda", label: "Tienda", sub: "Next.js", kind: "service" },
          { id: "pagos", label: "Pagos", sub: "API externa", kind: "external" },
          {
            id: "cola",
            label: "Pedidos",
            sub: "Cola de trabajos",
            kind: "queue",
          },
          {
            id: "bd",
            label: "Base de datos",
            sub: "Postgres",
            kind: "database",
          },
        ]}
        edges={[
          { from: "cliente", to: "tienda", label: "HTTPS" },
          { from: "tienda", to: "pagos", label: "cobra" },
          { from: "tienda", to: "cola", label: "encola" },
          { from: "cola", to: "bd", label: "guarda" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
