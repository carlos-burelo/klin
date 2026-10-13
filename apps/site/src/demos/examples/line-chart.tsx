import { LineChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function LineChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Una sola serie suavizada sin leyenda"
        code={`import { LineChart } from "@carlos-burelo/klin";

const data = [
  { dia: "Lun", temp: 21 },
  { dia: "Mar", temp: 23 },
  { dia: "Mié", temp: 22 },
  { dia: "Jue", temp: 25 },
  { dia: "Vie", temp: 27 },
  { dia: "Sáb", temp: 26 },
];

<LineChart
  ariaLabel="Línea suavizada de temperatura semanal en grados"
  data={data}
  xKey="dia"
  series={[{ key: "temp", label: "Temperatura" }]}
  curve="monotone"
  formatY={(v: number) => \`\${v} °C\`}
  showLegend={false}
/>`}
      >
        <LineChart
          ariaLabel="Línea suavizada de temperatura semanal en grados"
          data={[
            { dia: "Lun", temp: 21 },
            { dia: "Mar", temp: 23 },
            { dia: "Mié", temp: 22 },
            { dia: "Jue", temp: 25 },
            { dia: "Vie", temp: 27 },
            { dia: "Sáb", temp: 26 },
          ]}
          xKey="dia"
          series={[{ key: "temp", label: "Temperatura" }]}
          curve="monotone"
          formatY={(v: number) => `${v} °C`}
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Dos series rectas con leyenda"
        code={`import { LineChart } from "@carlos-burelo/klin";

const data = [
  { mes: "Ene", visitas: 1240, pedidos: 320 },
  { mes: "Feb", visitas: 1480, pedidos: 385 },
  { mes: "Mar", visitas: 1390, pedidos: 350 },
  { mes: "Abr", visitas: 1720, pedidos: 460 },
  { mes: "May", visitas: 1980, pedidos: 540 },
];

<LineChart
  ariaLabel="Líneas rectas de visitas y pedidos por mes"
  data={data}
  xKey="mes"
  series={[
    { key: "visitas", label: "Visitas" },
    { key: "pedidos", label: "Pedidos" },
  ]}
  curve="linear"
/>`}
      >
        <LineChart
          ariaLabel="Líneas rectas de visitas y pedidos por mes"
          data={[
            { mes: "Ene", visitas: 1240, pedidos: 320 },
            { mes: "Feb", visitas: 1480, pedidos: 385 },
            { mes: "Mar", visitas: 1390, pedidos: 350 },
            { mes: "Abr", visitas: 1720, pedidos: 460 },
            { mes: "May", visitas: 1980, pedidos: 540 },
          ]}
          xKey="mes"
          series={[
            { key: "visitas", label: "Visitas" },
            { key: "pedidos", label: "Pedidos" },
          ]}
          curve="linear"
        />
      </DemoExample>
      <DemoExample
        caption="Nivel escalonado con capacidad anotada"
        code={`import { LineChart } from "@carlos-burelo/klin";

const data = [
  { mes: "Ene", nivel: 62 },
  { mes: "Feb", nivel: 68 },
  { mes: "Mar", nivel: 75 },
  { mes: "Abr", nivel: 81 },
  { mes: "May", nivel: 88 },
];

<LineChart
  ariaLabel="Línea escalonada del nivel de la presa con capacidad anotada"
  data={data}
  xKey="mes"
  series={[{ key: "nivel", label: "Nivel" }]}
  curve="step"
  formatY={(v: number) => \`\${v} %\`}
  annotations={[{ value: 90, label: "Capacidad" }]}
  showLegend={false}
/>`}
      >
        <LineChart
          ariaLabel="Línea escalonada del nivel de la presa con capacidad anotada"
          data={[
            { mes: "Ene", nivel: 62 },
            { mes: "Feb", nivel: 68 },
            { mes: "Mar", nivel: 75 },
            { mes: "Abr", nivel: 81 },
            { mes: "May", nivel: 88 },
          ]}
          xKey="mes"
          series={[{ key: "nivel", label: "Nivel" }]}
          curve="step"
          formatY={(v: number) => `${v} %`}
          annotations={[{ value: 90, label: "Capacidad" }]}
          showLegend={false}
        />
      </DemoExample>
    </div>
  );
}
