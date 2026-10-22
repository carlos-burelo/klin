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
      <DemoExample
        caption="Máximo destacado con color propio por facultad"
        code={`import { HorizontalBarChart } from "@carlos-burelo/klin";

const data = [
  { facultad: "Ingeniería", titulados: 1240 },
  { facultad: "Medicina", titulados: 980 },
  { facultad: "Derecho", titulados: 860 },
  { facultad: "Arquitectura", titulados: 540 },
];

<HorizontalBarChart
  ariaLabel="Titulados por facultad con Ingeniería destacada como máximo"
  data={data}
  yKey="facultad"
  series={[{ key: "titulados", label: "Titulados" }]}
  formatX={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
  highlightMax
  barColor={(d) =>
    d.facultad === "Ingeniería" ? "var(--chart-1)" : "var(--chart-2)"
  }
  showLegend={false}
/>`}
      >
        <HorizontalBarChart
          ariaLabel="Titulados por facultad con Ingeniería destacada como máximo"
          data={[
            { facultad: "Ingeniería", titulados: 1240 },
            { facultad: "Medicina", titulados: 980 },
            { facultad: "Derecho", titulados: 860 },
            { facultad: "Arquitectura", titulados: 540 },
          ]}
          yKey="facultad"
          series={[{ key: "titulados", label: "Titulados" }]}
          formatX={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
          highlightMax
          barColor={(d) =>
            d.facultad === "Ingeniería" ? "var(--chart-1)" : "var(--chart-2)"
          }
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 20 dependencias con nombres largos y recortes en negativo"
        code={`import { HorizontalBarChart } from "@carlos-burelo/klin";

const data = [
  { dependencia: "Secretaría de Educación Pública del Estado", presupuesto: 420 },
  { dependencia: "Dirección General de Obras y Servicios Urbanos", presupuesto: -60 },
  { dependencia: "Coordinación Estatal de Protección Civil", presupuesto: 180 },
  { dependencia: "Instituto Municipal de Cultura y Bellas Artes", presupuesto: 95 },
  { dependencia: "Subsecretaría de Ingresos y Recaudación Fiscal", presupuesto: -25 },
  { dependencia: "Dirección de Parques Jardines y Espacios Públicos", presupuesto: 140 },
  { dependencia: "Jefatura de Alumbrado y Energía Comunitaria", presupuesto: 210 },
  { dependencia: "Coordinación de Salud Preventiva y Vacunación", presupuesto: -40 },
  { dependencia: "Dirección de Tránsito y Vialidad Municipal", presupuesto: 160 },
  { dependencia: "Instituto del Deporte y Recreación Juvenil", presupuesto: 80 },
  { dependencia: "Subdirección de Limpieza y Residuos Sólidos", presupuesto: 190 },
  { dependencia: "Dirección de Catastro y Regularización Territorial", presupuesto: -15 },
  { dependencia: "Coordinación de Atención a Personas Adultas Mayores", presupuesto: 120 },
  { dependencia: "Jefatura de Mercados Tianguis y Comercio Ambulante", presupuesto: 75 },
  { dependencia: "Dirección de Ecología y Medio Ambiente Urbano", presupuesto: -30 },
  { dependencia: "Subsecretaría de Egresos y Control Presupuestal", presupuesto: 260 },
  { dependencia: "Instituto de la Juventud y Emprendimiento Local", presupuesto: 65 },
  { dependencia: "Coordinación de Bibliotecas y Fomento a la Lectura", presupuesto: 110 },
  { dependencia: "Dirección de Agua Potable y Alcantarillado", presupuesto: -45 },
  { dependencia: "Jefatura de Panteones y Servicios Funerarios", presupuesto: 55 },
];

<HorizontalBarChart
  ariaLabel="Presupuesto por dependencia con nombres largos y recortes en negativo"
  data={data}
  yKey="dependencia"
  series={[{ key: "presupuesto", label: "Presupuesto" }]}
  formatX={(v: number) => \`\${v} mdp\`}
  showLegend={false}
/>`}
      >
        <HorizontalBarChart
          ariaLabel="Presupuesto por dependencia con nombres largos y recortes en negativo"
          data={[
            {
              dependencia: "Secretaría de Educación Pública del Estado",
              presupuesto: 420,
            },
            {
              dependencia: "Dirección General de Obras y Servicios Urbanos",
              presupuesto: -60,
            },
            {
              dependencia: "Coordinación Estatal de Protección Civil",
              presupuesto: 180,
            },
            {
              dependencia: "Instituto Municipal de Cultura y Bellas Artes",
              presupuesto: 95,
            },
            {
              dependencia: "Subsecretaría de Ingresos y Recaudación Fiscal",
              presupuesto: -25,
            },
            {
              dependencia: "Dirección de Parques Jardines y Espacios Públicos",
              presupuesto: 140,
            },
            {
              dependencia: "Jefatura de Alumbrado y Energía Comunitaria",
              presupuesto: 210,
            },
            {
              dependencia: "Coordinación de Salud Preventiva y Vacunación",
              presupuesto: -40,
            },
            {
              dependencia: "Dirección de Tránsito y Vialidad Municipal",
              presupuesto: 160,
            },
            {
              dependencia: "Instituto del Deporte y Recreación Juvenil",
              presupuesto: 80,
            },
            {
              dependencia: "Subdirección de Limpieza y Residuos Sólidos",
              presupuesto: 190,
            },
            {
              dependencia: "Dirección de Catastro y Regularización Territorial",
              presupuesto: -15,
            },
            {
              dependencia:
                "Coordinación de Atención a Personas Adultas Mayores",
              presupuesto: 120,
            },
            {
              dependencia: "Jefatura de Mercados Tianguis y Comercio Ambulante",
              presupuesto: 75,
            },
            {
              dependencia: "Dirección de Ecología y Medio Ambiente Urbano",
              presupuesto: -30,
            },
            {
              dependencia: "Subsecretaría de Egresos y Control Presupuestal",
              presupuesto: 260,
            },
            {
              dependencia: "Instituto de la Juventud y Emprendimiento Local",
              presupuesto: 65,
            },
            {
              dependencia: "Coordinación de Bibliotecas y Fomento a la Lectura",
              presupuesto: 110,
            },
            {
              dependencia: "Dirección de Agua Potable y Alcantarillado",
              presupuesto: -45,
            },
            {
              dependencia: "Jefatura de Panteones y Servicios Funerarios",
              presupuesto: 55,
            },
          ]}
          yKey="dependencia"
          series={[{ key: "presupuesto", label: "Presupuesto" }]}
          formatX={(v: number) => `${v} mdp`}
          showLegend={false}
        />
      </DemoExample>
    </div>
  );
}
