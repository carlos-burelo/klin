import { ChartTooltipPortal, SequenceDiagram } from "@carlos-burelo/klin";

/** Compra en línea: cliente, tienda, pagos y almacén. */
export default function SequenceDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <SequenceDiagram
        ariaLabel="Secuencia de compra en línea entre cliente, tienda, pagos y almacén"
        participants={["Cliente", "Tienda", "Pagos", "Almacén"]}
        messages={[
          {
            from: "Cliente",
            to: "Tienda",
            label: "Agrega productos al carrito",
          },
          { from: "Cliente", to: "Tienda", label: "Confirma el pedido" },
          { from: "Tienda", to: "Pagos", label: "Cobra la tarjeta" },
          {
            from: "Pagos",
            to: "Tienda",
            label: "Confirma el pago",
            kind: "return",
          },
          { from: "Tienda", to: "Almacén", label: "Solicita el envío" },
          { from: "Almacén", to: "Cliente", label: "Entrega el paquete" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
