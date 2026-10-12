import type { ActorNode, UseCaseEdge, UseCaseNode } from "@carlos-burelo/klin";
import { ChartTooltipPortal, UseCaseDiagram } from "@carlos-burelo/klin";

const actors: ActorNode[] = [
  { id: "ciudadano", label: "Ciudadano" },
  { id: "funcionario", label: "Funcionario de ventanilla" },
];

const usecases: UseCaseNode[] = [
  { id: "solicitar", label: "Solicitar cita" },
  { id: "cancelar", label: "Cancelar cita" },
  { id: "validar", label: "Validar documentos" },
  { id: "reporte", label: "Generar reporte diario" },
];

const edges: UseCaseEdge[] = [
  { from: "ciudadano", to: "solicitar" },
  { from: "ciudadano", to: "cancelar" },
  { from: "solicitar", to: "validar", kind: "include" },
  { from: "funcionario", to: "validar" },
  { from: "funcionario", to: "reporte" },
  { from: "reporte", to: "validar", kind: "extend" },
];

export default function UsecaseDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <UseCaseDiagram
        actors={actors}
        usecases={usecases}
        edges={edges}
        ariaLabel="Casos de uso del sistema de citas de ventanilla"
      />
    </ChartTooltipPortal>
  );
}
