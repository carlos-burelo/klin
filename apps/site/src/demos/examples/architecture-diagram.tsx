import type { ArchEdge, ArchNode } from "@carlos-burelo/klin";
import { ArchitectureDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const tiendaNodes: ArchNode[] = [
  { id: "cliente", label: "Cliente", sub: "Navegador web", kind: "actor" },
  { id: "tienda", label: "Tienda", sub: "Next.js", kind: "service" },
  { id: "pagos", label: "Pagos", sub: "API externa", kind: "external" },
  { id: "cola", label: "Pedidos", sub: "Cola de trabajos", kind: "queue" },
  { id: "bd", label: "Base de datos", sub: "Postgres", kind: "database" },
];

const tiendaEdges: ArchEdge[] = [
  { from: "cliente", to: "tienda", label: "HTTPS" },
  { from: "tienda", to: "pagos", label: "cobra" },
  { from: "tienda", to: "cola", label: "encola" },
  { from: "cola", to: "bd", label: "guarda" },
];

const citasNodes: ArchNode[] = [
  { id: "paciente", label: "Paciente", sub: "App móvil", kind: "actor" },
  { id: "agenda", label: "Agenda", sub: "Servicio de citas", kind: "service" },
  {
    id: "aseguradora",
    label: "Aseguradora",
    sub: "Convenio externo",
    kind: "external",
  },
  {
    id: "historial",
    label: "Historial",
    sub: "Expediente clínico",
    kind: "database",
  },
];

const citasEdges: ArchEdge[] = [
  { from: "paciente", to: "agenda", label: "reserva" },
  { from: "agenda", to: "aseguradora", label: "valida" },
  { from: "agenda", to: "historial", label: "registra" },
];

export default function ArchitectureDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="dirección vertical con actor, servicio, cola, base y externo"
        code={`import { ArchitectureDiagram } from "@carlos-burelo/klin";

const nodes = [
  { id: "cliente", label: "Cliente", sub: "Navegador web", kind: "actor" },
  { id: "tienda", label: "Tienda", sub: "Next.js", kind: "service" },
  { id: "pagos", label: "Pagos", sub: "API externa", kind: "external" },
  { id: "cola", label: "Pedidos", sub: "Cola de trabajos", kind: "queue" },
  { id: "bd", label: "Base de datos", sub: "Postgres", kind: "database" },
];

const edges = [
  { from: "cliente", to: "tienda", label: "HTTPS" },
  { from: "tienda", to: "pagos", label: "cobra" },
  { from: "tienda", to: "cola", label: "encola" },
  { from: "cola", to: "bd", label: "guarda" },
];

<ArchitectureDiagram
  ariaLabel="Diagrama de arquitectura de tienda en línea en dirección vertical"
  nodes={nodes}
  edges={edges}
  direction="TB"
/>`}
      >
        <ArchitectureDiagram
          ariaLabel="Diagrama de arquitectura de tienda en línea en dirección vertical"
          nodes={tiendaNodes}
          edges={tiendaEdges}
          direction="TB"
        />
      </DemoExample>
      <DemoExample
        caption="dirección horizontal en sistema de citas médicas"
        code={`import { ArchitectureDiagram } from "@carlos-burelo/klin";

const nodes = [
  { id: "paciente", label: "Paciente", sub: "App móvil", kind: "actor" },
  { id: "agenda", label: "Agenda", sub: "Servicio de citas", kind: "service" },
  {
    id: "aseguradora",
    label: "Aseguradora",
    sub: "Convenio externo",
    kind: "external",
  },
  {
    id: "historial",
    label: "Historial",
    sub: "Expediente clínico",
    kind: "database",
  },
];

const edges = [
  { from: "paciente", to: "agenda", label: "reserva" },
  { from: "agenda", to: "aseguradora", label: "valida" },
  { from: "agenda", to: "historial", label: "registra" },
];

<ArchitectureDiagram
  ariaLabel="Diagrama de arquitectura del sistema de citas en dirección horizontal"
  nodes={nodes}
  edges={edges}
  direction="LR"
/>`}
      >
        <ArchitectureDiagram
          ariaLabel="Diagrama de arquitectura del sistema de citas en dirección horizontal"
          nodes={citasNodes}
          edges={citasEdges}
          direction="LR"
        />
      </DemoExample>
    </div>
  );
}
