import type { ActorNode, UseCaseEdge, UseCaseNode } from "@carlos-burelo/klin";
import { UseCaseDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const clinicaActors: ActorNode[] = [
  { id: "paciente", label: "Paciente" },
  { id: "recepcion", label: "Recepción" },
];

const clinicaUsecases: UseCaseNode[] = [
  { id: "agendar", label: "Agendar cita" },
  { id: "seguro", label: "Validar seguro" },
  { id: "historial", label: "Ver historial" },
];

const clinicaEdges: UseCaseEdge[] = [
  { from: "paciente", to: "agendar" },
  { from: "agendar", to: "seguro", kind: "include" },
  { from: "recepcion", to: "historial" },
];

const bibliotecaActors: ActorNode[] = [
  { id: "lector", label: "Lector" },
  { id: "staff", label: "Bibliotecario" },
];

const bibliotecaUsecases: UseCaseNode[] = [
  { id: "prestar", label: "Pedir prestado" },
  { id: "multa", label: "Pagar multa" },
  { id: "catalogar", label: "Catalogar libro" },
];

const bibliotecaEdges: UseCaseEdge[] = [
  { from: "lector", to: "prestar" },
  { from: "prestar", to: "multa", kind: "extend" },
  { from: "staff", to: "catalogar" },
];

export default function UseCaseDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="clínica con relación de inclusión obligatoria"
        code={`import { UseCaseDiagram } from "@carlos-burelo/klin";

const actors = [
  { id: "paciente", label: "Paciente" },
  { id: "recepcion", label: "Recepción" },
];

const usecases = [
  { id: "agendar", label: "Agendar cita" },
  { id: "seguro", label: "Validar seguro" },
  { id: "historial", label: "Ver historial" },
];

const edges = [
  { from: "paciente", to: "agendar" },
  { from: "agendar", to: "seguro", kind: "include" },
  { from: "recepcion", to: "historial" },
];

<UseCaseDiagram
  ariaLabel="Casos de uso de clínica donde agendar incluye validar seguro"
  actors={actors}
  usecases={usecases}
  edges={edges}
/>`}
      >
        <UseCaseDiagram
          ariaLabel="Casos de uso de clínica donde agendar incluye validar seguro"
          actors={clinicaActors}
          usecases={clinicaUsecases}
          edges={clinicaEdges}
        />
      </DemoExample>
      <DemoExample
        caption="biblioteca con extensión opcional de pago de multa"
        code={`import { UseCaseDiagram } from "@carlos-burelo/klin";

const actors = [
  { id: "lector", label: "Lector" },
  { id: "staff", label: "Bibliotecario" },
];

const usecases = [
  { id: "prestar", label: "Pedir prestado" },
  { id: "multa", label: "Pagar multa" },
  { id: "catalogar", label: "Catalogar libro" },
];

const edges = [
  { from: "lector", to: "prestar" },
  { from: "prestar", to: "multa", kind: "extend" },
  { from: "staff", to: "catalogar" },
];

<UseCaseDiagram
  ariaLabel="Casos de uso de biblioteca donde el préstamo extiende a pagar multa"
  actors={actors}
  usecases={usecases}
  edges={edges}
/>`}
      >
        <UseCaseDiagram
          ariaLabel="Casos de uso de biblioteca donde el préstamo extiende a pagar multa"
          actors={bibliotecaActors}
          usecases={bibliotecaUsecases}
          edges={bibliotecaEdges}
        />
      </DemoExample>
    </div>
  );
}
