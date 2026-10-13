import type { HexPoint } from "@carlos-burelo/klin";
import { HexbinPlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const repartos: HexPoint[] = [
  { x: 2.1, y: 16 },
  { x: 3.4, y: 22 },
  { x: 4.0, y: 25 },
  { x: 2.8, y: 19 },
  { x: 5.2, y: 28 },
  { x: 3.1, y: 21 },
  { x: 4.6, y: 27 },
  { x: 2.4, y: 17 },
  { x: 5.8, y: 31 },
  { x: 3.7, y: 24 },
];

const trafico: HexPoint[] = [
  { x: 8, y: 22 },
  { x: 9, y: 19 },
  { x: 18, y: 45 },
  { x: 19, y: 52 },
  { x: 8.5, y: 24 },
  { x: 18.5, y: 48 },
  { x: 9.5, y: 21 },
  { x: 19.5, y: 55 },
  { x: 8.2, y: 23 },
  { x: 18.2, y: 50 },
];

const sensores: HexPoint[] = [
  { x: 21.5, y: 58 },
  { x: 22.1, y: 61 },
  { x: 23.4, y: 55 },
  { x: 24.0, y: 66 },
  { x: 22.8, y: 59 },
  { x: 25.2, y: 70 },
  { x: 21.9, y: 57 },
  { x: 24.6, y: 64 },
  { x: 23.0, y: 62 },
  { x: 26.1, y: 73 },
];

export default function HexbinPlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="agregado básico de distancia y tiempo"
        code={`import type { HexPoint } from "@carlos-burelo/klin";
import { HexbinPlot } from "@carlos-burelo/klin";

const repartos: HexPoint[] = [
  { x: 2.1, y: 16 },
  { x: 3.4, y: 22 },
  { x: 4.0, y: 25 },
  { x: 2.8, y: 19 },
  { x: 5.2, y: 28 },
  { x: 3.1, y: 21 },
  { x: 4.6, y: 27 },
  { x: 2.4, y: 17 },
  { x: 5.8, y: 31 },
  { x: 3.7, y: 24 },
];

<HexbinPlot
  points={repartos}
  ariaLabel="Distancia frente a tiempo de entrega en repartos de última milla"
/>`}
      >
        <HexbinPlot
          points={repartos}
          ariaLabel="Distancia frente a tiempo de entrega en repartos de última milla"
        />
      </DemoExample>
      <DemoExample
        caption="celdas más grandes con radio personalizado"
        code={`import type { HexPoint } from "@carlos-burelo/klin";
import { HexbinPlot } from "@carlos-burelo/klin";

const trafico: HexPoint[] = [
  { x: 8, y: 22 },
  { x: 9, y: 19 },
  { x: 18, y: 45 },
  { x: 19, y: 52 },
  { x: 8.5, y: 24 },
  { x: 18.5, y: 48 },
  { x: 9.5, y: 21 },
  { x: 19.5, y: 55 },
  { x: 8.2, y: 23 },
  { x: 18.2, y: 50 },
];

<HexbinPlot
  points={trafico}
  radius={16}
  ariaLabel="Hora del día frente a velocidad promedio con dos picos de tráfico"
/>`}
      >
        <HexbinPlot
          points={trafico}
          radius={16}
          ariaLabel="Hora del día frente a velocidad promedio con dos picos de tráfico"
        />
      </DemoExample>
      <DemoExample
        caption="formato de conteo y sin leyenda"
        code={`import type { HexPoint } from "@carlos-burelo/klin";
import { HexbinPlot } from "@carlos-burelo/klin";

const sensores: HexPoint[] = [
  { x: 21.5, y: 58 },
  { x: 22.1, y: 61 },
  { x: 23.4, y: 55 },
  { x: 24.0, y: 66 },
  { x: 22.8, y: 59 },
  { x: 25.2, y: 70 },
  { x: 21.9, y: 57 },
  { x: 24.6, y: 64 },
  { x: 23.0, y: 62 },
  { x: 26.1, y: 73 },
];

<HexbinPlot
  points={sensores}
  formatValue={(v: number) => \`\${v} lecturas\`}
  showLegend={false}
  ariaLabel="Temperatura frente a humedad de sensores meteorológicos en campo"
/>`}
      >
        <HexbinPlot
          points={sensores}
          formatValue={(v: number) => `${v} lecturas`}
          showLegend={false}
          ariaLabel="Temperatura frente a humedad de sensores meteorológicos en campo"
        />
      </DemoExample>
    </div>
  );
}
