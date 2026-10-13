import { ComboChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const data = [
  { mes: "Ene", soles: 30, nubes: 12, lluvia: 80 },
  { mes: "Feb", soles: 45, nubes: 9, lluvia: 60 },
  { mes: "Mar", soles: 38, nubes: 15, lluvia: 95 },
];

export default function ComboChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Barras y línea en un solo eje"
        code={`import { ComboChart } from "@carlos-burelo/klin";

const data = [
  { mes: "Ene", soles: 30, nubes: 12, lluvia: 80 },
  { mes: "Feb", soles: 45, nubes: 9, lluvia: 60 },
  { mes: "Mar", soles: 38, nubes: 15, lluvia: 95 },
];

<ComboChart
  ariaLabel="Barras de clima y línea de lluvia por mes"
  data={data}
  xKey="mes"
  bars={[
    { key: "soles", label: "Soles" },
    { key: "nubes", label: "Nubes" },
  ]}
  lines={[{ key: "lluvia", label: "Lluvia" }]}
/>`}
      >
        <ComboChart
          ariaLabel="Barras de clima y línea de lluvia por mes"
          data={data}
          xKey="mes"
          bars={[
            { key: "soles", label: "Soles" },
            { key: "nubes", label: "Nubes" },
          ]}
          lines={[{ key: "lluvia", label: "Lluvia" }]}
        />
      </DemoExample>
      <DemoExample
        caption="Línea con escala propia a la derecha"
        code={`import { ComboChart } from "@carlos-burelo/klin";

<ComboChart
  ariaLabel="Ventas en barras y ticket medio en línea con doble eje"
  data={data}
  xKey="mes"
  bars={[{ key: "soles", label: "Soles" }]}
  lines={[{ key: "lluvia", label: "Lluvia" }]}
  yAxisRight
/>`}
      >
        <ComboChart
          ariaLabel="Ventas en barras y línea con doble eje"
          data={data}
          xKey="mes"
          bars={[{ key: "soles", label: "Soles" }]}
          lines={[{ key: "lluvia", label: "Lluvia" }]}
          yAxisRight
        />
      </DemoExample>
    </div>
  );
}
