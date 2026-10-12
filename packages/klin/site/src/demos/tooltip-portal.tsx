import type { ChartSeries } from "@carlos-burelo/klin";
import { BarChart, ChartTooltipPortal } from "@carlos-burelo/klin";

const data: Array<Record<string, string | number>> = [
  { dia: "Lun", asistentes: 84 },
  { dia: "Mar", asistentes: 112 },
  { dia: "Mié", asistentes: 96 },
  { dia: "Jue", asistentes: 130 },
];

const series: ChartSeries[] = [{ key: "asistentes", label: "Asistentes" }];

export default function TooltipPortalDemo() {
  return (
    <div>
      <ChartTooltipPortal>
        <BarChart
          data={data}
          xKey="dia"
          series={series}
          ariaLabel="Asistencia al módulo de trámites de lunes a jueves"
        />
      </ChartTooltipPortal>
      <p>
        Al pasar el cursor sobre cada barra aparece el tooltip del portal; sin
        JavaScript el navegador muestra el título nativo de la forma.
      </p>
    </div>
  );
}
