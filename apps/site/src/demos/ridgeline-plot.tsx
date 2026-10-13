/**
 * Demo Crestas del site (no se publica en el bundle de la lib).
 */
import {
  ChartTooltipPortal,
  RidgelinePlot,
  type RidgelineSeries,
} from "@carlos-burelo/klin";

const series: RidgelineSeries[] = [
  { label: "Primavera", values: [19, 22, 24, 21, 25, 23, 20, 26, 22, 24] },
  { label: "Verano", values: [17, 20, 22, 19, 23, 21, 18, 24, 20, 22] },
  { label: "Otoño", values: [15, 18, 20, 17, 21, 19, 16, 22, 18, 20] },
  { label: "Invierno", values: [9, 12, 15, 11, 17, 14, 10, 19, 13, 16] },
];

export default function RidgelinePlotDemo() {
  return (
    <ChartTooltipPortal>
      <RidgelinePlot
        ariaLabel="Distribución de temperaturas diarias por estación en CDMX, con el pico más cálido en primavera"
        series={series}
        formatX={(v: number) => `${v} °C`}
      />
    </ChartTooltipPortal>
  );
}
