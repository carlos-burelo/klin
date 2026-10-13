import { HorizontalBarChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function HorizontalBarChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Una sola serie con formato de miles"
        code={`import { HorizontalBarChart } from "@carlos-burelo/klin";

const data = [
  { facultad: "Ingeniería", titulados: 1240 },
  { facultad: "Medicina", titulados: 980 },
  { facultad: "Derecho", titulados: 860 },
  { facultad: "Arquitectura", titulados: 540 },
];

<HorizontalBarChart
  ariaLabel="Barras horizontales de titulados por facultad"
  data={data}
  yKey="facultad"
  series={[{ key: "titulados", label: "Titulados" }]}
  formatX={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
  showLegend={false}
/>`}
      >
        <HorizontalBarChart
          ariaLabel="Barras horizontales de titulados por facultad"
          data={[
            { facultad: "Ingeniería", titulados: 1240 },
            { facultad: "Medicina", titulados: 980 },
            { facultad: "Derecho", titulados: 860 },
            { facultad: "Arquitectura", titulados: 540 },
          ]}
          yKey="facultad"
          series={[{ key: "titulados", label: "Titulados" }]}
          formatX={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Dos turnos comparados con leyenda"
        code={`import { HorizontalBarChart } from "@carlos-burelo/klin";

const data = [
  { matutino: 320, nivel: "Primaria", vespertino: 210 },
  { matutino: 280, nivel: "Secundaria", vespertino: 260 },
  { matutino: 190, nivel: "Preparatoria", vespertino: 230 },
  { matutino: 150, nivel: "Universidad", vespertino: 170 },
];

<HorizontalBarChart
  ariaLabel="Barras horizontales de matrícula por nivel en turno matutino y vespertino"
  data={data}
  yKey="nivel"
  series={[
    { key: "matutino", label: "Matutino" },
    { key: "vespertino", label: "Vespertino" },
  ]}
/>`}
      >
        <HorizontalBarChart
          ariaLabel="Barras horizontales de matrícula por nivel en turno matutino y vespertino"
          data={[
            { matutino: 320, nivel: "Primaria", vespertino: 210 },
            { matutino: 280, nivel: "Secundaria", vespertino: 260 },
            { matutino: 190, nivel: "Preparatoria", vespertino: 230 },
            { matutino: 150, nivel: "Universidad", vespertino: 170 },
          ]}
          yKey="nivel"
          series={[
            { key: "matutino", label: "Matutino" },
            { key: "vespertino", label: "Vespertino" },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Flujo con meses negativos y meta anotada, sin leyenda"
        code={`import { HorizontalBarChart } from "@carlos-burelo/klin";

const data = [
  { flujo: 55, mes: "Ene" },
  { flujo: -30, mes: "Feb" },
  { flujo: 42, mes: "Mar" },
  { flujo: -12, mes: "Abr" },
];

<HorizontalBarChart
  ariaLabel="Barras horizontales de flujo neto con meses en negativo y meta de 40 mil"
  data={data}
  yKey="mes"
  series={[{ key: "flujo", label: "Flujo neto" }]}
  formatX={(v: number) => \`\${v} mil\`}
  annotations={[{ value: 40, label: "Meta" }]}
  showLegend={false}
/>`}
      >
        <HorizontalBarChart
          ariaLabel="Barras horizontales de flujo neto con meses en negativo y meta de 40 mil"
          data={[
            { flujo: 55, mes: "Ene" },
            { flujo: -30, mes: "Feb" },
            { flujo: 42, mes: "Mar" },
            { flujo: -12, mes: "Abr" },
          ]}
          yKey="mes"
          series={[{ key: "flujo", label: "Flujo neto" }]}
          formatX={(v: number) => `${v} mil`}
          annotations={[{ value: 40, label: "Meta" }]}
          showLegend={false}
        />
      </DemoExample>
    </div>
  );
}
