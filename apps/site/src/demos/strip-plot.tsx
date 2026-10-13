/**
 * Demo Tira de puntos del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, StripPlot } from "@carlos-burelo/klin";

export default function StripPlotDemo() {
  return (
    <ChartTooltipPortal>
      <StripPlot
        ariaLabel="Tira de tiempos de respuesta por región en milisegundos"
        groups={[
          { label: "Norte", values: [42, 55, 48, 61, 39, 52, 47] },
          { label: "Centro", values: [88, 95, 76, 102, 91] },
          { label: "Sur", values: [120, 135, 110, 142, 128, 118] },
        ]}
      />
    </ChartTooltipPortal>
  );
}
