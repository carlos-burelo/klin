import { ChartTooltipPortal, DotPlot } from "@carlos-burelo/klin";

export default function DotPlotDemo() {
  return (
    <ChartTooltipPortal>
      <DotPlot
        ariaLabel="Tiempo promedio de traslado al trabajo por ciudad en minutos, la CDMX lidera con 58 y Mérida es la más rápida con 30"
        data={[
          { ciudad: "CDMX", minutos: 58 },
          { ciudad: "Monterrey", minutos: 45 },
          { ciudad: "Guadalajara", minutos: 42 },
          { ciudad: "Tijuana", minutos: 40 },
          { ciudad: "Puebla", minutos: 38 },
          { ciudad: "León", minutos: 35 },
          { ciudad: "Mérida", minutos: 30 },
        ]}
        categoryKey="ciudad"
        valueKey="minutos"
        format={(v: number) => `${v} min`}
      />
    </ChartTooltipPortal>
  );
}
