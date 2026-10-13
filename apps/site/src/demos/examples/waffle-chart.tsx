import type { WafflePart } from "@carlos-burelo/klin";
import { WaffleChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const usos: WafflePart[] = [
  { label: "Hogares", value: 45 },
  { label: "Industria", value: 35 },
  { label: "Riego", value: 20 },
];

const binario: WafflePart[] = [
  { label: "Aprobado", value: 68 },
  { label: "Rechazado", value: 32 },
];

const fragmentado: WafflePart[] = [
  { label: "Solar", value: 42 },
  { label: "Hidro", value: 28 },
  { label: "Eólica", value: 17 },
  { label: "Geotermia", value: 9 },
  { label: "Otros", value: 4 },
];

export default function WaffleChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="tres partes con leyenda"
        code={`import type { WafflePart } from "@carlos-burelo/klin";
import { WaffleChart } from "@carlos-burelo/klin";

const usos: WafflePart[] = [
  { label: "Hogares", value: 45 },
  { label: "Industria", value: 35 },
  { label: "Riego", value: 20 },
];

<WaffleChart
  parts={usos}
  ariaLabel="Uso del agua en hogares, industria y riego"
/>`}
      >
        <div className="flex justify-center">
          <WaffleChart
            parts={usos}
            ariaLabel="Uso del agua en hogares, industria y riego"
          />
        </div>
      </DemoExample>
      <DemoExample
        caption="dos partes con colores por parte y sin leyenda"
        code={`import type { WafflePart } from "@carlos-burelo/klin";
import { WaffleChart } from "@carlos-burelo/klin";

const binario: WafflePart[] = [
  { label: "Aprobado", value: 68 },
  { label: "Rechazado", value: 32 },
];

<WaffleChart
  parts={binario}
  itemColor={(part) =>
    part.label === "Aprobado" ? "var(--chart-2)" : "var(--chart-5)"
  }
  showLegend={false}
  ariaLabel="Votación con 68 por ciento a favor y 32 en contra"
/>`}
      >
        <div className="flex justify-center">
          <WaffleChart
            parts={binario}
            itemColor={(part) =>
              part.label === "Aprobado" ? "var(--chart-2)" : "var(--chart-5)"
            }
            showLegend={false}
            ariaLabel="Votación con 68 por ciento a favor y 32 en contra"
          />
        </div>
      </DemoExample>
      <DemoExample
        caption="cinco partes con una mínima de 4 por ciento"
        code={`import type { WafflePart } from "@carlos-burelo/klin";
import { WaffleChart } from "@carlos-burelo/klin";

const fragmentado: WafflePart[] = [
  { label: "Solar", value: 42 },
  { label: "Hidro", value: 28 },
  { label: "Eólica", value: 17 },
  { label: "Geotermia", value: 9 },
  { label: "Otros", value: 4 },
];

<WaffleChart
  parts={fragmentado}
  format={(v) => \`\${Math.round(v)} de 100\`}
  ariaLabel="Matriz eléctrica con cinco fuentes y otros en 4 por ciento"
/>`}
      >
        <div className="flex justify-center">
          <WaffleChart
            parts={fragmentado}
            format={(v) => `${Math.round(v)} de 100`}
            ariaLabel="Matriz eléctrica con cinco fuentes y otros en 4 por ciento"
          />
        </div>
      </DemoExample>
    </div>
  );
}
