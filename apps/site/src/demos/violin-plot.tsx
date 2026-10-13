/**
 * Demo Violines del site (no se publica en el bundle de la lib).
 */
import {
  ChartTooltipPortal,
  type ViolinGroup,
  ViolinPlot,
} from "@carlos-burelo/klin";

const groups: ViolinGroup[] = [
  { label: "Matutino", values: [8, 9, 9, 10, 8, 9, 7, 9, 10, 8] },
  { label: "Vespertino", values: [7, 8, 7, 8, 9, 7, 8, 6, 8, 7] },
  { label: "Nocturno", values: [6, 7, 8, 7, 6, 8, 7, 9, 6, 7] },
];

export default function ViolinPlotDemo() {
  return (
    <ChartTooltipPortal>
      <ViolinPlot
        ariaLabel="Distribución de calificaciones de matemáticas por turno, con la mediana más alta en el matutino"
        groups={groups}
      />
    </ChartTooltipPortal>
  );
}
