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

const estresNodes: ArchNode[] = [
  { id: "a-app", label: "App", sub: "Flutter", kind: "actor" },
  { id: "a-cdn", label: "CDN", sub: "Borde", kind: "service" },
  { id: "a-web", label: "Portal", sub: "Next.js", kind: "service" },
  { id: "a-auth", label: "Identidad", sub: "OAuth", kind: "service" },
  { id: "a-api", label: "API", sub: "REST", kind: "service" },
  { id: "a-pagos", label: "Pagos", sub: "API externa", kind: "external" },
  { id: "a-correo", label: "Correo", sub: "SMTP externo", kind: "external" },
  { id: "a-cola", label: "Tareas", sub: "Cola de trabajos", kind: "queue" },
  { id: "a-worker", label: "Worker", sub: "Nodo de proceso", kind: "service" },
  { id: "a-cache", label: "Caché", sub: "Redis", kind: "database" },
  { id: "a-bd", label: "Base de datos", sub: "Postgres", kind: "database" },
  { id: "a-respaldo", label: "Respaldo", sub: "S3", kind: "database" },
];

const estresEdges: ArchEdge[] = [
  { from: "a-app", to: "a-cdn", label: "HTTPS" },
  { from: "a-cdn", to: "a-web", label: "origen" },
  { from: "a-web", to: "a-auth", label: "login" },
  { from: "a-web", to: "a-api", label: "JSON" },
  { from: "a-api", to: "a-auth", label: "verifica" },
  { from: "a-api", to: "a-pagos", label: "cobra" },
  { from: "a-api", to: "a-cola", label: "encola" },
  { from: "a-cola", to: "a-worker", label: "consume" },
  { from: "a-worker", to: "a-correo", label: "avisa" },
  { from: "a-worker", to: "a-bd", label: "guarda" },
  { from: "a-api", to: "a-cache", label: "lee" },
  { from: "a-cache", to: "a-bd", label: "rellena" },
  { from: "a-bd", to: "a-respaldo", label: "replica" },
  { from: "a-worker", to: "a-api", label: "reporta" },
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
      <DemoExample
        caption="misma tienda vertical con leyenda de tipos de nodo"
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
  ariaLabel="Diagrama de arquitectura de tienda con leyenda de tipos"
  nodes={nodes}
  edges={edges}
  direction="TB"
  showLegend
/>`}
      >
        <ArchitectureDiagram
          ariaLabel="Diagrama de arquitectura de tienda con leyenda de tipos"
          nodes={tiendaNodes}
          edges={tiendaEdges}
          direction="TB"
          showLegend
        />
      </DemoExample>
      <DemoExample
        caption="estrés con 12 servicios apretados y ciclo de reporte del worker"
        code={`import { ArchitectureDiagram } from "@carlos-burelo/klin";

const nodes = [
  { id: "a-app", label: "App", sub: "Flutter", kind: "actor" },
  { id: "a-cdn", label: "CDN", sub: "Borde", kind: "service" },
  { id: "a-web", label: "Portal", sub: "Next.js", kind: "service" },
  { id: "a-auth", label: "Identidad", sub: "OAuth", kind: "service" },
  { id: "a-api", label: "API", sub: "REST", kind: "service" },
  { id: "a-pagos", label: "Pagos", sub: "API externa", kind: "external" },
  { id: "a-correo", label: "Correo", sub: "SMTP externo", kind: "external" },
  { id: "a-cola", label: "Tareas", sub: "Cola de trabajos", kind: "queue" },
  { id: "a-worker", label: "Worker", sub: "Nodo de proceso", kind: "service" },
  { id: "a-cache", label: "Caché", sub: "Redis", kind: "database" },
  { id: "a-bd", label: "Base de datos", sub: "Postgres", kind: "database" },
  { id: "a-respaldo", label: "Respaldo", sub: "S3", kind: "database" },
];

const edges = [
  { from: "a-app", to: "a-cdn", label: "HTTPS" },
  { from: "a-cdn", to: "a-web", label: "origen" },
  { from: "a-web", to: "a-auth", label: "login" },
  { from: "a-web", to: "a-api", label: "JSON" },
  { from: "a-api", to: "a-auth", label: "verifica" },
  { from: "a-api", to: "a-pagos", label: "cobra" },
  { from: "a-api", to: "a-cola", label: "encola" },
  { from: "a-cola", to: "a-worker", label: "consume" },
  { from: "a-worker", to: "a-correo", label: "avisa" },
  { from: "a-worker", to: "a-bd", label: "guarda" },
  { from: "a-api", to: "a-cache", label: "lee" },
  { from: "a-cache", to: "a-bd", label: "rellena" },
  { from: "a-bd", to: "a-respaldo", label: "replica" },
  { from: "a-worker", to: "a-api", label: "reporta" },
];

<ArchitectureDiagram
  ariaLabel="Arquitectura densa de plataforma con 12 nodos y ciclo de reporte"
  nodes={nodes}
  edges={edges}
  direction="LR"
/>`}
      >
        <ArchitectureDiagram
          ariaLabel="Arquitectura densa de plataforma con 12 nodos y ciclo de reporte"
          nodes={estresNodes}
          edges={estresEdges}
          direction="LR"
        />
      </DemoExample>
    </div>
  );
}
