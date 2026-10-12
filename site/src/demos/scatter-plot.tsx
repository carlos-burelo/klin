import { ChartTooltipPortal, ScatterPlot } from "@carlos-burelo/klin";

/** Relación entre horas de estudio y calificación por estudiante. */
export default function ScatterPlotDemo() {
  return (
    <ChartTooltipPortal>
      <ScatterPlot
        ariaLabel="Dispersión de horas de estudio frente a calificación"
        xLabel="Horas de estudio"
        yLabel="Calificación"
        points={[
          { label: "Ana", x: 12, y: 9.1 },
          { label: "Bruno", x: 4, y: 6.2 },
          { label: "Carla", x: 8, y: 8.0 },
          { label: "Diego", x: 2, y: 5.4 },
          { label: "Elena", x: 10, y: 8.7 },
          { label: "Fabián", x: 6, y: 7.3 },
          { label: "Greta", x: 14, y: 9.5 },
          { label: "Hugo", x: 5, y: 6.8 },
          { label: "Irene", x: 9, y: 8.2 },
          { label: "Jorge", x: 3, y: 5.9 },
          { label: "Karla", x: 11, y: 8.9 },
          { label: "Luis", x: 7, y: 7.6 },
        ]}
      />
    </ChartTooltipPortal>
  );
}
