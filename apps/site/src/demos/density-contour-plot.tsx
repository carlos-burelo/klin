import { ChartTooltipPortal, DensityContourPlot } from "@carlos-burelo/klin";

/** Precio promedio del café frente a clientes por día en sucursales. */
export default function DensityContourPlotDemo() {
  return (
    <ChartTooltipPortal>
      <DensityContourPlot
        ariaLabel="Densidad de precio promedio frente a clientes por día en cafeterías; la mayor densidad está entre 45 y 55 pesos con 180 a 240 clientes"
        points={[
          { x: 48, y: 210, label: "Condesa" },
          { x: 52, y: 235, label: "Roma" },
          { x: 45, y: 190, label: "Del Valle" },
          { x: 55, y: 250, label: "Polanco" },
          { x: 50, y: 220, label: "Narvarte" },
          { x: 47, y: 185, label: "Coyoacán" },
          { x: 62, y: 310, label: "Santa Fe" },
          { x: 38, y: 140, label: "Doctores" },
          { x: 42, y: 165, label: "Portales" },
          { x: 58, y: 280, label: "Lomas" },
          { x: 51, y: 205, label: "Escandón" },
          { x: 46, y: 195, label: "Mixcoac" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
