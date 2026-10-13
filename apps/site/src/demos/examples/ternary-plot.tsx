import { TernaryPlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function TernaryPlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Suelos agrícolas con vértices rotulados"
        code={`import { TernaryPlot } from "@carlos-burelo/klin";

const data = [
  { a: 60, b: 25, c: 15, label: "Sonora" },
  { a: 40, b: 35, c: 25, label: "Jalisco" },
  { a: 25, b: 30, c: 45, label: "Oaxaca" },
  { a: 20, b: 35, c: 45, label: "Chiapas" },
];

<TernaryPlot
  ariaLabel="Composición de suelos por estado, Sonora es arenoso y Chiapas arcilloso"
  aLabel="Arena"
  bLabel="Limo"
  cLabel="Arcilla"
  points={data}
/>`}
      >
        <TernaryPlot
          ariaLabel="Composición de suelos por estado, Sonora es arenoso y Chiapas arcilloso"
          aLabel="Arena"
          bLabel="Limo"
          cLabel="Arcilla"
          points={[
            { a: 60, b: 25, c: 15, label: "Sonora" },
            { a: 40, b: 35, c: 25, label: "Jalisco" },
            { a: 25, b: 30, c: 45, label: "Oaxaca" },
            { a: 20, b: 35, c: 45, label: "Chiapas" },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Presupuesto municipal sin leyenda"
        code={`import { TernaryPlot } from "@carlos-burelo/klin";

const data = [
  { a: 55, b: 25, c: 20, label: "Mérida" },
  { a: 62, b: 20, c: 18, label: "Kanasín" },
  { a: 48, b: 30, c: 22, label: "Valladolid" },
  { a: 40, b: 28, c: 32, label: "Tizimín" },
];

<TernaryPlot
  ariaLabel="Reparto del presupuesto municipal, la nómina supera la mitad en Kanasín"
  aLabel="Nómina"
  bLabel="Operación"
  cLabel="Inversión"
  points={data}
  showLegend={false}
/>`}
      >
        <TernaryPlot
          ariaLabel="Reparto del presupuesto municipal, la nómina supera la mitad en Kanasín"
          aLabel="Nómina"
          bLabel="Operación"
          cLabel="Inversión"
          points={[
            { a: 55, b: 25, c: 20, label: "Mérida" },
            { a: 62, b: 20, c: 18, label: "Kanasín" },
            { a: 48, b: 30, c: 22, label: "Valladolid" },
            { a: 40, b: 28, c: 32, label: "Tizimín" },
          ]}
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Mezcla eléctrica con formato de porcentaje"
        code={`import { TernaryPlot } from "@carlos-burelo/klin";

const data = [
  { a: 45, b: 30, c: 25, label: "Baja California" },
  { a: 20, b: 25, c: 55, label: "Chiapas" },
  { a: 35, b: 40, c: 25, label: "Oaxaca" },
  { a: 55, b: 20, c: 25, label: "Sonora" },
];

<TernaryPlot
  ariaLabel="Mezcla eléctrica por estado, Chiapas es hidroeléctrico y Sonora solar"
  aLabel="Solar"
  bLabel="Eólica"
  cLabel="Hidro"
  points={data}
  format={(v: number) => \`\${v.toFixed(0)} %\`}
/>`}
      >
        <TernaryPlot
          ariaLabel="Mezcla eléctrica por estado, Chiapas es hidroeléctrico y Sonora solar"
          aLabel="Solar"
          bLabel="Eólica"
          cLabel="Hidro"
          points={[
            { a: 45, b: 30, c: 25, label: "Baja California" },
            { a: 20, b: 25, c: 55, label: "Chiapas" },
            { a: 35, b: 40, c: 25, label: "Oaxaca" },
            { a: 55, b: 20, c: 25, label: "Sonora" },
          ]}
          format={(v: number) => `${v.toFixed(0)} %`}
        />
      </DemoExample>
    </div>
  );
}
