/**
 * Demo Rangos del site (no se publica en el bundle de la lib).
 */
import {
  ChartTooltipPortal,
  RangeChart,
  type RangeGroup,
} from "@carlos-burelo/klin";

const groups: RangeGroup[] = [
  { label: "Ene", low: 6, high: 22, value: 14 },
  { label: "Feb", low: 7, high: 24, value: 16 },
  { label: "Mar", low: 9, high: 26, value: 18 },
  { label: "Abr", low: 10, high: 27, value: 19 },
  { label: "May", low: 11, high: 26, value: 18 },
  { label: "Jun", low: 10, high: 24, value: 17 },
];

export default function RangeChartDemo() {
  return (
    <ChartTooltipPortal>
      <RangeChart
        ariaLabel="Rango de temperatura mínima y máxima con promedio mensual en CDMX, con el rango más amplio en abril"
        groups={groups}
        formatY={(v: number) => `${v} °C`}
      />
    </ChartTooltipPortal>
  );
}
