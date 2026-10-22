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

const leyendaNodes: FlowNode[] = [
  { id: "inicio", label: "Inicio", kind: "start" },
  { id: "validar", label: "Validar datos", sub: "Control escolar" },
  { id: "beca", label: "¿Merece beca?", kind: "decision" },
  { id: "fin", label: "Fin del trámite", kind: "end" },
];

const leyendaEdges: FlowEdge[] = [
  { from: "inicio", to: "validar" },
  { from: "validar", to: "beca" },
  { from: "beca", to: "fin", label: "sí" },
];

const estresNodes: FlowNode[] = [
  { id: "f-inicio", label: "Inicio", kind: "start" },
  { id: "f-registro", label: "Registrar solicitud", sub: "Ventanilla" },
  { id: "f-validar", label: "Validar datos", sub: "Control" },
  { id: "f-reglas", label: "¿Reglas completas?", kind: "decision" },
  { id: "f-pago", label: "Registrar pago", sub: "Caja" },
  { id: "f-revision", label: "Revisión técnica", sub: "Área técnica" },
  { id: "f-dictamen", label: "¿Dictamen favorable?", kind: "decision" },
  { id: "f-subsanar", label: "Subsanar observaciones" },
  { id: "f-visita", label: "Visita de campo", sub: "Brigada" },
  { id: "f-firma", label: "Firma de responsable", sub: "Dirección" },
  { id: "f-fin", label: "Trámite cerrado", kind: "end" },
  { id: "f-baja", label: "Baja definitiva", kind: "end" },
];

const estresEdges: FlowEdge[] = [
  { from: "f-inicio", to: "f-registro" },
  { from: "f-registro", to: "f-validar" },
  { from: "f-validar", to: "f-reglas" },
  { from: "f-reglas", to: "f-pago", label: "sí" },
  { from: "f-reglas", to: "f-registro", label: "no" },
  { from: "f-pago", to: "f-revision" },
  { from: "f-revision", to: "f-dictamen" },
  { from: "f-dictamen", to: "f-firma", label: "sí" },
  { from: "f-dictamen", to: "f-subsanar", label: "no" },
  { from: "f-subsanar", to: "f-visita" },
  { from: "f-visita", to: "f-revision", label: "repite" },
  { from: "f-subsanar", to: "f-validar", label: "reinicia" },
  { from: "f-firma", to: "f-fin" },
  { from: "f-reglas", to: "f-baja", label: "abandona" },
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
      <DemoExample
        caption="leyenda visible con colores propios por tipo de nodo"
        code={`import { FlowChart } from "@carlos-burelo/klin";

const nodes = [
  { id: "inicio", label: "Inicio", kind: "start" },
  { id: "validar", label: "Validar datos", sub: "Control escolar" },
  { id: "beca", label: "¿Merece beca?", kind: "decision" },
  { id: "fin", label: "Fin del trámite", kind: "end" },
];

const edges = [
  { from: "inicio", to: "validar" },
  { from: "validar", to: "beca" },
  { from: "beca", to: "fin", label: "sí" },
];

<FlowChart
  ariaLabel="Flujo de beca con leyenda y colores por tipo de nodo"
  nodes={nodes}
  edges={edges}
  direction="TB"
  showLegend
  statusColors={{ decision: "var(--chart-2)", end: "var(--chart-4)" }}
/>`}
      >
        <FlowChart
          ariaLabel="Flujo de beca con leyenda y colores por tipo de nodo"
          nodes={leyendaNodes}
          edges={leyendaEdges}
          direction="TB"
          showLegend
          statusColors={{ decision: "var(--chart-2)", end: "var(--chart-4)" }}
        />
      </DemoExample>
      <DemoExample
        caption="estrés con 12 nodos, ciclos y retornos largos de subsanación"
        code={`import { FlowChart } from "@carlos-burelo/klin";

const nodes = [
  { id: "f-inicio", label: "Inicio", kind: "start" },
  { id: "f-registro", label: "Registrar solicitud", sub: "Ventanilla" },
  { id: "f-validar", label: "Validar datos", sub: "Control" },
  { id: "f-reglas", label: "¿Reglas completas?", kind: "decision" },
  { id: "f-pago", label: "Registrar pago", sub: "Caja" },
  { id: "f-revision", label: "Revisión técnica", sub: "Área técnica" },
  { id: "f-dictamen", label: "¿Dictamen favorable?", kind: "decision" },
  { id: "f-subsanar", label: "Subsanar observaciones" },
  { id: "f-visita", label: "Visita de campo", sub: "Brigada" },
  { id: "f-firma", label: "Firma de responsable", sub: "Dirección" },
  { id: "f-fin", label: "Trámite cerrado", kind: "end" },
  { id: "f-baja", label: "Baja definitiva", kind: "end" },
];

const edges = [
  { from: "f-inicio", to: "f-registro" },
  { from: "f-registro", to: "f-validar" },
  { from: "f-validar", to: "f-reglas" },
  { from: "f-reglas", to: "f-pago", label: "sí" },
  { from: "f-reglas", to: "f-registro", label: "no" },
  { from: "f-pago", to: "f-revision" },
  { from: "f-revision", to: "f-dictamen" },
  { from: "f-dictamen", to: "f-firma", label: "sí" },
  { from: "f-dictamen", to: "f-subsanar", label: "no" },
  { from: "f-subsanar", to: "f-visita" },
  { from: "f-visita", to: "f-revision", label: "repite" },
  { from: "f-subsanar", to: "f-validar", label: "reinicia" },
  { from: "f-firma", to: "f-fin" },
  { from: "f-reglas", to: "f-baja", label: "abandona" },
];

<FlowChart
  ariaLabel="Flujo de trámite con 12 nodos, ciclos y retornos de subsanación"
  nodes={nodes}
  edges={edges}
  direction="TB"
/>`}
      >
        <FlowChart
          ariaLabel="Flujo de trámite con 12 nodos, ciclos y retornos de subsanación"
          nodes={estresNodes}
          edges={estresEdges}
          direction="TB"
        />
      </DemoExample>
    </div>
  );
}
