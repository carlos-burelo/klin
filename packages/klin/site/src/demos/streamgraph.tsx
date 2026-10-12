import type { ChartSeries } from "@carlos-burelo/klin";
import { ChartTooltipPortal, Streamgraph } from "@carlos-burelo/klin";

const data: Array<Record<string, string | number>> = [
  { mes: "Ene", residencial: 42, comercial: 31, industrial: 58 },
  { mes: "Feb", residencial: 38, comercial: 29, industrial: 61 },
  { mes: "Mar", residencial: 45, comercial: 34, industrial: 66 },
  { mes: "Abr", residencial: 51, comercial: 39, industrial: 63 },
  { mes: "May", residencial: 57, comercial: 44, industrial: 59 },
  { mes: "Jun", residencial: 62, comercial: 47, industrial: 55 },
];

const series: ChartSeries[] = [
  { key: "residencial", label: "Residencial" },
  { key: "comercial", label: "Comercial" },
  { key: "industrial", label: "Industrial" },
];

function formatY(value: number): string {
  return `${new Intl.NumberFormat("es-MX").format(Math.round(value))} GWh`;
}

export default function StreamgraphDemo() {
  return (
    <ChartTooltipPortal>
      <Streamgraph
        data={data}
        xKey="mes"
        series={series}
        ariaLabel="Consumo eléctrico mensual por sector de enero a junio"
        formatY={formatY}
      />
    </ChartTooltipPortal>
  );
}
