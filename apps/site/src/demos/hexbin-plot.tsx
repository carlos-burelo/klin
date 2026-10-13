import { ChartTooltipPortal, HexbinPlot } from "@carlos-burelo/klin";

/** Distancia frente a tiempo de entrega en repartos de última milla. */
export default function HexbinPlotDemo() {
  return (
    <ChartTooltipPortal>
      <HexbinPlot
        ariaLabel="Distancia frente a tiempo de entrega en repartos; la mayoría se concentra entre 2 y 6 km con 15 a 30 minutos"
        points={[
          { x: 2.1, y: 16 },
          { x: 3.4, y: 22 },
          { x: 4.0, y: 25 },
          { x: 2.8, y: 19 },
          { x: 5.2, y: 28 },
          { x: 3.1, y: 21 },
          { x: 4.6, y: 27 },
          { x: 2.4, y: 17 },
          { x: 5.8, y: 31 },
          { x: 3.7, y: 24 },
          { x: 6.4, y: 35 },
          { x: 1.8, y: 14 },
          { x: 4.2, y: 26 },
          { x: 7.1, y: 40 },
          { x: 3.0, y: 20 },
          { x: 5.0, y: 29 },
          { x: 8.3, y: 47 },
          { x: 2.6, y: 18 },
        ]}
      />
    </ChartTooltipPortal>
  );
}
