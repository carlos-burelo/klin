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

const estresActors: ActorNode[] = [
  { id: "u-cliente", label: "Cliente" },
  { id: "u-caja", label: "Cajero" },
  { id: "u-admin", label: "Gerente" },
];

const estresUsecases: UseCaseNode[] = [
  { id: "u-abrir", label: "Abrir cuenta" },
  { id: "u-validar", label: "Validar identidad" },
  { id: "u-depositar", label: "Depositar" },
  { id: "u-retirar", label: "Retirar" },
  { id: "u-transferir", label: "Transferir" },
  { id: "u-pagar", label: "Pagar servicio" },
  { id: "u-bloquear", label: "Bloquear tarjeta" },
  { id: "u-reponer", label: "Reponer plástico" },
  { id: "u-corte", label: "Generar corte" },
  { id: "u-auditar", label: "Auditar caja" },
];

const estresEdgesU: UseCaseEdge[] = [
  { from: "u-cliente", to: "u-abrir" },
  { from: "u-abrir", to: "u-validar", kind: "include" },
  { from: "u-cliente", to: "u-depositar" },
  { from: "u-cliente", to: "u-retirar" },
  { from: "u-cliente", to: "u-transferir" },
  { from: "u-transferir", to: "u-validar", kind: "include" },
  { from: "u-cliente", to: "u-pagar" },
  { from: "u-pagar", to: "u-validar", kind: "include" },
  { from: "u-cliente", to: "u-bloquear" },
  { from: "u-bloquear", to: "u-reponer", kind: "extend" },
  { from: "u-caja", to: "u-corte" },
  { from: "u-admin", to: "u-auditar" },
  { from: "u-auditar", to: "u-corte", kind: "include" },
  { from: "u-caja", to: "u-depositar" },
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
      <DemoExample
        caption="misma clínica vertical con leyenda de relaciones"
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
  ariaLabel="Casos de uso de clínica en vertical con leyenda"
  actors={actors}
  usecases={usecases}
  edges={edges}
  direction="TB"
  showLegend
/>`}
      >
        <UseCaseDiagram
          ariaLabel="Casos de uso de clínica en vertical con leyenda"
          actors={clinicaActors}
          usecases={clinicaUsecases}
          edges={clinicaEdges}
          direction="TB"
          showLegend
        />
      </DemoExample>
      <DemoExample
        caption="estrés bancario con 10 casos, inclusiones y extensión compartidos"
        code={`import { UseCaseDiagram } from "@carlos-burelo/klin";

const actors = [
  { id: "u-cliente", label: "Cliente" },
  { id: "u-caja", label: "Cajero" },
  { id: "u-admin", label: "Gerente" },
];

const usecases = [
  { id: "u-abrir", label: "Abrir cuenta" },
  { id: "u-validar", label: "Validar identidad" },
  { id: "u-depositar", label: "Depositar" },
  { id: "u-retirar", label: "Retirar" },
  { id: "u-transferir", label: "Transferir" },
  { id: "u-pagar", label: "Pagar servicio" },
  { id: "u-bloquear", label: "Bloquear tarjeta" },
  { id: "u-reponer", label: "Reponer plástico" },
  { id: "u-corte", label: "Generar corte" },
  { id: "u-auditar", label: "Auditar caja" },
];

const edges = [
  { from: "u-cliente", to: "u-abrir" },
  { from: "u-abrir", to: "u-validar", kind: "include" },
  { from: "u-cliente", to: "u-depositar" },
  { from: "u-cliente", to: "u-retirar" },
  { from: "u-cliente", to: "u-transferir" },
  { from: "u-transferir", to: "u-validar", kind: "include" },
  { from: "u-cliente", to: "u-pagar" },
  { from: "u-pagar", to: "u-validar", kind: "include" },
  { from: "u-cliente", to: "u-bloquear" },
  { from: "u-bloquear", to: "u-reponer", kind: "extend" },
  { from: "u-caja", to: "u-corte" },
  { from: "u-admin", to: "u-auditar" },
  { from: "u-auditar", to: "u-corte", kind: "include" },
  { from: "u-caja", to: "u-depositar" },
];

<UseCaseDiagram
  ariaLabel="Casos de uso bancarios densos con validación compartida"
  actors={actors}
  usecases={usecases}
  edges={edges}
/>`}
      >
        <UseCaseDiagram
          ariaLabel="Casos de uso bancarios densos con validación compartida"
          actors={estresActors}
          usecases={estresUsecases}
          edges={estresEdgesU}
        />
      </DemoExample>
    </div>
  );
}
