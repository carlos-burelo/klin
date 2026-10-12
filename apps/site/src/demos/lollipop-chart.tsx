import { ChartTooltipPortal, LollipopChart } from "@carlos-burelo/klin";

const data: Array<Record<string, string | number>> = [
  { region: "Norte", ventas: 128 },
  { region: "Centro", ventas: 214 },
  { region: "Sur", ventas: 96 },
  { region: "Oriente", ventas: 167 },
  { region: "Poniente", ventas: 142 },
];

export default function LollipopChartDemo() {
  return (
    <ChartTooltipPortal>
      <LollipopChart
        data={data}
        xKey="region"
        yKey="ventas"
        ariaLabel="Ventas trimestrales por región en miles de piezas"
      />
    </ChartTooltipPortal>
  );
}
