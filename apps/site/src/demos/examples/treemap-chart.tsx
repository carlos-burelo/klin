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
    </div>
  );
}
