import type { TreemapNode } from "@carlos-burelo/klin";
import { TreemapChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const plano: TreemapNode[] = [
  { label: "Nómina", value: 4_200_000 },
  { label: "Obra", value: 2_000_000 },
  { label: "Servicios", value: 800_000 },
  { label: "Becas", value: 500_000 },
];

const anidado: TreemapNode[] = [
  {
    label: "Nómina",
    children: [
      { label: "Docentes", value: 3_200_000 },
      { label: "Apoyo", value: 1_000_000 },
    ],
  },
  {
    label: "Obra",
    children: [
      { label: "Aulas", value: 1_400_000 },
      { label: "Patio", value: 600_000 },
    ],
  },
  { label: "Servicios", value: 800_000 },
];

const desigual: TreemapNode[] = [
  { label: "Hidro", value: 820 },
  { label: "Solar", value: 120 },
  { label: "Eólica", value: 60 },
  { label: "Geotermia", value: 18 },
];

const estresNiveles: TreemapNode[] = [
  {
    label: "Nómina",
    children: [
      { label: "Docentes frente a grupo", value: 3200 },
      { label: "Personal de apoyo", value: 1000 },
      { label: "Honorarios", value: 640 },
      { label: "Capacitación", value: 320 },
      { label: "Viáticos", value: 140 },
      { label: "Uniformes", value: 60 },
    ],
  },
  {
    label: "Obra",
    children: [
      {
        label: "Edificios",
        children: [
          { label: "Aulas nuevas", value: 1400 },
          { label: "Laboratorios", value: 700 },
          { label: "Baños", value: 220 },
        ],
      },
      {
        label: "Espacios abiertos",
        children: [
          { label: "Patio cívico", value: 600 },
          { label: "Canchas", value: 380 },
          { label: "Jardines", value: 90 },
        ],
      },
    ],
  },
  {
    label: "Servicios",
    children: [
      { label: "Luz", value: 900 },
      { label: "Agua", value: 620 },
      { label: "Internet", value: 540 },
      { label: "Limpieza", value: 410 },
      { label: "Vigilancia", value: 330 },
      { label: "Mantenimiento de climas", value: 45 },
    ],
  },
  {
    label: "Becas",
    children: [
      { label: "Excelencia", value: 800 },
      { label: "Transporte", value: 460 },
      { label: "Alimentos", value: 380 },
      { label: "Útiles", value: 210 },
      { label: "Deporte", value: 120 },
      { label: "Arte", value: 38 },
    ],
  },
  {
    label: "Salud",
    children: [
      { label: "Enfermería", value: 520 },
      { label: "Psicología", value: 340 },
      { label: "Nutrición", value: 260 },
      { label: "Vacunación", value: 150 },
      { label: "Botiquines", value: 80 },
      { label: "Lentes", value: 25 },
    ],
  },
  {
    label: "Cultura",
    children: [
      { label: "Talleres de música", value: 420 },
      { label: "Danza", value: 280 },
      { label: "Teatro", value: 190 },
      { label: "Biblioteca", value: 130 },
      { label: "Cine club", value: 70 },
      { label: "Fanzine", value: 18 },
    ],
  },
];

export default function TreemapChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="rubros planos con formato moneda"
        code={`import type { TreemapNode } from "@carlos-burelo/klin";
import { TreemapChart } from "@carlos-burelo/klin";

const plano: TreemapNode[] = [
  { label: "Nómina", value: 4_200_000 },
  { label: "Obra", value: 2_000_000 },
  { label: "Servicios", value: 800_000 },
  { label: "Becas", value: 500_000 },
];

<TreemapChart
  data={plano}
  format={(v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v)
  }
  ariaLabel="Presupuesto por rubro en pesos"
/>`}
      >
        <TreemapChart
          data={plano}
          format={(v) =>
            new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              maximumFractionDigits: 0,
            }).format(v)
          }
          ariaLabel="Presupuesto por rubro en pesos"
        />
      </DemoExample>
      <DemoExample
        caption="jerarquía anidada de dos niveles"
        code={`import type { TreemapNode } from "@carlos-burelo/klin";
import { TreemapChart } from "@carlos-burelo/klin";

const anidado: TreemapNode[] = [
  {
    label: "Nómina",
    children: [
      { label: "Docentes", value: 3_200_000 },
      { label: "Apoyo", value: 1_000_000 },
    ],
  },
  {
    label: "Obra",
    children: [
      { label: "Aulas", value: 1_400_000 },
      { label: "Patio", value: 600_000 },
    ],
  },
  { label: "Servicios", value: 800_000 },
];

<TreemapChart
  data={anidado}
  format={(v) => \`\${(v / 1_000_000).toFixed(1)} mdp\`}
  ariaLabel="Presupuesto anidado por rubro y subrubro en millones de pesos"
/>`}
      >
        <TreemapChart
          data={anidado}
          format={(v) => `${(v / 1_000_000).toFixed(1)} mdp`}
          ariaLabel="Presupuesto anidado por rubro y subrubro en millones de pesos"
        />
      </DemoExample>
      <DemoExample
        caption="distribución desigual con hoja mínima"
        code={`import type { TreemapNode } from "@carlos-burelo/klin";
import { TreemapChart } from "@carlos-burelo/klin";

const desigual: TreemapNode[] = [
  { label: "Hidro", value: 820 },
  { label: "Solar", value: 120 },
  { label: "Eólica", value: 60 },
  { label: "Geotermia", value: 18 },
];

<TreemapChart
  data={desigual.map((n, i) => ({
    ...n,
    color: \`var(--chart-\${i + 1})\`,
  }))}
  format={(v) => \`\${v} GWh\`}
  ariaLabel="Generación eléctrica desigual por fuente en gigavatios hora"
/>`}
      >
        <TreemapChart
          data={desigual.map((n, i) => ({
            ...n,
            color: `var(--chart-${i + 1})`,
          }))}
          format={(v) => `${v} GWh`}
          ariaLabel="Generación eléctrica desigual por fuente en gigavatios hora"
        />
      </DemoExample>
      <DemoExample
        caption="rubros planos con leyenda"
        code={`import type { TreemapNode } from "@carlos-burelo/klin";
import { TreemapChart } from "@carlos-burelo/klin";

const plano: TreemapNode[] = [
  { label: "Nómina", value: 4_200_000 },
  { label: "Obra", value: 2_000_000 },
  { label: "Servicios", value: 800_000 },
  { label: "Becas", value: 500_000 },
];

<TreemapChart
  data={plano}
  showLegend
  format={(v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v)
  }
  ariaLabel="Presupuesto por rubro en pesos con leyenda de grupos"
/>`}
      >
        <TreemapChart
          data={plano}
          showLegend
          format={(v) =>
            new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              maximumFractionDigits: 0,
            }).format(v)
          }
          ariaLabel="Presupuesto por rubro en pesos con leyenda de grupos"
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: jerarquía de 3 niveles con 36 hojas, varias mínimas y nombres largos"
        code={`import type { TreemapNode } from "@carlos-burelo/klin";
import { TreemapChart } from "@carlos-burelo/klin";

const estresNiveles: TreemapNode[] = [
  {
    label: "Nómina",
    children: [
      { label: "Docentes frente a grupo", value: 3200 },
      { label: "Personal de apoyo", value: 1000 },
      { label: "Honorarios", value: 640 },
      { label: "Capacitación", value: 320 },
      { label: "Viáticos", value: 140 },
      { label: "Uniformes", value: 60 },
    ],
  },
  {
    label: "Obra",
    children: [
      {
        label: "Edificios",
        children: [
          { label: "Aulas nuevas", value: 1400 },
          { label: "Laboratorios", value: 700 },
          { label: "Baños", value: 220 },
        ],
      },
      {
        label: "Espacios abiertos",
        children: [
          { label: "Patio cívico", value: 600 },
          { label: "Canchas", value: 380 },
          { label: "Jardines", value: 90 },
        ],
      },
    ],
  },
  {
    label: "Servicios",
    children: [
      { label: "Luz", value: 900 },
      { label: "Agua", value: 620 },
      { label: "Internet", value: 540 },
      { label: "Limpieza", value: 410 },
      { label: "Vigilancia", value: 330 },
      { label: "Mantenimiento de climas", value: 45 },
    ],
  },
  {
    label: "Becas",
    children: [
      { label: "Excelencia", value: 800 },
      { label: "Transporte", value: 460 },
      { label: "Alimentos", value: 380 },
      { label: "Útiles", value: 210 },
      { label: "Deporte", value: 120 },
      { label: "Arte", value: 38 },
    ],
  },
  {
    label: "Salud",
    children: [
      { label: "Enfermería", value: 520 },
      { label: "Psicología", value: 340 },
      { label: "Nutrición", value: 260 },
      { label: "Vacunación", value: 150 },
      { label: "Botiquines", value: 80 },
      { label: "Lentes", value: 25 },
    ],
  },
  {
    label: "Cultura",
    children: [
      { label: "Talleres de música", value: 420 },
      { label: "Danza", value: 280 },
      { label: "Teatro", value: 190 },
      { label: "Biblioteca", value: 130 },
      { label: "Cine club", value: 70 },
      { label: "Fanzine", value: 18 },
    ],
  },
];

<TreemapChart
  data={estresNiveles}
  format={(v) => \`\${(v / 1000).toFixed(1)} mil\`}
  ariaLabel="Presupuesto con seis rubros y 36 partidas en miles de pesos: nómina domina y hay partidas mínimas"
/>`}
      >
        <TreemapChart
          data={estresNiveles}
          format={(v) => `${(v / 1000).toFixed(1)} mil`}
          ariaLabel="Presupuesto con seis rubros y 36 partidas en miles de pesos: nómina domina y hay partidas mínimas"
        />
      </DemoExample>
    </div>
  );
}
