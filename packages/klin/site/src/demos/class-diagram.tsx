/**
 * Demo Clases UML del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, ClassDiagram } from "@carlos-burelo/klin";

export default function ClassDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <ClassDiagram
        ariaLabel="Diagrama de clases del módulo de pedidos"
        nodes={[
          {
            id: "pedido",
            name: "Pedido",
            attributes: ["id: string", "total: number"],
            methods: ["confirmar()", "cancelar()"],
          },
          {
            id: "linea",
            name: "Línea",
            attributes: ["cantidad: number", "precio: number"],
            methods: ["subtotal()"],
          },
          {
            id: "cliente",
            name: "Cliente",
            attributes: ["nombre: string"],
            methods: ["comprar()"],
          },
        ]}
        edges={[
          {
            from: "linea",
            to: "pedido",
            kind: "composition",
            label: "contiene",
          },
          { from: "cliente", to: "pedido", kind: "association", label: "crea" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
