import type { ChartSeries } from "@carlos-burelo/klin";
import { ChartTooltipPortal, LineChart } from "@carlos-burelo/klin";

const data: Array<Record<string, string | number>> = [
  { mes: "Ene", visitas: 1240, pedidos: 320 },
  { mes: "Feb", visitas: 1480, pedidos: 385 },
  { mes: "Mar", visitas: 1390, pedidos: 350 },
  { mes: "Abr", visitas: 1720, pedidos: 460 },
  { mes: "May", visitas: 1980, pedidos: 540 },
  { mes: "Jun", visitas: 2140, pedidos: 610 },
];

const series: ChartSeries[] = [
  { key: "visitas", label: "Visitas" },
  { key: "pedidos", label: "Pedidos" },
];

export default function LineChartDemo() {
  return (
    <ChartTooltipPortal>
      <LineChart
        data={data}
        xKey="mes"
        series={series}
        ariaLabel="Evolución semestral de visitas y pedidos de la tienda"
      />
    </ChartTooltipPortal>
  );
}
