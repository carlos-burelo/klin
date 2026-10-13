import type { StateEdge, StateNode } from "@carlos-burelo/klin";
import { StateDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const tramiteNodes: StateNode[] = [
  { id: "inicio", label: "Inicio", kind: "initial" },
  { id: "creada", label: "Creada" },
  { id: "revisada", label: "En revisión" },
  { id: "aprobada", label: "Aprobada" },
  { id: "fin", label: "Fin", kind: "final" },
];

const tramiteEdges: StateEdge[] = [
  { from: "inicio", to: "creada", label: "registrar" },
  { from: "creada", to: "revisada", label: "turnar" },
  { from: "revisada", to: "aprobada", label: "autorizar" },
  { from: "aprobada", to: "fin" },
];

const documentoNodes: StateNode[] = [
  { id: "inicio", label: "Inicio", kind: "initial" },
  { id: "borrador", label: "Borrador" },
  { id: "firmado", label: "Firmado" },
  { id: "archivado", label: "Archivado" },
  { id: "fin", label: "Fin", kind: "final" },
];

const documentoEdges: StateEdge[] = [
  { from: "inicio", to: "borrador", label: "redactar" },
  { from: "borrador", to: "firmado", label: "firmar" },
  { from: "firmado", to: "borrador", label: "corregir" },
  { from: "firmado", to: "archivado", label: "resguardar" },
  { from: "archivado", to: "fin" },
];

export default function StateDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="ciclo lineal de solicitud con estados inicial y final"
        code={`import { StateDiagram } from "@carlos-burelo/klin";

const nodes = [
  { id: "inicio", label: "Inicio", kind: "initial" },
  { id: "creada", label: "Creada" },
  { id: "revisada", label: "En revisión" },
  { id: "aprobada", label: "Aprobada" },
  { id: "fin", label: "Fin", kind: "final" },
];

const edges = [
  { from: "inicio", to: "creada", label: "registrar" },
  { from: "creada", to: "revisada", label: "turnar" },
  { from: "revisada", to: "aprobada", label: "autorizar" },
  { from: "aprobada", to: "fin" },
];

<StateDiagram
  ariaLabel="Diagrama de estados del trámite de solicitud"
  nodes={nodes}
  edges={edges}
  direction="LR"
/>`}
      >
        <StateDiagram
          ariaLabel="Diagrama de estados del trámite de solicitud"
          nodes={tramiteNodes}
          edges={tramiteEdges}
          direction="LR"
        />
      </DemoExample>
      <DemoExample
        caption="máquina vertical con transición de retorno por corrección"
        code={`import { StateDiagram } from "@carlos-burelo/klin";

const nodes = [
  { id: "inicio", label: "Inicio", kind: "initial" },
  { id: "borrador", label: "Borrador" },
  { id: "firmado", label: "Firmado" },
  { id: "archivado", label: "Archivado" },
  { id: "fin", label: "Fin", kind: "final" },
];

const edges = [
  { from: "inicio", to: "borrador", label: "redactar" },
  { from: "borrador", to: "firmado", label: "firmar" },
  { from: "firmado", to: "borrador", label: "corregir" },
  { from: "firmado", to: "archivado", label: "resguardar" },
  { from: "archivado", to: "fin" },
];

<StateDiagram
  ariaLabel="Diagrama de estados de documento con retorno a borrador"
  nodes={nodes}
  edges={edges}
  direction="TB"
/>`}
      >
        <StateDiagram
          ariaLabel="Diagrama de estados de documento con retorno a borrador"
          nodes={documentoNodes}
          edges={documentoEdges}
          direction="TB"
        />
      </DemoExample>
    </div>
  );
}
