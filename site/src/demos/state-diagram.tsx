import { ChartTooltipPortal, StateDiagram } from "@carlos-burelo/klin";

/** Ciclo de vida de un pedido en una tienda en línea. */
export default function StateDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <StateDiagram
        ariaLabel="Diagrama de estados del ciclo de vida de un pedido"
        direction="LR"
        nodes={[
          { id: "inicio", label: "Inicio", kind: "initial" },
          { id: "creado", label: "Creado" },
          { id: "pagado", label: "Pagado" },
          { id: "enviado", label: "Enviado" },
          { id: "entregado", label: "Entregado" },
          { id: "fin", label: "Fin", kind: "final" },
        ]}
        edges={[
          { from: "inicio", to: "creado", label: "crear" },
          { from: "creado", to: "pagado", label: "pagar" },
          { from: "pagado", to: "enviado", label: "enviar" },
          { from: "enviado", to: "entregado", label: "recibir" },
          { from: "entregado", to: "fin" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
