import type { SlopeDatum } from "@carlos-burelo/klin";
import { ChartTooltipPortal, SlopeChart } from "@carlos-burelo/klin";

const data: SlopeDatum[] = [
  { label: "Chiapas", from: 34, to: 58 },
  { label: "Oaxaca", from: 38, to: 62 },
  { label: "Yucatán", from: 52, to: 71 },
  { label: "Jalisco", from: 61, to: 78 },
  { label: "Nuevo León", from: 72, to: 84 },
  { label: "CDMX", from: 78, to: 89 },
];

export default function SlopeChartDemo() {
  return (
    <ChartTooltipPortal>
      <SlopeChart
        data={data}
        fromLabel="2020"
        toLabel="2025"
        formatY={(v: number) => `${v}%`}
        ariaLabel="Hogares con internet por estado entre 2020 y 2025: todos suben y Chiapas y Oaxaca recortan la brecha, pero CDMX sigue líder"
      />
    </ChartTooltipPortal>
  );
}
