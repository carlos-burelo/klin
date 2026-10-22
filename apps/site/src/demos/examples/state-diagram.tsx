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

const estresNodes: StateNode[] = [
  { id: "s-inicio", label: "Inicio", kind: "initial" },
  { id: "s-captura", label: "Captura" },
  { id: "s-validacion", label: "Validación" },
  { id: "s-correccion", label: "Corrección" },
  { id: "s-revision", label: "Revisión" },
  { id: "s-dictamen", label: "Dictamen" },
  { id: "s-autorizacion", label: "Autorización" },
  { id: "s-pago", label: "Pago" },
  { id: "s-ejecucion", label: "Ejecución" },
  { id: "s-cierre", label: "Cierre" },
  { id: "s-cancelada", label: "Cancelada" },
  { id: "s-fin", label: "Fin", kind: "final" },
];

const estresEdges: StateEdge[] = [
  { from: "s-inicio", to: "s-captura", label: "abrir" },
  { from: "s-captura", to: "s-validacion", label: "enviar" },
  { from: "s-validacion", to: "s-correccion", label: "observar" },
  { from: "s-correccion", to: "s-validacion", label: "reenviar" },
  { from: "s-validacion", to: "s-revision", label: "aprobar" },
  { from: "s-revision", to: "s-dictamen", label: "turnar" },
  { from: "s-dictamen", to: "s-revision", label: "ampliar" },
  { from: "s-dictamen", to: "s-autorizacion", label: "resolver" },
  { from: "s-autorizacion", to: "s-pago", label: "ordenar" },
  { from: "s-pago", to: "s-ejecucion", label: "liberar" },
  { from: "s-ejecucion", to: "s-revision", label: "auditar" },
  { from: "s-ejecucion", to: "s-cierre", label: "terminar" },
  { from: "s-cierre", to: "s-fin" },
  { from: "s-validacion", to: "s-cancelada", label: "desechar" },
  { from: "s-cancelada", to: "s-captura", label: "reabrir" },
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
      <DemoExample
        caption="misma máquina de documento con leyenda de estados"
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
  ariaLabel="Diagrama de estados de documento con leyenda visible"
  nodes={nodes}
  edges={edges}
  direction="TB"
  showLegend
/>`}
      >
        <StateDiagram
          ariaLabel="Diagrama de estados de documento con leyenda visible"
          nodes={documentoNodes}
          edges={documentoEdges}
          direction="TB"
          showLegend
        />
      </DemoExample>
      <DemoExample
        caption="estrés con 12 estados, ciclos de corrección y reapertura"
        code={`import { StateDiagram } from "@carlos-burelo/klin";

const nodes = [
  { id: "s-inicio", label: "Inicio", kind: "initial" },
  { id: "s-captura", label: "Captura" },
  { id: "s-validacion", label: "Validación" },
  { id: "s-correccion", label: "Corrección" },
  { id: "s-revision", label: "Revisión" },
  { id: "s-dictamen", label: "Dictamen" },
  { id: "s-autorizacion", label: "Autorización" },
  { id: "s-pago", label: "Pago" },
  { id: "s-ejecucion", label: "Ejecución" },
  { id: "s-cierre", label: "Cierre" },
  { id: "s-cancelada", label: "Cancelada" },
  { id: "s-fin", label: "Fin", kind: "final" },
];

const edges = [
  { from: "s-inicio", to: "s-captura", label: "abrir" },
  { from: "s-captura", to: "s-validacion", label: "enviar" },
  { from: "s-validacion", to: "s-correccion", label: "observar" },
  { from: "s-correccion", to: "s-validacion", label: "reenviar" },
  { from: "s-validacion", to: "s-revision", label: "aprobar" },
  { from: "s-revision", to: "s-dictamen", label: "turnar" },
  { from: "s-dictamen", to: "s-revision", label: "ampliar" },
  { from: "s-dictamen", to: "s-autorizacion", label: "resolver" },
  { from: "s-autorizacion", to: "s-pago", label: "ordenar" },
  { from: "s-pago", to: "s-ejecucion", label: "liberar" },
  { from: "s-ejecucion", to: "s-revision", label: "auditar" },
  { from: "s-ejecucion", to: "s-cierre", label: "terminar" },
  { from: "s-cierre", to: "s-fin" },
  { from: "s-validacion", to: "s-cancelada", label: "desechar" },
  { from: "s-cancelada", to: "s-captura", label: "reabrir" },
];

<StateDiagram
  ariaLabel="Diagrama de expediente con 12 estados y ciclos de corrección"
  nodes={nodes}
  edges={edges}
  direction="LR"
/>`}
      >
        <StateDiagram
          ariaLabel="Diagrama de expediente con 12 estados y ciclos de corrección"
          nodes={estresNodes}
          edges={estresEdges}
          direction="LR"
        />
      </DemoExample>
    </div>
  );
}
