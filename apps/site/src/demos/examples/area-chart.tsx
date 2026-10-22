import { AreaChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const dataHueco = [
  { mes: "Ene", visitas: 110 },
  { mes: "Feb", visitas: 135 },
  { mes: "Mar", visitas: Number.NaN },
  { mes: "Abr", visitas: 162 },
  { mes: "May", visitas: 175 },
];

const clavesArea = ["tienda", "linea", "mayoreo", "exportacion", "mercado"];

const estresArea: Array<Record<string, string | number>> = Array.from(
  { length: 60 },
  (_, i) => {
    const fila: Record<string, string | number> = { dia: `Día ${i + 1}` };
    clavesArea.forEach((k, s) => {
      fila[k] = Math.round(
        40 + 25 * Math.abs(Math.sin(i / 6 + s * 1.2)) + ((i * (s + 4)) % 8),
      );
    });
    return fila;
  },
);

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
      <DemoExample
        caption="Hueco de marzo unido sin caer a cero"
        code={`import { AreaChart } from "@carlos-burelo/klin";

const dataHueco = [
  { mes: "Ene", visitas: 110 },
  { mes: "Feb", visitas: 135 },
  { mes: "Mar", visitas: Number.NaN },
  { mes: "Abr", visitas: 162 },
  { mes: "May", visitas: 175 },
];

<AreaChart
  ariaLabel="Visitas mensuales con marzo sin dato y área continua"
  data={dataHueco}
  xKey="mes"
  series={[{ key: "visitas", label: "Visitas" }]}
  formatY={(v: number) => \`\${v} mil\`}
  connectNulls
  showLegend={false}
/>`}
      >
        <AreaChart
          ariaLabel="Visitas mensuales con marzo sin dato y área continua"
          data={dataHueco}
          xKey="mes"
          series={[{ key: "visitas", label: "Visitas" }]}
          formatY={(v: number) => `${v} mil`}
          connectNulls
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 5 canales apilados con 300 datos en 60 días"
        code={`import { AreaChart } from "@carlos-burelo/klin";

const clavesArea = ["tienda", "linea", "mayoreo", "exportacion", "mercado"];

const estresArea: Array<Record<string, string | number>> = Array.from(
  { length: 60 },
  (_, i) => {
    const fila: Record<string, string | number> = { dia: \`Día \${i + 1}\` };
    clavesArea.forEach((k, s) => {
      fila[k] = Math.round(
        40 + 25 * Math.abs(Math.sin(i / 6 + s * 1.2)) + ((i * (s + 4)) % 8),
      );
    });
    return fila;
  },
);

<AreaChart
  ariaLabel="Ventas diarias por canal en 60 días con cinco áreas apiladas"
  data={estresArea}
  xKey="dia"
  series={[
    { key: "tienda", label: "Tienda" },
    { key: "linea", label: "En línea" },
    { key: "mayoreo", label: "Mayoreo" },
    { key: "exportacion", label: "Exportación" },
    { key: "mercado", label: "Mercado" },
  ]}
  stacked
/>`}
      >
        <AreaChart
          ariaLabel="Ventas diarias por canal en 60 días con cinco áreas apiladas"
          data={estresArea}
          xKey="dia"
          series={[
            { key: "tienda", label: "Tienda" },
            { key: "linea", label: "En línea" },
            { key: "mayoreo", label: "Mayoreo" },
            { key: "exportacion", label: "Exportación" },
            { key: "mercado", label: "Mercado" },
          ]}
          stacked
        />
      </DemoExample>
    </div>
  );
}
