/**
 * Demo Entidad-relación del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, ErDiagram } from "@carlos-burelo/klin";

export default function ErDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <ErDiagram
        ariaLabel="Diagrama entidad-relación de tienda"
        entities={[
          {
            id: "cliente",
            name: "Cliente",
            attributes: [
              { key: "PK", name: "id" },
              { name: "nombre" },
              { name: "correo" },
            ],
          },
          {
            id: "pedido",
            name: "Pedido",
            attributes: [
              { key: "PK", name: "id" },
              { key: "FK", name: "cliente_id" },
              { name: "fecha" },
            ],
          },
          {
            id: "producto",
            name: "Producto",
            attributes: [
              { key: "PK", name: "id" },
              { name: "nombre" },
              { name: "precio" },
            ],
          },
        ]}
        relations={[
          { from: "cliente", label: "1:N", to: "pedido" },
          { from: "pedido", label: "N:M", to: "producto" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
