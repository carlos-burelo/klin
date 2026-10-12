import type { ChartSeries } from "@carlos-burelo/klin";
import { ChartTooltipPortal, VerticalStackedBar } from "@carlos-burelo/klin";

const data: Array<Record<string, string | number>> = [
  { trimestre: "T1", impuestos: 420, derechos: 180, participaciones: 260 },
  { trimestre: "T2", impuestos: 460, derechos: 195, participaciones: 275 },
  { trimestre: "T3", impuestos: 445, derechos: 210, participaciones: 290 },
  { trimestre: "T4", impuestos: 510, derechos: 230, participaciones: 310 },
];

const series: ChartSeries[] = [
  { key: "impuestos", label: "Impuestos" },
  { key: "derechos", label: "Derechos" },
  { key: "participaciones", label: "Participaciones" },
];

function formatY(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function VerticalStackedBarDemo() {
  return (
    <ChartTooltipPortal>
      <VerticalStackedBar
        data={data}
        xKey="trimestre"
        series={series}
        ariaLabel="Ingresos municipales trimestrales por fuente de financiamiento"
        formatY={formatY}
      />
    </ChartTooltipPortal>
  );
}
