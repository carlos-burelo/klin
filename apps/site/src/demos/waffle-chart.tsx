import type { WafflePart } from "@carlos-burelo/klin";
import { ChartTooltipPortal, WaffleChart } from "@carlos-burelo/klin";

const parts: WafflePart[] = [
  { label: "Nómina", value: 52 },
  { label: "Materiales", value: 18 },
  { label: "Servicios generales", value: 20 },
  { label: "Mantenimiento", value: 10 },
];

function format(value: number): string {
  return new Intl.NumberFormat("es-MX").format(Math.round(value));
}

export default function WaffleChartDemo() {
  return (
    <ChartTooltipPortal>
      <WaffleChart
        parts={parts}
        ariaLabel="Composición del gasto operativo en cien partes"
        format={format}
      />
    </ChartTooltipPortal>
  );
}
