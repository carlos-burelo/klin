import type { CirclePackNode } from "@carlos-burelo/klin";
import { ChartTooltipPortal, CirclePackChart } from "@carlos-burelo/klin";

const root: CirclePackNode = {
  label: "Valle de México",
  children: [
    {
      label: "CDMX",
      children: [
        { label: "Iztapalapa", value: 1830000 },
        { label: "Gustavo A. Madero", value: 1160000 },
        { label: "Coyoacán", value: 610000 },
      ],
    },
    {
      label: "Edomex",
      children: [
        { label: "Ecatepec", value: 1650000 },
        { label: "Nezahualcóyotl", value: 1070000 },
        { label: "Naucalpan", value: 834000 },
      ],
    },
  ],
};

function format(value: number): string {
  return `${new Intl.NumberFormat("es-MX").format(Math.round(value))} hab.`;
}

export default function CirclePackChartDemo() {
  return (
    <ChartTooltipPortal>
      <CirclePackChart
        root={root}
        format={format}
        ariaLabel="Población por municipio del Valle de México: Iztapalapa y Ecatepec concentran la mayor población y Coyoacán es el más pequeño"
      />
    </ChartTooltipPortal>
  );
}
