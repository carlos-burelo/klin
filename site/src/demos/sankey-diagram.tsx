import { ChartTooltipPortal, SankeyDiagram } from "@carlos-burelo/klin";

/** Flujo de aspirantes desde registro hasta inscripción (personas). */
export default function SankeyDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <SankeyDiagram
        ariaLabel="Flujo de aspirantes desde el registro hasta la inscripción"
        nodes={[
          { id: "registro", label: "Registro" },
          { id: "examen", label: "Examen" },
          { id: "aceptados", label: "Aceptados" },
          { id: "inscritos", label: "Inscritos" },
          { id: "rechazados", label: "No aceptados" },
        ]}
        flows={[
          { from: "registro", to: "examen", value: 8400 },
          { from: "examen", to: "aceptados", value: 3200 },
          { from: "examen", to: "rechazados", value: 5200 },
          { from: "aceptados", to: "inscritos", value: 2600 },
        ]}
      />
    </ChartTooltipPortal>
  );
}
