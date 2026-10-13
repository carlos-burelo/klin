import { AreaChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function AreaChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Una sola serie con línea de meta anotada y sin leyenda"
        code={`import { AreaChart } from "@carlos-burelo/klin";

const data = [
  { mes: "Ene", visitas: 110 },
  { mes: "Feb", visitas: 135 },
  { mes: "Mar", visitas: 148 },
  { mes: "Abr", visitas: 162 },
  { mes: "May", visitas: 175 },
];

<AreaChart
  ariaLabel="Área de visitas mensuales del blog con meta de 150 mil"
  data={data}
  xKey="mes"
  series={[{ key: "visitas", label: "Visitas" }]}
  formatY={(v: number) => \`\${v} mil\`}
  annotations={[{ value: 150, label: "Meta" }]}
  showLegend={false}
/>`}
      >
        <AreaChart
          ariaLabel="Área de visitas mensuales del blog con meta de 150 mil"
          data={[
            { mes: "Ene", visitas: 110 },
            { mes: "Feb", visitas: 135 },
            { mes: "Mar", visitas: 148 },
            { mes: "Abr", visitas: 162 },
            { mes: "May", visitas: 175 },
          ]}
          xKey="mes"
          series={[{ key: "visitas", label: "Visitas" }]}
          formatY={(v: number) => `${v} mil`}
          annotations={[{ value: 150, label: "Meta" }]}
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Dos series apiladas en valores absolutos"
        code={`import { AreaChart } from "@carlos-burelo/klin";

const data = [
  { mes: "Ene", tienda: 120, linea: 80 },
  { mes: "Feb", tienda: 135, linea: 95 },
  { mes: "Mar", tienda: 128, linea: 110 },
  { mes: "Abr", tienda: 150, linea: 125 },
];

<AreaChart
  ariaLabel="Áreas apiladas de ventas en tienda y en línea de enero a abril"
  data={data}
  xKey="mes"
  series={[
    { key: "tienda", label: "Tienda" },
    { key: "linea", label: "En línea" },
  ]}
  stacked
/>`}
      >
        <AreaChart
          ariaLabel="Áreas apiladas de ventas en tienda y en línea de enero a abril"
          data={[
            { mes: "Ene", tienda: 120, linea: 80 },
            { mes: "Feb", tienda: 135, linea: 95 },
            { mes: "Mar", tienda: 128, linea: 110 },
            { mes: "Abr", tienda: 150, linea: 125 },
          ]}
          xKey="mes"
          series={[
            { key: "tienda", label: "Tienda" },
            { key: "linea", label: "En línea" },
          ]}
          stacked
        />
      </DemoExample>
      <DemoExample
        caption="Modo 100 % normalizado con formato de porcentaje"
        code={`import { AreaChart } from "@carlos-burelo/klin";

const data = [
  { mes: "Ene", solar: 40, eolica: 60 },
  { mes: "Feb", solar: 55, eolica: 45 },
  { mes: "Mar", solar: 65, eolica: 55 },
  { mes: "Abr", solar: 70, eolica: 50 },
];

<AreaChart
  ariaLabel="Participación porcentual de energía solar y eólica de enero a abril"
  data={data}
  xKey="mes"
  series={[
    { key: "solar", label: "Solar" },
    { key: "eolica", label: "Eólica" },
  ]}
  stacked
  normalize
  formatY={(v: number) => \`\${Math.round(v)} %\`}
/>`}
      >
        <AreaChart
          ariaLabel="Participación porcentual de energía solar y eólica de enero a abril"
          data={[
            { mes: "Ene", solar: 40, eolica: 60 },
            { mes: "Feb", solar: 55, eolica: 45 },
            { mes: "Mar", solar: 65, eolica: 55 },
            { mes: "Abr", solar: 70, eolica: 50 },
          ]}
          xKey="mes"
          series={[
            { key: "solar", label: "Solar" },
            { key: "eolica", label: "Eólica" },
          ]}
          stacked
          normalize
          formatY={(v: number) => `${Math.round(v)} %`}
        />
      </DemoExample>
    </div>
  );
}
