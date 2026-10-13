import type { ChartSeries, DonutDatum } from "@carlos-burelo/klin";
import { BarChart, ChartTooltipPortal, DonutChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const asistenciaData: Array<Record<string, string | number>> = [
  { dia: "Lun", asistentes: 84 },
  { dia: "Mar", asistentes: 112 },
  { dia: "Mié", asistentes: 96 },
  { dia: "Jue", asistentes: 130 },
];

const asistenciaSeries: ChartSeries[] = [
  { key: "asistentes", label: "Asistentes" },
];

const matriculaData: DonutDatum[] = [
  { label: "Jalisco", value: 320 },
  { label: "Nuevo León", value: 280 },
  { label: "Puebla", value: 190 },
];

export default function TooltipPortalExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="portal sobre gráfica de barras con desplazamiento por defecto"
        code={`import { BarChart, ChartTooltipPortal } from "@carlos-burelo/klin";

const data = [
  { dia: "Lun", asistentes: 84 },
  { dia: "Mar", asistentes: 112 },
  { dia: "Mié", asistentes: 96 },
  { dia: "Jue", asistentes: 130 },
];

const series = [{ key: "asistentes", label: "Asistentes" }];

<ChartTooltipPortal>
  <BarChart
    data={data}
    xKey="dia"
    series={series}
    ariaLabel="Asistencia al módulo de trámites de lunes a jueves"
  />
</ChartTooltipPortal>`}
      >
        <ChartTooltipPortal>
          <BarChart
            data={asistenciaData}
            xKey="dia"
            series={asistenciaSeries}
            ariaLabel="Asistencia al módulo de trámites de lunes a jueves"
          />
        </ChartTooltipPortal>
      </DemoExample>
      <DemoExample
        caption="portal sobre dona con desplazamiento amplio"
        code={`import { ChartTooltipPortal, DonutChart } from "@carlos-burelo/klin";

const data = [
  { label: "Jalisco", value: 320 },
  { label: "Nuevo León", value: 280 },
  { label: "Puebla", value: 190 },
];

<ChartTooltipPortal offset={24}>
  <DonutChart
    data={data}
    ariaLabel="Dona de matrícula por estado con tooltip de portal"
    totalLabel="Alumnos"
  />
</ChartTooltipPortal>`}
      >
        <ChartTooltipPortal offset={24}>
          <DonutChart
            data={matriculaData}
            ariaLabel="Dona de matrícula por estado con tooltip de portal"
            totalLabel="Alumnos"
          />
        </ChartTooltipPortal>
      </DemoExample>
    </div>
  );
}
