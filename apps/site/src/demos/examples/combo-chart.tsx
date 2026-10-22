import { ComboChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const data = [
  { mes: "Ene", soles: 30, nubes: 12, lluvia: 80 },
  { mes: "Feb", soles: 45, nubes: 9, lluvia: 60 },
  { mes: "Mar", soles: 38, nubes: 15, lluvia: 95 },
];

const dataDobleEje = [
  { mes: "Ene", soles: 30, lluvia: 800 },
  { mes: "Feb", soles: 45, lluvia: 600 },
  { mes: "Mar", soles: 38, lluvia: 950 },
];

const comboEstres: Array<Record<string, string | number>> = Array.from(
  { length: 24 },
  (_, i) => ({
    empresa: `Sucursal ${i + 1} del Corporativo Industrial del Norte S.A. de C.V.`,
    contado: Math.round(120 + 60 * Math.sin(i / 3) + ((i * 7) % 13)),
    credito: Math.round(90 + 50 * Math.cos(i / 4) + ((i * 5) % 11)),
    rezago: Math.round(40 + 30 * Math.abs(Math.cos(i * 0.9)) + ((i * 3) % 7)),
    meta: 150 + (i % 4) * 5,
    devoluciones:
      i % 6 === 0
        ? Number.NaN
        : Math.round(20 + 15 * Math.abs(Math.sin(i * 1.7))),
  }),
);

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
      <DemoExample
        caption="Doble eje con línea a la derecha y formato en milímetros"
        code={`import { ComboChart } from "@carlos-burelo/klin";

const dataDobleEje = [
  { mes: "Ene", soles: 30, lluvia: 800 },
  { mes: "Feb", soles: 45, lluvia: 600 },
  { mes: "Mar", soles: 38, lluvia: 950 },
];

<ComboChart
  ariaLabel="Soles en barras a la izquierda y lluvia en línea con escala propia a la derecha"
  data={dataDobleEje}
  xKey="mes"
  bars={[{ key: "soles", label: "Soles" }]}
  lines={[{ key: "lluvia", label: "Lluvia", axis: "right" }]}
  yMinR={0}
  yMaxR={1000}
  formatYR={(v: number) => \`\${v} mm\`}
/>`}
      >
        <ComboChart
          ariaLabel="Soles en barras a la izquierda y lluvia en línea con escala propia a la derecha"
          data={dataDobleEje}
          xKey="mes"
          bars={[{ key: "soles", label: "Soles" }]}
          lines={[{ key: "lluvia", label: "Lluvia", axis: "right" }]}
          yMinR={0}
          yMaxR={1000}
          formatYR={(v: number) => `${v} mm`}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 24 sucursales con nombres largos, 3 barras y 2 líneas con huecos NaN"
        code={`import { ComboChart } from "@carlos-burelo/klin";

const comboEstres: Array<Record<string, string | number>> = Array.from(
  { length: 24 },
  (_, i) => ({
    empresa: \`Sucursal \${i + 1} del Corporativo Industrial del Norte S.A. de C.V.\`,
    contado: Math.round(120 + 60 * Math.sin(i / 3) + ((i * 7) % 13)),
    credito: Math.round(90 + 50 * Math.cos(i / 4) + ((i * 5) % 11)),
    rezago: Math.round(40 + 30 * Math.abs(Math.cos(i * 0.9)) + ((i * 3) % 7)),
    meta: 150 + (i % 4) * 5,
    devoluciones:
      i % 6 === 0
        ? Number.NaN
        : Math.round(20 + 15 * Math.abs(Math.sin(i * 1.7))),
  }),
);

<ComboChart
  ariaLabel="Ventas por sucursal en barras con meta y devoluciones en línea con huecos"
  data={comboEstres}
  xKey="empresa"
  bars={[
    { key: "contado", label: "Contado" },
    { key: "credito", label: "Crédito" },
    { key: "rezago", label: "Rezago" },
  ]}
  lines={[
    { key: "meta", label: "Meta" },
    { key: "devoluciones", label: "Devoluciones" },
  ]}
  barRadius={0}
/>`}
      >
        <ComboChart
          ariaLabel="Ventas por sucursal en barras con meta y devoluciones en línea con huecos"
          data={comboEstres}
          xKey="empresa"
          bars={[
            { key: "contado", label: "Contado" },
            { key: "credito", label: "Crédito" },
            { key: "rezago", label: "Rezago" },
          ]}
          lines={[
            { key: "meta", label: "Meta" },
            { key: "devoluciones", label: "Devoluciones" },
          ]}
          barRadius={0}
        />
      </DemoExample>
    </div>
  );
}
