import type { NightingaleDatum } from "@carlos-burelo/klin";
import { ChartTooltipPortal, NightingaleChart } from "@carlos-burelo/klin";

const data: NightingaleDatum[] = [
  { label: "Ene", value: 8 },
  { label: "Feb", value: 10 },
  { label: "Mar", value: 18 },
  { label: "Abr", value: 45 },
  { label: "May", value: 110 },
  { label: "Jun", value: 210 },
  { label: "Jul", value: 230 },
  { label: "Ago", value: 220 },
  { label: "Sep", value: 190 },
  { label: "Oct", value: 80 },
  { label: "Nov", value: 20 },
  { label: "Dic", value: 8 },
];

export default function NightingaleChartDemo() {
  return (
    <ChartTooltipPortal>
      <NightingaleChart
        data={data}
        format={(v: number) => `${v} mm`}
        ariaLabel="Lluvia mensual en CDMX en milímetros: se concentra de junio a septiembre con pico en julio y estiaje en invierno"
      />
    </ChartTooltipPortal>
  );
}
