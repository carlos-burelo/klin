import type { ArcEdge, ArcNode } from "@carlos-burelo/klin";
import { ArcDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const colaboracionNodes: ArcNode[] = [
  { id: "ventas", label: "Ventas" },
  { id: "soporte", label: "Soporte" },
  { id: "producto", label: "Producto" },
  { id: "logistica", label: "Logística" },
];

const colaboracionEdges: ArcEdge[] = [
  { from: "ventas", to: "soporte", label: "12 casos" },
  { from: "ventas", to: "logistica", label: "8 pedidos" },
  { from: "soporte", to: "producto", label: "5 mejoras" },
];

const dependenciaNodes: ArcNode[] = [
  { id: "app", label: "App móvil" },
  { id: "api", label: "API" },
  { id: "auth", label: "Auth" },
  { id: "bd", label: "Base de datos" },
  { id: "cola", label: "Cola" },
];

const dependenciaEdges: ArcEdge[] = [
  { from: "app", to: "api" },
  { from: "api", to: "auth" },
  { from: "api", to: "bd" },
  { from: "api", to: "cola" },
  { from: "cola", to: "bd" },
];

export default function ArcDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="aristas con etiqueta de volumen entre áreas"
        code={`import { ArcDiagram } from "@carlos-burelo/klin";

const nodes = [
  { id: "ventas", label: "Ventas" },
  { id: "soporte", label: "Soporte" },
  { id: "producto", label: "Producto" },
  { id: "logistica", label: "Logística" },
];

const edges = [
  { from: "ventas", to: "soporte", label: "12 casos" },
  { from: "ventas", to: "logistica", label: "8 pedidos" },
  { from: "soporte", to: "producto", label: "5 mejoras" },
];

<ArcDiagram
  ariaLabel="Diagrama de arcos de colaboraciones semanales entre áreas"
  nodes={nodes}
  edges={edges}
/>`}
      >
        <ArcDiagram
          ariaLabel="Diagrama de arcos de colaboraciones semanales entre áreas"
          nodes={colaboracionNodes}
          edges={colaboracionEdges}
        />
      </DemoExample>
      <DemoExample
        caption="dependencias de sistema sin etiquetas en las aristas"
        code={`import { ArcDiagram } from "@carlos-burelo/klin";

const nodes = [
  { id: "app", label: "App móvil" },
  { id: "api", label: "API" },
  { id: "auth", label: "Auth" },
  { id: "bd", label: "Base de datos" },
  { id: "cola", label: "Cola" },
];

const edges = [
  { from: "app", to: "api" },
  { from: "api", to: "auth" },
  { from: "api", to: "bd" },
  { from: "api", to: "cola" },
  { from: "cola", to: "bd" },
];

<ArcDiagram
  ariaLabel="Diagrama de arcos de dependencias entre componentes del sistema"
  nodes={nodes}
  edges={edges}
/>`}
      >
        <ArcDiagram
          ariaLabel="Diagrama de arcos de dependencias entre componentes del sistema"
          nodes={dependenciaNodes}
          edges={dependenciaEdges}
        />
      </DemoExample>
      <DemoExample
        caption="estado vacío con título y descripción propios"
        code={`import { ArcDiagram } from "@carlos-burelo/klin";

<ArcDiagram
  ariaLabel="Diagrama de arcos sin relaciones registradas"
  nodes={[]}
  edges={[]}
  emptyTitle="Sin relaciones todavía"
  emptyDescription="Agrega nodos y aristas para ver el diagrama de arcos."
/>`}
      >
        <ArcDiagram
          ariaLabel="Diagrama de arcos sin relaciones registradas"
          nodes={[]}
          edges={[]}
          emptyTitle="Sin relaciones todavía"
          emptyDescription="Agrega nodos y aristas para ver el diagrama de arcos."
        />
      </DemoExample>
    </div>
  );
}
