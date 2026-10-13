import type { SunburstNode } from "@carlos-burelo/klin";
import { SunburstChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const matricula: SunburstNode[] = [
  {
    label: "Primaria",
    children: [
      { label: "Primero", value: 120 },
      { label: "Segundo", value: 110 },
      { label: "Tercero", value: 95 },
    ],
  },
  {
    label: "Secundaria",
    children: [
      { label: "Primero", value: 80 },
      { label: "Segundo", value: 70 },
    ],
  },
];

const gasto: SunburstNode[] = [
  {
    label: "Nómina",
    children: [
      { label: "Docentes", value: 3_200_000 },
      {
        label: "Apoyo",
        value: 1_000_000,
        children: [
          { label: "Limpieza", value: 400_000 },
          { label: "Vigilancia", value: 600_000 },
        ],
      },
    ],
  },
  {
    label: "Obra",
    children: [
      { label: "Aulas", value: 900_000 },
      { label: "Patio", value: 500_000 },
    ],
  },
];

const dominante: SunburstNode[] = [
  {
    label: "Solar",
    color: "var(--chart-2)",
    children: [
      { label: "Techos", value: 420 },
      { label: "Parques", value: 60 },
    ],
  },
  {
    label: "Eólica",
    color: "var(--chart-4)",
    children: [{ label: "Costa", value: 45 }],
  },
];

export default function SunburstChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="dos niveles con formato por defecto"
        code={`import type { SunburstNode } from "@carlos-burelo/klin";
import { SunburstChart } from "@carlos-burelo/klin";

const matricula: SunburstNode[] = [
  {
    label: "Primaria",
    children: [
      { label: "Primero", value: 120 },
      { label: "Segundo", value: 110 },
      { label: "Tercero", value: 95 },
    ],
  },
  {
    label: "Secundaria",
    children: [
      { label: "Primero", value: 80 },
      { label: "Segundo", value: 70 },
    ],
  },
];

<SunburstChart
  data={matricula}
  ariaLabel="Matrícula por nivel y grado escolar"
/>`}
      >
        <SunburstChart
          data={matricula}
          ariaLabel="Matrícula por nivel y grado escolar"
        />
      </DemoExample>
      <DemoExample
        caption="tres niveles con formato moneda"
        code={`import type { SunburstNode } from "@carlos-burelo/klin";
import { SunburstChart } from "@carlos-burelo/klin";

const gasto: SunburstNode[] = [
  {
    label: "Nómina",
    children: [
      { label: "Docentes", value: 3_200_000 },
      {
        label: "Apoyo",
        value: 1_000_000,
        children: [
          { label: "Limpieza", value: 400_000 },
          { label: "Vigilancia", value: 600_000 },
        ],
      },
    ],
  },
  {
    label: "Obra",
    children: [
      { label: "Aulas", value: 900_000 },
      { label: "Patio", value: 500_000 },
    ],
  },
];

<SunburstChart
  data={gasto}
  format={(v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v)
  }
  ariaLabel="Gasto por rubro y subrubro en pesos"
/>`}
      >
        <SunburstChart
          data={gasto}
          format={(v) =>
            new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              maximumFractionDigits: 0,
            }).format(v)
          }
          ariaLabel="Gasto por rubro y subrubro en pesos"
        />
      </DemoExample>
      <DemoExample
        caption="jerarquía dominada por una rama con colores"
        code={`import type { SunburstNode } from "@carlos-burelo/klin";
import { SunburstChart } from "@carlos-burelo/klin";

const dominante: SunburstNode[] = [
  {
    label: "Solar",
    color: "var(--chart-2)",
    children: [
      { label: "Techos", value: 420 },
      { label: "Parques", value: 60 },
    ],
  },
  {
    label: "Eólica",
    color: "var(--chart-4)",
    children: [{ label: "Costa", value: 45 }],
  },
];

<SunburstChart
  data={dominante}
  format={(v) => \`\${v} GWh\`}
  ariaLabel="Generación renovable dominada por solar en gigavatios hora"
/>`}
      >
        <SunburstChart
          data={dominante}
          format={(v) => `${v} GWh`}
          ariaLabel="Generación renovable dominada por solar en gigavatios hora"
        />
      </DemoExample>
    </div>
  );
}
