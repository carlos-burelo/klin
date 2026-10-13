import { BarChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function BarChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Una sola serie con formato de miles y sin leyenda"
        code={`import { BarChart } from "@carlos-burelo/klin";

const data = [
  { carrera: "Medicina", egresados: 320 },
  { carrera: "Derecho", egresados: 410 },
  { carrera: "Sistemas", egresados: 380 },
  { carrera: "Diseño", egresados: 190 },
];

<BarChart
  ariaLabel="Barras de egresados por carrera en miles"
  data={data}
  xKey="carrera"
  series={[{ key: "egresados", label: "Egresados" }]}
  formatY={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
  showLegend={false}
/>`}
      >
        <BarChart
          ariaLabel="Barras de egresados por carrera en miles"
          data={[
            { carrera: "Medicina", egresados: 320 },
            { carrera: "Derecho", egresados: 410 },
            { carrera: "Sistemas", egresados: 380 },
            { carrera: "Diseño", egresados: 190 },
          ]}
          xKey="carrera"
          series={[{ key: "egresados", label: "Egresados" }]}
          formatY={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Dos series agrupadas con leyenda"
        code={`import { BarChart } from "@carlos-burelo/klin";

const data = [
  { trimestre: "T1", linea: 420, tienda: 380 },
  { trimestre: "T2", linea: 510, tienda: 400 },
  { trimestre: "T3", linea: 480, tienda: 450 },
  { trimestre: "T4", linea: 620, tienda: 530 },
];

<BarChart
  ariaLabel="Barras agrupadas de ventas en línea y en tienda por trimestre"
  data={data}
  xKey="trimestre"
  series={[
    { key: "linea", label: "En línea" },
    { key: "tienda", label: "Tienda" },
  ]}
/>`}
      >
        <BarChart
          ariaLabel="Barras agrupadas de ventas en línea y en tienda por trimestre"
          data={[
            { trimestre: "T1", linea: 420, tienda: 380 },
            { trimestre: "T2", linea: 510, tienda: 400 },
            { trimestre: "T3", linea: 480, tienda: 450 },
            { trimestre: "T4", linea: 620, tienda: 530 },
          ]}
          xKey="trimestre"
          series={[
            { key: "linea", label: "En línea" },
            { key: "tienda", label: "Tienda" },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Valores con negativos y línea de meta anotada"
        code={`import { BarChart } from "@carlos-burelo/klin";

const data = [
  { mes: "Ene", utilidad: 60 },
  { mes: "Feb", utilidad: -25 },
  { mes: "Mar", utilidad: 45 },
  { mes: "Abr", utilidad: -10 },
  { mes: "May", utilidad: 80 },
];

<BarChart
  ariaLabel="Barras de utilidad mensual con meses en pérdida y meta de 50 mil"
  data={data}
  xKey="mes"
  series={[{ key: "utilidad", label: "Utilidad" }]}
  formatY={(v: number) => \`\${v} mil\`}
  annotations={[{ value: 50, label: "Meta" }]}
  showLegend={false}
/>`}
      >
        <BarChart
          ariaLabel="Barras de utilidad mensual con meses en pérdida y meta de 50 mil"
          data={[
            { mes: "Ene", utilidad: 60 },
            { mes: "Feb", utilidad: -25 },
            { mes: "Mar", utilidad: 45 },
            { mes: "Abr", utilidad: -10 },
            { mes: "May", utilidad: 80 },
          ]}
          xKey="mes"
          series={[{ key: "utilidad", label: "Utilidad" }]}
          formatY={(v: number) => `${v} mil`}
          annotations={[{ value: 50, label: "Meta" }]}
          showLegend={false}
        />
      </DemoExample>
    </div>
  );
}
