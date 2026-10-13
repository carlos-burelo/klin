import type { ChartSeries } from "@carlos-burelo/klin";
import { VerticalStackedBar } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const series: ChartSeries[] = [
  { key: "aprobado", label: "Aprobado" },
  { key: "curso", label: "En curso" },
  { key: "pendiente", label: "Pendiente" },
];

const datos: Array<Record<string, string | number>> = [
  { nivel: "Primaria", aprobado: 70, curso: 20, pendiente: 10 },
  { nivel: "Secundaria", aprobado: 45, curso: 35, pendiente: 20 },
  { nivel: "Prepa", aprobado: 30, curso: 25, pendiente: 45 },
];

const conNegativos: Array<Record<string, string | number>> = [
  { mes: "Ene", aprobado: 50, curso: 20, pendiente: -8 },
  { mes: "Feb", aprobado: 40, curso: -12, pendiente: 15 },
  { mes: "Mar", aprobado: 55, curso: 25, pendiente: 10 },
];

export default function VerticalStackedBarExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="apilado clásico con leyenda"
        code={`import type { ChartSeries } from "@carlos-burelo/klin";
import { VerticalStackedBar } from "@carlos-burelo/klin";

const series: ChartSeries[] = [
  { key: "aprobado", label: "Aprobado" },
  { key: "curso", label: "En curso" },
  { key: "pendiente", label: "Pendiente" },
];

const datos: Array<Record<string, string | number>> = [
  { nivel: "Primaria", aprobado: 70, curso: 20, pendiente: 10 },
  { nivel: "Secundaria", aprobado: 45, curso: 35, pendiente: 20 },
  { nivel: "Prepa", aprobado: 30, curso: 25, pendiente: 45 },
];

<VerticalStackedBar
  data={datos}
  xKey="nivel"
  series={series}
  ariaLabel="Avance de obra por nivel educativo"
/>`}
      >
        <VerticalStackedBar
          data={datos}
          xKey="nivel"
          series={series}
          ariaLabel="Avance de obra por nivel educativo"
        />
      </DemoExample>
      <DemoExample
        caption="modo 100 por ciento sin leyenda"
        code={`import type { ChartSeries } from "@carlos-burelo/klin";
import { VerticalStackedBar } from "@carlos-burelo/klin";

const series: ChartSeries[] = [
  { key: "aprobado", label: "Aprobado" },
  { key: "curso", label: "En curso" },
  { key: "pendiente", label: "Pendiente" },
];

const datos: Array<Record<string, string | number>> = [
  { nivel: "Primaria", aprobado: 70, curso: 20, pendiente: 10 },
  { nivel: "Secundaria", aprobado: 45, curso: 35, pendiente: 20 },
  { nivel: "Prepa", aprobado: 30, curso: 25, pendiente: 45 },
];

<VerticalStackedBar
  data={datos}
  xKey="nivel"
  series={series}
  normalize
  showLegend={false}
  ariaLabel="Avance de obra por nivel en porcentaje del grupo"
/>`}
      >
        <VerticalStackedBar
          data={datos}
          xKey="nivel"
          series={series}
          normalize
          showLegend={false}
          ariaLabel="Avance de obra por nivel en porcentaje del grupo"
        />
      </DemoExample>
      <DemoExample
        caption="con negativos y línea de anotación"
        code={`import type { ChartSeries } from "@carlos-burelo/klin";
import { VerticalStackedBar } from "@carlos-burelo/klin";

const series: ChartSeries[] = [
  { key: "aprobado", label: "Aprobado" },
  { key: "curso", label: "En curso" },
  { key: "pendiente", label: "Pendiente" },
];

const conNegativos: Array<Record<string, string | number>> = [
  { mes: "Ene", aprobado: 50, curso: 20, pendiente: -8 },
  { mes: "Feb", aprobado: 40, curso: -12, pendiente: 15 },
  { mes: "Mar", aprobado: 55, curso: 25, pendiente: 10 },
];

<VerticalStackedBar
  data={conNegativos}
  xKey="mes"
  series={series}
  annotations={[{ value: 60, label: "Meta 60" }]}
  ariaLabel="Avance mensual con ajustes negativos y meta en 60"
/>`}
      >
        <VerticalStackedBar
          data={conNegativos}
          xKey="mes"
          series={series}
          annotations={[{ value: 60, label: "Meta 60" }]}
          ariaLabel="Avance mensual con ajustes negativos y meta en 60"
        />
      </DemoExample>
    </div>
  );
}
