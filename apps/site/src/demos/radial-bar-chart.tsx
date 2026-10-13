import type { RadialBarDatum } from "@carlos-burelo/klin";
import { ChartTooltipPortal, RadialBarChart } from "@carlos-burelo/klin";

const series: RadialBarDatum[] = [
  { label: "SRP", value: 91, max: 95 },
  { label: "Tétanos", value: 88, max: 95 },
  { label: "VPH", value: 82, max: 95 },
  { label: "Influenza", value: 78, max: 95 },
  { label: "COVID refuerzo", value: 64, max: 95 },
];

export default function RadialBarChartDemo() {
  return (
    <ChartTooltipPortal>
      <RadialBarChart
        series={series}
        formatValue={(v: number) => `${v}%`}
        ariaLabel="Cobertura de vacunación por biológico frente a la meta de 95%: ninguna la alcanza y el refuerzo COVID es el más rezagado"
      />
    </ChartTooltipPortal>
  );
}
