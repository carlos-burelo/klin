import type { FlowEdge, FlowNode } from "@carlos-burelo/klin";
import { FlowChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const becaNodes: FlowNode[] = [
  { id: "solicitud", label: "Solicitud recibida", kind: "start" },
  { id: "promedio", label: "¿Promedio mayor a 8?", kind: "decision" },
  { id: "documentos", label: "Revisar documentos", sub: "Control escolar" },
  { id: "otorgada", label: "Beca otorgada", kind: "end" },
  { id: "rechazada", label: "Rechazada", kind: "end" },
];

const becaEdges: FlowEdge[] = [
  { from: "solicitud", to: "promedio" },
  { from: "promedio", to: "documentos", label: "sí" },
  { from: "promedio", to: "rechazada", label: "no" },
  { from: "documentos", to: "otorgada" },
];

const devolucionNodes: FlowNode[] = [
  { id: "ticket", label: "Ticket creado", kind: "start" },
  { id: "revision", label: "Revisar producto", sub: "Almacén" },
  { id: "reembolso", label: "Emitir reembolso", sub: "Finanzas" },
  { id: "cierre", label: "Caso cerrado", kind: "end" },
];

const devolucionEdges: FlowEdge[] = [
  { from: "ticket", to: "revision", label: "recibe" },
  { from: "revision", to: "reembolso", label: "aprueba" },
  { from: "reembolso", to: "cierre" },
];

export default function FlowChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="proceso vertical con decisión de sí o no"
        code={`import { FlowChart } from "@carlos-burelo/klin";

const nodes = [
  { id: "solicitud", label: "Solicitud recibida", kind: "start" },
  { id: "promedio", label: "¿Promedio mayor a 8?", kind: "decision" },
  { id: "documentos", label: "Revisar documentos", sub: "Control escolar" },
  { id: "otorgada", label: "Beca otorgada", kind: "end" },
  { id: "rechazada", label: "Rechazada", kind: "end" },
];

const edges = [
  { from: "solicitud", to: "promedio" },
  { from: "promedio", to: "documentos", label: "sí" },
  { from: "promedio", to: "rechazada", label: "no" },
  { from: "documentos", to: "otorgada" },
];

<FlowChart
  ariaLabel="Flujo vertical de solicitud de beca con decisión de promedio"
  nodes={nodes}
  edges={edges}
  direction="TB"
/>`}
      >
        <FlowChart
          ariaLabel="Flujo vertical de solicitud de beca con decisión de promedio"
          nodes={becaNodes}
          edges={becaEdges}
          direction="TB"
        />
      </DemoExample>
      <DemoExample
        caption="proceso horizontal lineal con responsables por paso"
        code={`import { FlowChart } from "@carlos-burelo/klin";

const nodes = [
  { id: "ticket", label: "Ticket creado", kind: "start" },
  { id: "revision", label: "Revisar producto", sub: "Almacén" },
  { id: "reembolso", label: "Emitir reembolso", sub: "Finanzas" },
  { id: "cierre", label: "Caso cerrado", kind: "end" },
];

const edges = [
  { from: "ticket", to: "revision", label: "recibe" },
  { from: "revision", to: "reembolso", label: "aprueba" },
  { from: "reembolso", to: "cierre" },
];

<FlowChart
  ariaLabel="Flujo horizontal de devolución con responsables por paso"
  nodes={nodes}
  edges={edges}
  direction="LR"
/>`}
      >
        <FlowChart
          ariaLabel="Flujo horizontal de devolución con responsables por paso"
          nodes={devolucionNodes}
          edges={devolucionEdges}
          direction="LR"
        />
      </DemoExample>
    </div>
  );
}
