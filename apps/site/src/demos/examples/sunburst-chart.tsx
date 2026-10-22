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

const estresRamas: SunburstNode[] = [
  {
    label: "Solar",
    children: [
      { label: "Techos residenciales", value: 420 },
      { label: "Techos industriales", value: 260 },
      { label: "Parques solares", value: 180 },
      { label: "Huertos comunitarios", value: 90 },
      { label: "Señalización vial", value: 40 },
      { label: "Pilotos rurales", value: 12 },
    ],
  },
  {
    label: "Eólica",
    children: [
      {
        label: "Costa",
        children: [
          { label: "Parque norte", value: 120 },
          { label: "Parque sur", value: 80 },
          { label: "Piloto marino", value: 25 },
        ],
      },
      {
        label: "Interior",
        children: [
          { label: "Sierra", value: 95 },
          { label: "Valle", value: 60 },
          { label: "Aerogeneradores caseros", value: 15 },
        ],
      },
    ],
  },
  {
    label: "Hidro",
    children: [
      { label: "Presa grande", value: 820 },
      { label: "Presa mediana", value: 310 },
      { label: "Minihidro", value: 120 },
      { label: "Rebombeo", value: 70 },
      { label: "Ríos", value: 35 },
      { label: "Microturbinas", value: 9 },
    ],
  },
  {
    label: "Geotermia",
    children: [
      { label: "Campo uno", value: 140 },
      { label: "Campo dos", value: 90 },
      { label: "Piloto", value: 45 },
      { label: "Usos directos", value: 28 },
      { label: "Balnearios", value: 14 },
      { label: "Exploración", value: 6 },
    ],
  },
  {
    label: "Biomasa",
    children: [
      { label: "Bagazo", value: 110 },
      { label: "Leña sustentable", value: 75 },
      { label: "Biogás", value: 50 },
      { label: "Residuos", value: 30 },
      { label: "Pellets", value: 16 },
      { label: "Pilotos", value: 5 },
    ],
  },
  {
    label: "Otras",
    children: [
      { label: "Mareomotriz", value: 22 },
      { label: "Undimotriz", value: 14 },
      { label: "Hidrógeno verde", value: 11 },
      { label: "Residuos sólidos", value: 8 },
      { label: "Calor residual", value: 4 },
      { label: "Experimentos", value: 2 },
    ],
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
      <DemoExample
        caption="colores por anillo con itemColor"
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
  itemColor={(node) =>
    node.label === "Primaria" ? "var(--chart-2)" : "var(--chart-4)"
  }
  ariaLabel="Matrícula por nivel y grado con un color por rama"
/>`}
      >
        <SunburstChart
          data={matricula}
          itemColor={(node) =>
            node.label === "Primaria" ? "var(--chart-2)" : "var(--chart-4)"
          }
          ariaLabel="Matrícula por nivel y grado con un color por rama"
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: jerarquía de 3 niveles con 36 anillos, varios mínimos y nombres largos"
        code={`import type { SunburstNode } from "@carlos-burelo/klin";
import { SunburstChart } from "@carlos-burelo/klin";

const estresRamas: SunburstNode[] = [
  {
    label: "Solar",
    children: [
      { label: "Techos residenciales", value: 420 },
      { label: "Techos industriales", value: 260 },
      { label: "Parques solares", value: 180 },
      { label: "Huertos comunitarios", value: 90 },
      { label: "Señalización vial", value: 40 },
      { label: "Pilotos rurales", value: 12 },
    ],
  },
  {
    label: "Eólica",
    children: [
      {
        label: "Costa",
        children: [
          { label: "Parque norte", value: 120 },
          { label: "Parque sur", value: 80 },
          { label: "Piloto marino", value: 25 },
        ],
      },
      {
        label: "Interior",
        children: [
          { label: "Sierra", value: 95 },
          { label: "Valle", value: 60 },
          { label: "Aerogeneradores caseros", value: 15 },
        ],
      },
    ],
  },
  {
    label: "Hidro",
    children: [
      { label: "Presa grande", value: 820 },
      { label: "Presa mediana", value: 310 },
      { label: "Minihidro", value: 120 },
      { label: "Rebombeo", value: 70 },
      { label: "Ríos", value: 35 },
      { label: "Microturbinas", value: 9 },
    ],
  },
  {
    label: "Geotermia",
    children: [
      { label: "Campo uno", value: 140 },
      { label: "Campo dos", value: 90 },
      { label: "Piloto", value: 45 },
      { label: "Usos directos", value: 28 },
      { label: "Balnearios", value: 14 },
      { label: "Exploración", value: 6 },
    ],
  },
  {
    label: "Biomasa",
    children: [
      { label: "Bagazo", value: 110 },
      { label: "Leña sustentable", value: 75 },
      { label: "Biogás", value: 50 },
      { label: "Residuos", value: 30 },
      { label: "Pellets", value: 16 },
      { label: "Pilotos", value: 5 },
    ],
  },
  {
    label: "Otras",
    children: [
      { label: "Mareomotriz", value: 22 },
      { label: "Undimotriz", value: 14 },
      { label: "Hidrógeno verde", value: 11 },
      { label: "Residuos sólidos", value: 8 },
      { label: "Calor residual", value: 4 },
      { label: "Experimentos", value: 2 },
    ],
  },
];

<SunburstChart
  data={estresRamas}
  format={(v) => \`\${v} GWh\`}
  ariaLabel="Generación renovable con seis fuentes y 36 ramas en gigavatios hora: hidro domina y hay ramas mínimas"
/>`}
      >
        <SunburstChart
          data={estresRamas}
          format={(v) => `${v} GWh`}
          ariaLabel="Generación renovable con seis fuentes y 36 ramas en gigavatios hora: hidro domina y hay ramas mínimas"
        />
      </DemoExample>
    </div>
  );
}
