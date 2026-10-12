import type { SunburstNode } from "@carlos-burelo/klin";
import { ChartTooltipPortal, SunburstChart } from "@carlos-burelo/klin";

const data: SunburstNode[] = [
  {
    label: "Servicios públicos",
    children: [
      { label: "Agua potable", value: 320 },
      { label: "Alumbrado", value: 180 },
      { label: "Limpia", value: 150 },
    ],
  },
  {
    label: "Obra pública",
    children: [
      { label: "Pavimentación", value: 410 },
      { label: "Parques", value: 120 },
      { label: "Drenaje", value: 260 },
    ],
  },
  {
    label: "Seguridad",
    children: [
      { label: "Patrullaje", value: 290 },
      { label: "Videovigilancia", value: 140 },
    ],
  },
];

function format(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SunburstChartDemo() {
  return (
    <ChartTooltipPortal>
      <SunburstChart
        data={data}
        ariaLabel="Distribución del presupuesto municipal por rubro y programa"
        format={format}
      />
    </ChartTooltipPortal>
  );
}
