/**
 * Demo Histograma del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, Histogram } from "@carlos-burelo/klin";

export default function HistogramDemo() {
  return (
    <ChartTooltipPortal>
      <Histogram
        ariaLabel="Histograma de edades de asistentes"
        bins={8}
        values={[
          18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
          36, 38, 40, 42, 45, 48, 52,
        ]}
      />
    </ChartTooltipPortal>
  );
}
