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
      <DemoExample
        caption="Etiquetas visibles con formato propio distinto del eje"
        code={`import { BarChart } from "@carlos-burelo/klin";

const data = [
  { mes: "Ene", utilidad: 60 },
  { mes: "Feb", utilidad: 45 },
  { mes: "Mar", utilidad: 80 },
];

<BarChart
  ariaLabel="Barras con etiquetas de valor visibles y formato propio"
  data={data}
  xKey="mes"
  series={[{ key: "utilidad", label: "Utilidad" }]}
  formatY={(v: number) => \`\${v} mil\`}
  formatValues={(v: number) => \`\${v}k\`}
  showValues
  showLegend={false}
/>`}
      >
        <BarChart
          ariaLabel="Barras con etiquetas de valor visibles y formato propio"
          data={[
            { mes: "Ene", utilidad: 60 },
            { mes: "Feb", utilidad: 45 },
            { mes: "Mar", utilidad: 80 },
          ]}
          xKey="mes"
          series={[{ key: "utilidad", label: "Utilidad" }]}
          formatY={(v: number) => `${v} mil`}
          formatValues={(v: number) => `${v}k`}
          showValues
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 24 categorías con nombres largos y valores negativos mezclados"
        code={`import { BarChart } from "@carlos-burelo/klin";

const data = [
  { programa: "Ingeniería en Sistemas Computacionales", inscritos: 320 },
  { programa: "Licenciatura en Administración de Empresas", inscritos: -40 },
  { programa: "Medicina Veterinaria y Zootecnia", inscritos: 410 },
  { programa: "Arquitectura y Diseño de Interiores", inscritos: 180 },
  { programa: "Contaduría Pública y Finanzas", inscritos: -25 },
  { programa: "Derecho Corporativo Internacional", inscritos: 260 },
  { programa: "Psicología Organizacional", inscritos: 390 },
  { programa: "Ingeniería en Energías Renovables", inscritos: -60 },
  { programa: "Gastronomía y Administración Culinaria", inscritos: 150 },
  { programa: "Comunicación y Medios Digitales", inscritos: 440 },
  { programa: "Enfermería y Salud Comunitaria", inscritos: 210 },
  { programa: "Mercadotecnia y Negocios Digitales", inscritos: -15 },
  { programa: "Ingeniería Civil y Construcción", inscritos: 380 },
  { programa: "Diseño Gráfico y Animación", inscritos: 290 },
  { programa: "Educación Primaria Intercultural", inscritos: -35 },
  { programa: "Biología Marina y Acuacultura", inscritos: 120 },
  { programa: "Turismo Sustentable y Hotelería", inscritos: 340 },
  { programa: "Física Aplicada a la Ingeniería", inscritos: 260 },
  { programa: "Química Farmacéutica Biológica", inscritos: -50 },
  { programa: "Sociología Urbana y Rural", inscritos: 190 },
  { programa: "Economía del Desarrollo Regional", inscritos: 310 },
  { programa: "Filosofía y Letras Hispánicas", inscritos: 140 },
  { programa: "Música y Producción Sonora", inscritos: -20 },
  { programa: "Teatro y Artes Escénicas", inscritos: 230 },
];

<BarChart
  ariaLabel="Inscritos por programa con nombres largos y bajas netas en negativo"
  data={data}
  xKey="programa"
  series={[{ key: "inscritos", label: "Inscritos" }]}
  barRadius={0}
  showLegend={false}
/>`}
      >
        <BarChart
          ariaLabel="Inscritos por programa con nombres largos y bajas netas en negativo"
          data={[
            {
              programa: "Ingeniería en Sistemas Computacionales",
              inscritos: 320,
            },
            {
              programa: "Licenciatura en Administración de Empresas",
              inscritos: -40,
            },
            { programa: "Medicina Veterinaria y Zootecnia", inscritos: 410 },
            { programa: "Arquitectura y Diseño de Interiores", inscritos: 180 },
            { programa: "Contaduría Pública y Finanzas", inscritos: -25 },
            { programa: "Derecho Corporativo Internacional", inscritos: 260 },
            { programa: "Psicología Organizacional", inscritos: 390 },
            { programa: "Ingeniería en Energías Renovables", inscritos: -60 },
            {
              programa: "Gastronomía y Administración Culinaria",
              inscritos: 150,
            },
            { programa: "Comunicación y Medios Digitales", inscritos: 440 },
            { programa: "Enfermería y Salud Comunitaria", inscritos: 210 },
            { programa: "Mercadotecnia y Negocios Digitales", inscritos: -15 },
            { programa: "Ingeniería Civil y Construcción", inscritos: 380 },
            { programa: "Diseño Gráfico y Animación", inscritos: 290 },
            { programa: "Educación Primaria Intercultural", inscritos: -35 },
            { programa: "Biología Marina y Acuacultura", inscritos: 120 },
            { programa: "Turismo Sustentable y Hotelería", inscritos: 340 },
            { programa: "Física Aplicada a la Ingeniería", inscritos: 260 },
            { programa: "Química Farmacéutica Biológica", inscritos: -50 },
            { programa: "Sociología Urbana y Rural", inscritos: 190 },
            { programa: "Economía del Desarrollo Regional", inscritos: 310 },
            { programa: "Filosofía y Letras Hispánicas", inscritos: 140 },
            { programa: "Música y Producción Sonora", inscritos: -20 },
            { programa: "Teatro y Artes Escénicas", inscritos: 230 },
          ]}
          xKey="programa"
          series={[{ key: "inscritos", label: "Inscritos" }]}
          barRadius={0}
          showLegend={false}
        />
      </DemoExample>
    </div>
  );
}
