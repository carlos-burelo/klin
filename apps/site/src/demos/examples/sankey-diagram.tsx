import type { SankeyFlow, SankeyNode } from "@carlos-burelo/klin";
import { SankeyDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const nodosEnergia: SankeyNode[] = [
  { id: "gen", label: "Generación" },
  { id: "trans", label: "Transmisión" },
  { id: "hog", label: "Hogares" },
  { id: "ind", label: "Industria" },
];

const flujosEnergia: SankeyFlow[] = [
  { from: "gen", to: "trans", value: 500 },
  { from: "trans", to: "hog", value: 300 },
  { from: "trans", to: "ind", value: 200 },
];

const nodosWeb: SankeyNode[] = [
  { id: "vis", label: "Visitas" },
  { id: "reg", label: "Registro" },
  { id: "pago", label: "Pago" },
  { id: "aban", label: "Abandono" },
];

const flujosWeb: SankeyFlow[] = [
  { from: "vis", to: "reg", value: 1200 },
  { from: "vis", to: "aban", value: 3800 },
  { from: "reg", to: "pago", value: 640 },
  { from: "reg", to: "aban", value: 560 },
];

const nodosRiego: SankeyNode[] = [
  { id: "presa", label: "Presa" },
  { id: "canal", label: "Canal" },
  { id: "parc", label: "Parcelas" },
];

const flujosRiego: SankeyFlow[] = [
  { from: "presa", to: "canal", value: 90 },
  { from: "canal", to: "parc", value: 74 },
];

export default function SankeyDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="flujos de energía con leyenda"
        code={`import type { SankeyFlow, SankeyNode } from "@carlos-burelo/klin";
import { SankeyDiagram } from "@carlos-burelo/klin";

const nodosEnergia: SankeyNode[] = [
  { id: "gen", label: "Generación" },
  { id: "trans", label: "Transmisión" },
  { id: "hog", label: "Hogares" },
  { id: "ind", label: "Industria" },
];

const flujosEnergia: SankeyFlow[] = [
  { from: "gen", to: "trans", value: 500 },
  { from: "trans", to: "hog", value: 300 },
  { from: "trans", to: "ind", value: 200 },
];

<SankeyDiagram
  nodes={nodosEnergia}
  flows={flujosEnergia}
  ariaLabel="Flujo de energía de generación a hogares e industria"
/>`}
      >
        <SankeyDiagram
          nodes={nodosEnergia}
          flows={flujosEnergia}
          ariaLabel="Flujo de energía de generación a hogares e industria"
        />
      </DemoExample>
      <DemoExample
        caption="embudo web con formato de miles y sin leyenda"
        code={`import type { SankeyFlow, SankeyNode } from "@carlos-burelo/klin";
import { SankeyDiagram } from "@carlos-burelo/klin";

const nodosWeb: SankeyNode[] = [
  { id: "vis", label: "Visitas" },
  { id: "reg", label: "Registro" },
  { id: "pago", label: "Pago" },
  { id: "aban", label: "Abandono" },
];

const flujosWeb: SankeyFlow[] = [
  { from: "vis", to: "reg", value: 1200 },
  { from: "vis", to: "aban", value: 3800 },
  { from: "reg", to: "pago", value: 640 },
  { from: "reg", to: "aban", value: 560 },
];

<SankeyDiagram
  nodes={nodosWeb}
  flows={flujosWeb}
  format={(v) => new Intl.NumberFormat("es-MX").format(v)}
  showLegend={false}
  ariaLabel="Conversión de visitas a pago con abandono"
/>`}
      >
        <SankeyDiagram
          nodes={nodosWeb}
          flows={flujosWeb}
          format={(v) => new Intl.NumberFormat("es-MX").format(v)}
          showLegend={false}
          ariaLabel="Conversión de visitas a pago con abandono"
        />
      </DemoExample>
      <DemoExample
        caption="cadena corta con colores por nodo"
        code={`import type { SankeyFlow, SankeyNode } from "@carlos-burelo/klin";
import { SankeyDiagram } from "@carlos-burelo/klin";

const nodosRiego: SankeyNode[] = [
  { id: "presa", label: "Presa" },
  { id: "canal", label: "Canal" },
  { id: "parc", label: "Parcelas" },
];

const flujosRiego: SankeyFlow[] = [
  { from: "presa", to: "canal", value: 90 },
  { from: "canal", to: "parc", value: 74 },
];

<SankeyDiagram
  nodes={nodosRiego.map((n, i) => ({
    ...n,
    color: \`var(--chart-\${i + 1})\`,
  }))}
  flows={flujosRiego}
  format={(v) => \`\${v} Mm³\`}
  ariaLabel="Distribución de agua de presa a parcelas en millones de metros cúbicos"
/>`}
      >
        <SankeyDiagram
          nodes={nodosRiego.map((n, i) => ({
            ...n,
            color: `var(--chart-${i + 1})`,
          }))}
          flows={flujosRiego}
          format={(v) => `${v} Mm³`}
          ariaLabel="Distribución de agua de presa a parcelas en millones de metros cúbicos"
        />
      </DemoExample>
    </div>
  );
}
