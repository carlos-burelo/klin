import { ChartTooltipPortal, TernaryPlot } from "@carlos-burelo/klin";

export default function TernaryPlotDemo() {
  return (
    <ChartTooltipPortal>
      <TernaryPlot
        ariaLabel="Composición de suelos agrícolas por estado en arena, limo y arcilla, el norte es arenoso y el sureste arcilloso"
        aLabel="Arena"
        bLabel="Limo"
        cLabel="Arcilla"
        points={[
          { a: 60, b: 25, c: 15, label: "Sonora" },
          { a: 40, b: 35, c: 25, label: "Jalisco" },
          { a: 30, b: 40, c: 30, label: "Michoacán" },
          { a: 35, b: 25, c: 40, label: "Yucatán" },
          { a: 25, b: 30, c: 45, label: "Oaxaca" },
          { a: 20, b: 35, c: 45, label: "Chiapas" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
