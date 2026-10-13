import type { RadialBarDatum } from "@carlos-burelo/klin";
import { RadialBarChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const servicios: RadialBarDatum[] = [
  { label: "Electricidad", value: 99 },
  { label: "Agua entubada", value: 94 },
  { label: "Drenaje", value: 89 },
  { label: "Internet", value: 71 },
];

const obras: RadialBarDatum[] = [
  { label: "Alumbrado", value: 92 },
  { label: "Bacheo", value: 67 },
  { label: "Parques", value: 45 },
];

const museos: RadialBarDatum[] = [
  { label: "Antropología", value: 21000, max: 25000 },
  { label: "Frida Kahlo", value: 15000, max: 16000 },
  { label: "Templo Mayor", value: 9000, max: 12000 },
];

export default function RadialBarChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Cobertura de servicios con meta de 100"
        code={`import type { RadialBarDatum } from "@carlos-burelo/klin";
import { RadialBarChart } from "@carlos-burelo/klin";

const servicios: RadialBarDatum[] = [
  { label: "Electricidad", value: 99 },
  { label: "Agua entubada", value: 94 },
  { label: "Drenaje", value: 89 },
  { label: "Internet", value: 71 },
];

<RadialBarChart
  series={servicios}
  formatValue={(v: number) => \`\${v} %\`}
  ariaLabel="Cobertura de servicios en la vivienda en porcentaje: electricidad casi universal e internet es el más rezagado"
/>`}
      >
        <RadialBarChart
          series={servicios}
          formatValue={(v: number) => `${v} %`}
          ariaLabel="Cobertura de servicios en la vivienda en porcentaje: electricidad casi universal e internet es el más rezagado"
        />
      </DemoExample>
      <DemoExample
        caption="Avance de obras sin leyenda"
        code={`import type { RadialBarDatum } from "@carlos-burelo/klin";
import { RadialBarChart } from "@carlos-burelo/klin";

const obras: RadialBarDatum[] = [
  { label: "Alumbrado", value: 92 },
  { label: "Bacheo", value: 67 },
  { label: "Parques", value: 45 },
];

<RadialBarChart
  series={obras}
  formatValue={(v: number) => \`\${v} %\`}
  showLegend={false}
  ariaLabel="Avance del plan municipal de obras en porcentaje: alumbrado casi terminado y parques va a menos de la mitad"
/>`}
      >
        <RadialBarChart
          series={obras}
          formatValue={(v: number) => `${v} %`}
          showLegend={false}
          ariaLabel="Avance del plan municipal de obras en porcentaje: alumbrado casi terminado y parques va a menos de la mitad"
        />
      </DemoExample>
      <DemoExample
        caption="Aforos distintos por museo con miles"
        code={`import type { RadialBarDatum } from "@carlos-burelo/klin";
import { RadialBarChart } from "@carlos-burelo/klin";

const museos: RadialBarDatum[] = [
  { label: "Antropología", value: 21000, max: 25000 },
  { label: "Frida Kahlo", value: 15000, max: 16000 },
  { label: "Templo Mayor", value: 9000, max: 12000 },
];

<RadialBarChart
  series={museos}
  formatValue={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
  ariaLabel="Visitantes mensuales frente al aforo por museo: Frida Kahlo opera casi al límite y Templo Mayor tiene más holgura"
/>`}
      >
        <RadialBarChart
          series={museos}
          formatValue={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
          ariaLabel="Visitantes mensuales frente al aforo por museo: Frida Kahlo opera casi al límite y Templo Mayor tiene más holgura"
        />
      </DemoExample>
    </div>
  );
}
